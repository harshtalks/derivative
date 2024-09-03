import { templates } from "@/database/schema";
import { insertTemplateSchema } from "@/database/schema.zod";
import { createTRPCRouter, twoFactorAuthenticatedProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { deleteTemplateSchema, templateListSchema } from "./template.schema";
import { count, eq } from "drizzle-orm";
import { inputAs } from "@/trpc/utils";
import Branded from "@/types/branded.type";
import {
  makeMainLiveWithServices,
  provideAuth,
  provideDB,
  runWithServices,
} from "@/services";
import { canAddTemplatesEffect, isMemberEffect } from "@/services/access-layer";

const TEMPLATES_PER_PAGE = 10;

const templateRouter = createTRPCRouter({
  addNew: twoFactorAuthenticatedProcedure
    .input(insertTemplateSchema.omit({ createdBy: true }))
    .mutation(async ({ ctx, input }) => {
      const { db, user, session } = ctx;

      const dbLayer = provideDB(db);
      const authLayer = provideAuth({ user, session });
      const mainLayer = makeMainLiveWithServices(dbLayer, authLayer);
      const doesUserHaveAccess = await runWithServices(
        canAddTemplatesEffect(Branded.WorkspaceId(input.workspaceId)),
        mainLayer,
      );

      if (!doesUserHaveAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
        });
      }

      // add the template

      const newTemplate = await db.insert(templates).values({
        category: input.category,
        subcategory: input.subcategory,
        name: input.name,
        description: input.description,
        workspaceId: input.workspaceId,
        createdBy: doesUserHaveAccess.id,
        status: input.status,
        jsonSchema: input.jsonSchema,
        json: input.json,
      });

      return newTemplate;
    }),
  all: twoFactorAuthenticatedProcedure
    .input(templateListSchema)
    .query(async ({ ctx, input: { workspaceId, page } }) => {
      const { db, user } = ctx;

      // check if user can add members
      const isMember = await db.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.userId, user.id),
            eq(members.workspaceId, workspaceId),
          ),
      });

      if (!isMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not a member of this workspace to perform this action",
        });
      }

      const templateCounts = await db
        .select({ count: count() })
        .from(templates)
        .where(eq(templates.workspaceId, workspaceId));

      // returning the templates

      // current page

      const offset = TEMPLATES_PER_PAGE * (page - 1);

      const dbTemplates = await db.query.templates.findMany({
        where: (templates, { eq }) => eq(templates.workspaceId, workspaceId),
        limit: TEMPLATES_PER_PAGE,
        offset: offset,
      });

      return {
        count: templateCounts
          .map((el) => el.count)
          .reduce((acc, curr) => acc + curr, 0),
        templates: dbTemplates,
        startingFrom: offset + 1,
        endTo: Math.min(
          offset + TEMPLATES_PER_PAGE,
          templateCounts
            .map((el) => el.count)
            .reduce((acc, curr) => acc + curr, 0),
        ),
      };
    }),
  get: twoFactorAuthenticatedProcedure
    .input(
      inputAs<{
        templateId: Branded.TemplateId;
        workspaceId: Branded.WorkspaceId;
      }>(),
    )
    .query(async ({ ctx, input: { templateId, workspaceId } }) => {
      const { db, user } = ctx;

      // check if user can add members
      const isMember = await db.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.userId, user.id),
            eq(members.workspaceId, workspaceId),
          ),
      });

      if (!isMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not a member of this workspace to perform this action",
        });
      }

      const template = await db.query.templates.findFirst({
        where: (templates, { and, eq }) =>
          and(
            eq(templates.id, templateId),
            eq(templates.workspaceId, workspaceId),
          ),
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      return template;
    }),
  delete: twoFactorAuthenticatedProcedure
    .input(deleteTemplateSchema)
    .mutation(async ({ ctx, input: { templateId, workspaceId } }) => {
      const { db, user, session } = ctx;

      const dbLayer = provideDB(db);
      const authLayer = provideAuth({ user, session });
      const mainLayer = makeMainLiveWithServices(dbLayer, authLayer);
      const doesUserHaveAccess = await runWithServices(
        canAddTemplatesEffect(Branded.WorkspaceId(workspaceId)),
        mainLayer,
      );

      if (!doesUserHaveAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
        });
      }

      const deleted = await db
        .delete(templates)
        .where(eq(templates.id, templateId))
        .returning();

      return deleted;
    }),
});

export default templateRouter;
