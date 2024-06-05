import { COOKIE_NAME } from "@/auth/tf";
import { invalidateAuth } from "@/auth/validate-request";
import { authenticatedProcedure, createTRPCRouter } from "@/trpc/trpc";

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
});

export default userRouter;
