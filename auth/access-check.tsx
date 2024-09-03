import "server-only";

import Branded from "@/types/branded.type";
import { redirect } from "next/navigation";
import { cache } from "react";
import WorkspaceRouteInfo, {
  brandedCurrentWorkspace,
} from "@/app/(routes)/workspaces/route.info";
import { runWithServices } from "@/services";
import { canAddMembersEffect, isMemberEffect } from "@/services/access-layer";

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
    redirect(WorkspaceRouteInfo({}));
  }
});

export const canAddMembers = cache(async (workspaceId: Branded.WorkspaceId) =>
  runWithServices(canAddMembersEffect(workspaceId)),
);
