// everything related to workspace invite
// it makes sense to keep it in auth as it is all jwt related

import { TimeSpan } from "oslo";
import { createJWT, validateJWT } from "oslo/jwt";
import { getKey } from "./tf";
import WorkspaceInvitationRoute from "@/app/(routes)/workspaces/[workspaceId]/invitation/route.info";

export const INVITE_COUNT = 10;
export const WEEKS_TO_EXPIRE = 4;

export type InvitationCodePayload = {
  workspaceId: string;
};

export const createInviteLink = async (
  time: TimeSpan,
  payload: InvitationCodePayload,
) => {
  return createJWT("HS256", getKey(), payload, {
    expiresIn: time,
  });
};

export const verifyInviteLink = async (token: string) => {
  return validateJWT("HS256", getKey(), token);
};
