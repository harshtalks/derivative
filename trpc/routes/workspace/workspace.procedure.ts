import { members, workspaceActivities, workspaces } from "@/database/schema";
import { insertWorkspaceSchema } from "@/database/schema.zod";
import { createTRPCRouter, twoFactorAuthenticatedProcedure } from "@/trpc/trpc";
import { getWorkspaceByIdInputSchema } from "./workspace.schema";
import { TRPCError } from "@trpc/server";
import Branded from "@/types/branded.type";

const workspaceRouter = createTRPCRouter({
  create: twoFactorAuthenticatedProcedure
    .input(
      insertWorkspaceSchema.omit({
        createdBy: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // get database instance
      const {
        db,
        user: { id: userId },
      } = ctx;

      // creating a transaction
      const dbResult = await db.transaction(async (ctx) => {
        // insert the workspace
        const workspace = (
          await ctx
            .insert(workspaces)
            .values({ ...input, createdBy: userId })
            .returning()
        )[0];

        // insert the user as a member
        const member = (
          await ctx
            .insert(members)
            .values({
              userId: userId,
              workspaceId: Branded.WorkspaceId(workspace.id),
              role: "admin",
              isCreator: true,
              permissions: ["admin"],
            })
            .returning()
        )[0];

        // log the event -> new workspace
        await ctx.insert(workspaceActivities).values({
          workspaceId: workspace.id,
          event: "created",
          payload: workspace,
          // performer is going to be the member not user
          performerId: member.id,
        });

        return { workspace, member };
      });

      return dbResult;
    }),
  // get all the workspaces of a user
  myWorkspaces: twoFactorAuthenticatedProcedure.query(async ({ ctx }) => {
    // here we will get all the factors that are mine (user)
    const {
      db,
      user: { id: userId },
    } = ctx;

    // database call
    const dbResult = await db.transaction(async (ctx) => {
      // get all the members
      const membersDB = await ctx.query.members.findMany({
        columns: {
          workspaceId: true,
        },
        where: (members, { eq }) => eq(members.userId, userId),
      });

      if (membersDB.length === 0) {
        return [];
      }

      // get all the workspaces
      const workspacesDB = await ctx.query.workspaces.findMany({
        where: (workspaces, { inArray: $in }) =>
          $in(
            workspaces.id,
            membersDB.map((m) => m.workspaceId),
          ),
        orderBy: (workspaces, { desc }) => desc(workspaces.createdAt),
      });

      return workspacesDB;
    });

    return dbResult;
  }),
  // get the workspace by id
  workspace: twoFactorAuthenticatedProcedure
    .input(getWorkspaceByIdInputSchema)
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { workspaceId } = input;

      // get the workspace
      const dbResult = await db.transaction(async (ctx) => {
        const workspaceDB = await ctx.query.workspaces.findFirst({
          where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
        });

        if (!workspaceDB) {
          throw new TRPCError({
            message: "Workspace not found with given id " + workspaceId,
            code: "BAD_REQUEST",
          });
        }

        const members = await ctx.query.members.findMany({
          columns: {
            id: true,
          },
          where: (members, { eq }) => eq(members.workspaceId, workspaceId),
        });

        const creator = await ctx.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, workspaceDB.createdBy),
        });

        if (!creator) {
          throw new TRPCError({
            message: "Creator not found for workspace",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return { workspaceDB, creator, membersCount: members.length };
      });

      return dbResult;
    }),
});

export default workspaceRouter;
