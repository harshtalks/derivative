// server logic
import { cache } from "react";
import "server-only";
import { createTRPCContext } from "./trpc";
import { cookies, headers } from "next/headers";
import { createCaller } from ".";

/**
 * This wraps the `createContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */

const createContextRSC = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");
  return createTRPCContext({
    headers: heads,
    cookieStore: cookies(),
  });
});

// Create a server-side caller -> use this for server-side calls
const serverApiTrpc = createCaller(createContextRSC);

export default serverApiTrpc;
