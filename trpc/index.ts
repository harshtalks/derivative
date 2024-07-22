import userRouter from "./routes/user/user.procedure";
import workspaceRouter from "./routes/workspace/workspace.procedure";
import { publicProcedure, createTRPCRouter, createCallerFactory } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workspace: workspaceRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
