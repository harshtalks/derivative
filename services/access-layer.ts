import Branded from "@/types/branded.type";
import { Effect } from "effect";
import { members } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { AuthenticationLayer, DatabaseLayer } from ".";

// This is the access layer. It is responsible for checking if a user has access to a certain resource.
export const isMemberEffect = (workspaceId: Branded.WorkspaceId) =>
  Effect.gen(function* () {
    const db = yield* DatabaseLayer;
    const auth = yield* AuthenticationLayer;
    const { session, user } = yield* auth;

    if (!user) {
      return false;
    }

    const dbMembers = yield* Effect.promise(() =>
      db
        .select()
        .from(members)
        .where(
          and(
            eq(members.userId, user.id),
            eq(members.workspaceId, workspaceId),
          ),
        ),
    );

    return dbMembers.length > 0 ? dbMembers[0] : false;
  });

// This effect checks if a user has access to add members to a workspace.
export const canAddMembersEffect = (workspaceId: Branded.WorkspaceId) => {
  return Effect.gen(function* () {
    const db = yield* DatabaseLayer;
    const auth = yield* AuthenticationLayer;
    const { session, user } = yield* auth;

    if (!user) {
      return false;
    }

    const memberDB = yield* Effect.promise(() =>
      db.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.userId, user.id),
            eq(members.workspaceId, workspaceId),
          ),
      }),
    );

    if (!memberDB) {
      return false;
    }

    return (
      memberDB.role === "admin" ||
      memberDB.permissions.includes("member_controls")
    );
  });
};

// This effect checks if a user has access to add templates to a workspace.
export const canAddTemplatesEffect = (workspaceId: Branded.WorkspaceId) => {
  return Effect.gen(function* () {
    const db = yield* DatabaseLayer;
    const auth = yield* AuthenticationLayer;
    const { session, user } = yield* auth;

    if (!user) {
      return false;
    }

    const memberDB = yield* Effect.promise(() =>
      db.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.userId, user.id),
            eq(members.workspaceId, workspaceId),
          ),
      }),
    );

    if (!memberDB) {
      return false;
    }

    return memberDB.role === "admin" || memberDB.permissions.includes("write")
      ? memberDB
      : false;
  });
};
