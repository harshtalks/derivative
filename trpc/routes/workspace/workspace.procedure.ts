import { members, workspaces } from "@/database/schema";
import { insertWorkspaceSchema } from "@/database/schema.zod";
import { createTRPCRouter, twoFactorAuthenticatedProcedure } from "@/trpc/trpc";

const workspaceRouter = createTRPCRouter({
  create: twoFactorAuthenticatedProcedure
    .input(
      insertWorkspaceSchema.omit({
        createdBy: true,
      })
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
              workspaceId: workspace.id,
              role: "admin",
              isCreator: true,
              permissions: ["admin"],
            })
            .returning()
        )[0];

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
            membersDB.map((m) => m.workspaceId)
          ),
        orderBy: (workspaces, { desc }) => desc(workspaces.createdAt),
      });

      return workspacesDB;
    });

    return dbResult;
  }),
});

export default workspaceRouter;
