import Branded from "@/types/branded.type";
import { ServiceLayer } from ".";
import { Effect } from "effect";
import { members } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export const isMemberEffect = (workspaceId: Branded.WorkspaceId) =>
  Effect.gen(function* () {
    const services = yield* ServiceLayer;
    const { session, user, db } = yield* services;

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

    return dbMembers.length > 0;
  });

export const canAddMembersEffect = (workspaceId: Branded.WorkspaceId) => {
  return Effect.gen(function* () {
    const services = yield* ServiceLayer;
    const { session, user, db } = yield* services;

    if (!user) {
      return false;
    }

    const member = yield* Effect.promise(() =>
      db.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.userId, user.id),
            eq(members.workspaceId, workspaceId),
          ),
      }),
    );

    if (!member) {
      return false;
    }

    return (
      member.role === "admin" || member.permissions.includes("memmber_controls")
    );
  });
};
