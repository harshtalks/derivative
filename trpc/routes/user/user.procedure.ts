import { lucia } from "@/auth/lucia";
import { COOKIE_NAME } from "@/auth/tf";
import { invalidateAuth } from "@/auth/validate-request";
import { users } from "@/database/schema";
import { authenticatedProcedure, createTRPCRouter } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import * as z from "zod";

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
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { user, db } = ctx;

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
});

export default userRouter;
