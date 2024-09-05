// routes related to the markups

import {
  makeMainLiveWithServices,
  provideAuth,
  provideDB,
  runWithServices,
} from "@/services";
import { canAddTemplatesEffect } from "@/services/access-layer";
import { createTRPCRouter, twoFactorAuthenticatedProcedure } from "@/trpc/trpc";
import { addMarkupTemplateSchema } from "./markup.schema";
import { TRPCError } from "@trpc/server";
import Branded from "@/types/branded.type";
import { templateMarkups } from "@/database/schema";
import { inputAs } from "@/trpc/utils";
import { eq } from "drizzle-orm";

const markupRouter = createTRPCRouter({
  add: twoFactorAuthenticatedProcedure
    .input(addMarkupTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      const dbService = provideDB(ctx.db);
      const authService = provideAuth({
        ...ctx,
      });
      const mainLayer = makeMainLiveWithServices(dbService, authService);

      const canUserAddMarkup = await runWithServices(
        canAddTemplatesEffect(Branded.WorkspaceId(input.workspaceId)),
        mainLayer,
      );

      if (!canUserAddMarkup) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
        });
      }

      // add the markup template
      const { db } = ctx;

      const ifAlreadyExists = await db.query.templateMarkups.findFirst({
        where: (templateMarkups, { eq }) =>
          eq(templateMarkups.templateId, input.templateId),
      });

      // if the markup already exists, update it

      if (ifAlreadyExists) {
        return await db
          .update(templateMarkups)
          .set({
            updatedAt: Date.now(),
            fontFamily: input.fontFamily,
            markup: input.markup,
          })
          .where(eq(templateMarkups.id, ifAlreadyExists.id))
          .returning();
      }

      // if the markup does not exist, insert it
      return await db
        .insert(templateMarkups)
        .values({
          fontFamily: input.fontFamily,
          templateId: input.templateId,
          markup: input.markup,
        })
        .returning();
    }),
  get: twoFactorAuthenticatedProcedure
    .input(inputAs<{ templateId: Branded.TemplateId }>())
    .query(async ({ ctx: { db }, input: { templateId } }) => {
      const output = await db.query.templateMarkups.findFirst({
        where: (templateMarkups, { eq }) =>
          eq(templateMarkups.templateId, templateId),
      });

      if (!output) {
        return null;
      }

      return output;
    }),
});

export default markupRouter;
