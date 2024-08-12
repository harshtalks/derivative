import "server-only";

import Branded from "@/types/branded.type";
import { redirect } from "next/navigation";
import { cache } from "react";
import { brandedCurrentWorkspace } from "@/app/(routes)/workspaces/route.info";
import { runWithServices } from "@/services";
import { isMemberEffect } from "@/services/effects-wrapped";

// dedupted by the cache
export const isMember = cache(async (workspaceId: Branded.WorkspaceId) => {
  return runWithServices(isMemberEffect(workspaceId));
});

// we will use this function to check if the user has access to the workspace on the page level
// deduped by the cache
export const checkAccessForWorkspace = cache(async () => {
  const workspaceId = brandedCurrentWorkspace();

  const result = await isMember(workspaceId);

  if (!result) {
    redirect("/404");
  }
});
