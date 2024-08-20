import { COOKIE_NAME, verifyJWT } from "@/auth/tf";
import { validateRequest } from "@/auth/validate-request";
import db from "@/database/db";
import { TRPCError, initTRPC } from "@trpc/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import superjson from "superjson";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

/**
 *  This is where all the tRPC server stuff is created and plugged in. The pieces you will
 */

export const createTRPCContext = async (opts: {
  headers: Headers;
  cookieStore: ReadonlyRequestCookies;
}) => {
  const { user, session } = await validateRequest();

  return {
    session,
    user,
    db,
    headers: opts.headers,
    cookieStore: opts.cookieStore,
  };
};

// Initializing trpc client

export type TRPCContextReturnType = typeof createTRPCContext;

const t = initTRPC.context<TRPCContextReturnType>().create({
  // serializing stuffs that json cant handle
  transformer: superjson,
  // we need better zod error messages
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      ZodError:
        error.cause instanceof ZodError
          ? fromError(error.cause.errors, { includePath: true })
          : undefined,
    },
  }),
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */

export const authenticatedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // else return the next procedure

  return next({
    ctx: {
      session: { ...ctx.session },
      user: { ...ctx.user },
    },
  });
});

/**
 * Protected (authenticated) procedure - TWO FACTOR AUTHENTICATION
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */

export const twoFactorAuthenticatedProcedure = authenticatedProcedure.use(
  async ({ ctx, next }) => {
    const { user } = ctx;

    const isTwoFactorEnabled = user.twoFactorEnabled;

    if (!isTwoFactorEnabled) {
      return next({ ctx });
    }

    // check if the user has a two factor cookie

    const cookieStore = ctx.cookieStore;

    const twoFactorCookie = cookieStore.get(COOKIE_NAME);

    if (!twoFactorCookie) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Two factor required",
      });
    }

    try {
      // else check if the cookie is valid

      const validJWT = await verifyJWT(twoFactorCookie.value);

      return next({ ctx });
    } catch (e) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Your two factor token is invalid. Please login again.",
      });
    }
  },
);

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

export type ProtectedTRPCContext = TRPCContext & {
  user: NonNullable<TRPCContext["user"]>;
  session: NonNullable<TRPCContext["session"]>;
};
