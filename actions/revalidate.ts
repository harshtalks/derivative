"use server";
import api from "@/trpc/server";
import { revalidatePath } from "next/cache";
import { createAction } from "tempeh";
import { object, string } from "zod";

export const revalidate = createAction({
  handler: async ({ path }) => {
    console.log("reloading page thru action");
    revalidatePath(path || "/");

    return {
      success: true,
    };
  },
  inputSchema: object({
    path: string().optional(),
  }),
});
