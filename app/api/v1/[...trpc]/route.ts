import { env } from "@/env";
import { appRouter } from "@/trpc";
import { createTRPCContext } from "@/trpc/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";
import V1Route from "./route.info";

const createContext = (req: Request) => {
  const cookieStore = cookies();
  return createTRPCContext({ headers: req.headers, cookieStore });
};

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: V1Route.navigate({}),
    req: request,
    router: appRouter,
    createContext: () => createContext(request),
  });
};

export { handler as GET, handler as POST };
