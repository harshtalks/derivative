import {
  members,
  workspaceActivities,
  workspaceMetadata,
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
import { runWithServices } from "@/services";
import { canAddMembersEffect } from "@/services/access-layer";
import { eq } from "drizzle-orm";
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
});

export default memberRouter;
