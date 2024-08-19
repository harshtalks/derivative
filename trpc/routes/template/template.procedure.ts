import { templates } from "@/database/schema";
import { insertTemplateSchema } from "@/database/schema.zod";
import { createTRPCRouter, twoFactorAuthenticatedProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";

const templateRouter = createTRPCRouter({
  addNew: twoFactorAuthenticatedProcedure
    .input(insertTemplateSchema.omit({ createdBy: true }))
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      // check if user can add members

      const isMember = await db.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.userId, user.id),
            eq(members.workspaceId, input.workspaceId),
          ),
      });

      if (!isMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not a member of this workspace to perform this action",
        });
      }

      const hasAccess =
        isMember.role === "admin" || isMember.permissions.includes("admin");

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to add members",
        });
      }

      // add the template

      const newTemplate = await db.insert(templates).values({
        category: input.category,
        subcategory: input.subcategory,
        name: input.name,
        description: input.description,
        workspaceId: input.workspaceId,
        createdBy: isMember.id,
        status: input.status,
        jsonSchema: input.jsonSchema,
      });

      return newTemplate;
    }),
});

export default templateRouter;
