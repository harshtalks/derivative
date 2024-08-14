// Everything related to the services
import { validateRequestCached } from "@/auth/validate-request";
import db from "@/database/db";
import { Effect, Context, Layer } from "effect";
import { Session, User } from "lucia";

// Database service

export class Database extends Context.Tag("Database")<Database, typeof db>() {}

export class Authentication extends Context.Tag("Authentication")<
  Authentication,
  Effect.Effect<{
    session: Session | null;
    user: User | null;
  }>
>() {}

export class ServiceLayer extends Context.Tag("ServiceLayer")<
  ServiceLayer,
  Effect.Effect<
    {
      db: typeof db;
      session: Session | null;
      user: User | null;
    },
    never,
    Database | Authentication
  >
>() {}

export const dbService = Layer.succeed(Database, Database.of(db));
export const authService = Layer.succeed(
  Authentication,
  Authentication.of(
    Effect.gen(function* () {
      const { session, user } = yield* Effect.promise(validateRequestCached);

      return {
        session: session,
        user: user,
      };
    }),
  ),
);
export const serviceLayer = Layer.succeed(
  ServiceLayer,
  ServiceLayer.of(
    Effect.gen(function* () {
      const db = yield* Database;
      const auth = yield* Authentication;
      const { session, user } = yield* auth;

      return {
        db,
        session,
        user,
      };
    }),
  ),
);

const mainLiveLayer = Layer.mergeAll(serviceLayer, dbService, authService);

export const runWithServices = <TData, TError = never>(
  v: Effect.Effect<TData, TError, Database | Authentication | ServiceLayer>,
) => Effect.runPromise(Effect.provide(v, mainLiveLayer));

export default mainLiveLayer;
