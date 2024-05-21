import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    mode: z.enum(["development", "production"]).default("development"),
    BASE_URL: z.string().url().default("http://localhost:3000"),
    /**
     * Human-readable title for your website
     */
    RP_NAME: z.string().default("Derivative"),
    /**
     * A unique identifier for your website. 'localhost' is okay for
     * local dev
     */
    RP_ID: z.string().default("localhost"),
    /**
     * The URL at which registrations and authentications should occur.
     * 'http://localhost' and 'http://localhost:PORT' are also valid.
     * Do NOT include any trailing /
     */
    RP_ORIGIN: z.string().url().default("http://localhost:3000"),
    WEB_AUTH_CHALLENGE: z.string().min(1),
    WEB_AUTH_PRIVATE_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    RP_NAME: process.env.RP_NAME,
    RP_ID: process.env.RP_ID,
    WEB_AUTH_CHALLENGE: process.env.WEB_AUTH_CHALLENGE,
    RP_ORIGIN: process.env.RP_ORIGIN,
    WEB_AUTH_PRIVATE_KEY: process.env.WEB_AUTH_PRIVATE_KEY,
  },
});
