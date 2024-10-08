import { env } from "@/env";
import { createClient } from "@libsql/client";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
export * from "drizzle-orm";

const { users, sessions } = schema;

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = env;

const client = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema: schema });

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export default db;
