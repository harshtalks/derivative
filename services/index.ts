// Everything related to the services
import { validateRequestCached } from "@/auth/validate-request";
import db from "@/database/db";
import { Effect, Context, Layer } from "effect";
import { Session, User } from "lucia";

/**
 * DATABASE LAYER
 */
export class DatabaseLayer extends Context.Tag("DatabaseLayer")<
  DatabaseLayer,
  typeof db
>() {}

// provide db instances
export const provideDB = (dbCtx: typeof db) =>
  Layer.succeed(DatabaseLayer, DatabaseLayer.of(dbCtx));

/**
 * AUTH LAYER
 */
export class AuthenticationLayer extends Context.Tag("AuthenticationLayer")<
  AuthenticationLayer,
  Effect.Effect<{
    session: Session | null;
    user: User | null;
  }>
>() {}

export const provideAuth = (authCtx: { session: Session; user: User }) =>
  Layer.succeed(
    AuthenticationLayer,
    AuthenticationLayer.of(Effect.succeed(authCtx)),
  );

// inject services
export const makeMainLiveWithServices = (
  dbLayer: Layer.Layer<DatabaseLayer, never, never>,
  authLayer: Layer.Layer<AuthenticationLayer, never, never>,
) => {
  return Layer.mergeAll(dbLayer, authLayer);
};

// run with services
export const dbService = Layer.succeed(DatabaseLayer, DatabaseLayer.of(db));
export const authService = Layer.succeed(
  AuthenticationLayer,
  AuthenticationLayer.of(
    Effect.gen(function* () {
      const { session, user } = yield* Effect.promise(validateRequestCached);
      return {
        session: session,
        user: user,
      };
    }),
  ),
);

// main live layer
const mainLiveLayer = Layer.mergeAll(dbService, authService);

// run with services
export const runWithServices = <TData, TError = never>(
  v: Effect.Effect<TData, TError, DatabaseLayer | AuthenticationLayer>,
  liveLayer: Layer.Layer<
    DatabaseLayer | AuthenticationLayer,
    never,
    never
  > = mainLiveLayer,
) => Effect.runPromise(Effect.provide(v, liveLayer));

// exporting main live layer
export default mainLiveLayer;
