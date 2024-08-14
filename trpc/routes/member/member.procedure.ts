import { members } from "@/database/schema";
import { createTRPCRouter, twoFactorAuthenticatedProcedure } from "@/trpc/trpc";
import { inputAs } from "@/trpc/utils";
import Branded from "@/types/branded.type";

const memberRouter = createTRPCRouter({
  all: twoFactorAuthenticatedProcedure
    .input(
      inputAs<{
        workspaceId: Branded.WorkspaceId;
      }>(),
    )
    .query(({ ctx, input }) => {
      const { db } = ctx;

      return db.query.members.findMany({
        where: (members, { eq }) => eq(members.workspaceId, input.workspaceId),
        with: {
          user: true,
        },
      });
    }),
});

export default memberRouter;
