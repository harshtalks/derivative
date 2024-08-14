import logRouter from "./routes/log/log.procedure";
import memberRouter from "./routes/member/member.procedure";
import userRouter from "./routes/user/user.procedure";
import workspaceRouter from "./routes/workspace/workspace.procedure";
import { createTRPCRouter, createCallerFactory } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workspace: workspaceRouter,
  log: logRouter,
  member: memberRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
