import { lucia } from "@/auth/lucia";
import { COOKIE_NAME } from "@/auth/tf";
import { invalidateAuth } from "@/auth/validate-request";
import { authenticators, members, users } from "@/database/schema";
import {
  authenticatedProcedure,
  createTRPCRouter,
  twoFactorAuthenticatedProcedure,
} from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { and, eq, like, or } from "drizzle-orm";
import * as z from "zod";
import { fetchUsersFilterSchema } from "./user.schema";
import { usersCursor } from "@/database/cursor";

const userRouter = createTRPCRouter({
  get: authenticatedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
  logout: authenticatedProcedure.mutation(async ({ ctx }) => {
    await invalidateAuth();
    // delete the cookie for two factor auth
    ctx.cookieStore.delete(COOKIE_NAME);

    return { success: true };
  }),
  twoFactor: authenticatedProcedure
    .input(
      z.object({
        action: z.enum(["enable", "disable"]),
      }),
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { user, db, cookieStore } = ctx;

      // deleting the cookie as a preventive measure
      cookieStore.delete(COOKIE_NAME);

      if (input.action === "disable") {
        // delete all authenticators for the user if they are disabling 2FA. we don't need them anymore
        await db
          .delete(authenticators)
          .where(eq(authenticators.userId, user.id));
      }

      // update the user's two factor status
      const output = await db
        .update(users)
        .set({ twoFactorEnabled: input.action === "enable" })
        .where(eq(users.id, user.id))
        .returning();

      return output[0];
    }),
  sessions: authenticatedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const sessions = await lucia.getUserSessions(user.id);
    const currentSession = ctx.session;

    return { sessions, currentSession };
  }),
  killSession: authenticatedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        lucia.invalidateSession(input.sessionId);
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not invalidate session",
        });
      }
    }),
  killAllSessions: authenticatedProcedure.mutation(async ({ ctx }) => {
    try {
      await lucia.invalidateUserSessions(ctx.user.id);
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not invalidate all sessions",
      });
    }
  }),
  // Routes to fetch users
  all: twoFactorAuthenticatedProcedure
    .input(fetchUsersFilterSchema)
    .query(async ({ ctx, input: { query, cursor, workspaceId } }) => {
      const { db } = ctx;

      // create offset
      const limit = 10;

      // getting the users
      const usersFromDB = await db
        .select()
        .from(users)
        .orderBy(...usersCursor.orderBy)
        .where(
          and(
            usersCursor.where(cursor),
            or(like(users.name, `%${query}%`), like(users.email, `%${query}%`)),
          ),
        )
        .limit(limit);

      const membersInWorkspace = await db.query.members.findMany({
        where: (members, { and, eq, inArray }) =>
          and(
            eq(members.workspaceId, workspaceId),
            usersFromDB.length
              ? inArray(
                  members.userId,
                  usersFromDB.map((user) => user.id),
                )
              : undefined,
          ),
      });

      // get the users that are not in the workspace
      const usersNotInWorkspace = usersFromDB.filter((user) => {
        return !membersInWorkspace.some((member) => member.userId === user.id);
      });

      const lastToken = usersCursor.serialize(usersNotInWorkspace.at(-1)); // use serialize method/function to send tokens to your FE

      return { nextToken: lastToken, users: usersNotInWorkspace };
    }),
});

export default userRouter;
