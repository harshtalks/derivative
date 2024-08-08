// everything related to the logs here

import { workspaceActivities } from "@/database/schema";
import { authenticatedProcedure, createTRPCRouter } from "@/trpc/trpc";
import { inputAs } from "@/trpc/utils";
import LogTypes from "@/types/log.type";
import { eq } from "drizzle-orm";
import { object, string } from "zod";

const logRouter = createTRPCRouter({
  newWorkspace: authenticatedProcedure
    .input(inputAs<LogTypes.WorkspaceActivity>())
    .mutation(async ({ ctx, input }) => {
      // do something with the input
      // this is a public procedure, so no need to check for authentication
      // what we essentially need to do is to log the event

      const { db } = ctx;

      await db.insert(workspaceActivities).values({
        event: input.event,
        payload: input.payload,
        performerId: ctx.user.id,
        workspaceId: input.workspaceId,
      });

      return { success: true };
    }),
  read: authenticatedProcedure
    .input(
      object({
        workspaceId: string(),
      }),
    )
    .query(async ({ ctx, input: { workspaceId } }) => {
      const { db } = ctx;

      const logs = await db.query.workspaceActivities.findMany({
        with: {
          performedBy: {
            with: {
              user: {
                columns: {
                  avatar: true,
                  email: true,
                  name: true,
                },
              },
            },
            columns: {
              userId: true,
            },
          },
        },
        where: (workspaceActivities, { eq }) =>
          eq(workspaceActivities.workspaceId, workspaceId),
      });

      return logs;
    }),
});

export default logRouter;
