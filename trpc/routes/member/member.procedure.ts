import {
  members,
  templates,
  workspaceActivities,
  workspaceMetadata,
  workspaces,
} from "@/database/schema";
import { createTRPCRouter, twoFactorAuthenticatedProcedure } from "@/trpc/trpc";
import { inputAs } from "@/trpc/utils";
import Branded from "@/types/branded.type";
import {
  addMemberSchema,
  removeMemberSchema,
  updateMemberSchema,
} from "./member.schema";
import { TRPCError } from "@trpc/server";
import {
  makeMainLiveWithServices,
  provideAuth,
  provideDB,
  runWithServices,
} from "@/services";
import { canAddMembersEffect, isMemberEffect } from "@/services/access-layer";
import { and, eq } from "drizzle-orm";
import { object, string } from "zod";

const memberRouter = createTRPCRouter({
  all: twoFactorAuthenticatedProcedure
    .input(
      inputAs<{
        workspaceId: Branded.WorkspaceId;
      }>(),
    )
    .query(({ ctx, input }) => {
      const { db } = ctx;

      return db.query.members.findMany({
        where: (members, { eq }) => eq(members.workspaceId, input.workspaceId),
        with: {
          user: true,
        },
      });
    }),
  add: twoFactorAuthenticatedProcedure
    .input(addMemberSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      // check if the given user has access to add members
      const member = await db.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.userId, user.id),
            eq(members.workspaceId, input.workspaceId),
          ),
      });

      if (!member) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not a member of this workspace to perform this action",
        });
      }

      const hasAccess =
        member.role === "admin" ||
        member.permissions.includes("member_controls");

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to add members",
        });
      }

      // add the member
      const newMember = await db
        .insert(members)
        .values({
          isCreator: false,
          permissions: input.permissions,
          role: input.role,
          userId: input.userId,
          workspaceId: input.workspaceId,
        })
        .returning();

      // add member log

      await db.insert(workspaceActivities).values({
        workspaceId: input.workspaceId,
        event: "members_added",
        payload: newMember,
        performerId: member.id,
      });

      return newMember;
    }),
  remove: twoFactorAuthenticatedProcedure
    .input(removeMemberSchema)
    .mutation(
      async ({ ctx: { db, user }, input: { memberId, workspaceId } }) => {
        // check if the given user has access to add members
        const result = await runWithServices(
          canAddMembersEffect(Branded.WorkspaceId(workspaceId)),
        );

        if (!result) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to perform this task",
          });
        }

        // remove the member
        const deleted = await db
          .delete(members)
          .where(eq(members.id, memberId))
          .returning();

        return deleted;
      },
    ),
  edit: twoFactorAuthenticatedProcedure
    .input(updateMemberSchema)
    .mutation(async ({ ctx: { db, user }, input }) => {
      // check if the given user has access to add members
      const result = await runWithServices(
        canAddMembersEffect(Branded.WorkspaceId(input.workspaceId)),
      );

      if (!result) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this task",
        });
      }

      // update the member
      const updated = await db
        .update(members)
        .set({
          permissions: input.permissions,
          role: input.role,
          updatedAt: Date.now(),
        })
        .where(eq(members.id, input.id))
        .returning();

      return updated;
    }),
  get: twoFactorAuthenticatedProcedure
    .input(inputAs<{ id: Branded.WorkspaceId }>())
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      return db.query.members.findFirst({
        where: (members, { eq }) =>
          and(
            eq(members.workspaceId, input.id),
            eq(members.userId, ctx.user.id),
          ),
        with: {
          user: true,
        },
      });
    }),
  getRid: twoFactorAuthenticatedProcedure
    .input(inputAs<{ id: Branded.WorkspaceId }>())
    .mutation(async ({ ctx, input }) => {
      const dbService = provideDB(ctx.db);
      const authService = provideAuth({ session: ctx.session, user: ctx.user });
      const mainLayer = makeMainLiveWithServices(dbService, authService);

      const isMember = await runWithServices(
        isMemberEffect(input.id),
        mainLayer,
      );

      if (!isMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this workspace",
        });
      }

      const { isCreator } = isMember;

      if (isCreator) {
        const olderMemberThatIsAdmin = await ctx.db.query.members.findFirst({
          where: (members, { eq, ne, and }) =>
            and(eq(members.role, "admin"), ne(members.userId, ctx.user.id)),
          orderBy: (members, { asc }) => [asc(members.createdAt)],
        });

        if (olderMemberThatIsAdmin) {
          await ctx.db.transaction(async (ctx) => {
            const updatedMembership = await ctx
              .update(members)
              .set({ role: "admin", isCreator: true })
              .where(eq(members.id, olderMemberThatIsAdmin.id))
              .returning();

            if (!updatedMembership.length) {
              ctx.rollback();
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update the membership",
              });
            }

            const updatedWorkspace = await ctx
              .update(workspaces)
              .set({
                createdBy: updatedMembership[0]?.userId,
                updatedAt: Date.now(),
              })
              .where(eq(workspaces.id, input.id))
              .returning();

            const deleted = await ctx
              .delete(members)
              .where(eq(members.id, isMember.id))
              .returning();

            return {
              type: "member" as const,
              response: deleted,
            };
          });
        } else {
          await ctx.db
            .delete(templates)
            .where(eq(templates.workspaceId, input.id));

          // delete the workspace
          const deleted = await ctx.db
            .delete(workspaces)
            .where(eq(workspaces.id, input.id));

          return {
            type: "workspace" as const,
            response: deleted,
          };
        }
      }

      const deleted = await ctx.db
        .delete(members)
        .where(eq(members.id, isMember.id))
        .returning();

      return {
        type: "member" as const,
        response: deleted,
      };
    }),
});

export default memberRouter;
