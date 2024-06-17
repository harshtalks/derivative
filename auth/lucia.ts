import { adapter } from "@/database/db";
import { sessions, users } from "@/database/schema";
import { Lucia, TimeSpan } from "lucia";
import { GitHub } from "arctic";
import { env } from "@/env";
import exp from "constants";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: true,

    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      githubId: attributes.githubId,
      username: attributes.username,
      avatar: attributes.avatar,
      email: attributes.email,
      twoFactorEnabled: attributes.twoFactorEnabled,
    };
  },
  sessionExpiresIn: new TimeSpan(2, "w"), // 2 weeks
  getSessionAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseSessionAttributes
      userAgent: attributes.ua,
      details: attributes.details,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: typeof users.$inferSelect;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }

  interface DatabaseSessionAttributes
    extends Omit<typeof sessions.$inferSelect, "id" | "userId" | "expiresAt"> {}
}

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET
);
