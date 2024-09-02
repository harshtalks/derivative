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

    console.log(workspaceId, user);

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

    console.log(dbMembers.length);

    return dbMembers.length > 0;
  });

export const canAddMembersEffect = (workspaceId: Branded.WorkspaceId) => {
  return Effect.gen(function* () {
    const services = yield* ServiceLayer;
    const { session, user, db } = yield* services;

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
