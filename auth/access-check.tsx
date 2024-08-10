import "server-only";
// everything related to the access check stuff
// everything on the server

import Branded from "@/types/branded.type";
import db, { and, eq } from "@/database/db";
import { members } from "@/database/schema";
import { redirect } from "next/navigation";
import serverApiTrpc from "@/trpc/server";
import { Cache } from "effect";
import { cache } from "react";

// dedupted by the cache
export const isMember = cache(
  async (userId: Branded.UserId, workspaceId: Branded.WorkspaceId) => {
    const dbMembers = await db
      .select()
      .from(members)
      .where(
        and(eq(members.userId, userId), eq(members.workspaceId, workspaceId)),
      );

    return dbMembers.length > 0;
  },
);

// we will use this function to check if the user has access to the workspace on the page level
// deduped by the cache
export const checkAccessForWorkspace = cache(async () => {
  const { id } = await serverApiTrpc.user.get();
  const workspaceId = brandedCurrentWorkspace();
  const result = await isMember(Branded.UserId(id), workspaceId);
  if (!result) {
    redirect("/404");
  }
});
