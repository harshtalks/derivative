import {
  members,
  workspaceActivities,
  workspaceMetadata,
} from "@/database/schema";
import { createTRPCRouter, twoFactorAuthenticatedProcedure } from "@/trpc/trpc";
import { inputAs } from "@/trpc/utils";
import Branded from "@/types/branded.type";
import { addMemberSchema } from "./member.schema";
import { TRPCError } from "@trpc/server";

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
});

export default memberRouter;
