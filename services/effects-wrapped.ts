import Branded from "@/types/branded.type";
import { ServiceLayer } from ".";
import { Effect } from "effect";
import { members } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export const isMemberEffect = (workspaceId: Branded.WorkspaceId) =>
  Effect.gen(function* () {
    const services = yield* ServiceLayer;
    const { auth, db } = yield* services;
    const { user } = yield* auth;

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
