import markupRouter from "./routes/markup/markup.procedure";
import memberRouter from "./routes/member/member.procedure";
import templateRouter from "./routes/template/template.procedure";
import userRouter from "./routes/user/user.procedure";
import workspaceRouter from "./routes/workspace/workspace.procedure";
import { createTRPCRouter, createCallerFactory } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workspace: workspaceRouter,
  member: memberRouter,
  template: templateRouter,
  markup: markupRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
