import userRouter from "./routes/user/user.procedure";
import { publicProcedure, createTRPCRouter, createCallerFactory } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
