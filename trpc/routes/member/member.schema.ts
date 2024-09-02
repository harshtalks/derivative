import { insertMemberSchema } from "@/database/schema.zod";
import { object, string } from "zod";

export const addMemberSchema = insertMemberSchema;

export const removeMemberSchema = object({
  workspaceId: string().min(1),
  memberId: string().min(1),
});

export const updateMemberSchema = insertMemberSchema
  .omit({
    isCreator: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    object({
      id: string().min(1),
    }),
  );
