import { members } from "@/database/schema";
import { createTRPCRouter, twoFactorAuthenticatedProcedure } from "@/trpc/trpc";
import { inputAs } from "@/trpc/utils";
import Branded from "@/types/branded.type";
import { eq } from "drizzle-orm";

const memberRouter = createTRPCRouter({
  all: twoFactorAuthenticatedProcedure
    .input(inputAs<Branded.WorkspaceId>())
    .query(({ ctx, input }) => {
      const { db } = ctx;

      return db.select().from(members).where(eq(members.workspaceId, input));
    }),
});

export default memberRouter;
