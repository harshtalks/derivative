import { workspaceActivitiesEvents } from "@/database/schema";
import {
  selectMemberSchema,
  selectWorkspaceSchema,
} from "@/database/schema.zod";
import { infer as _infer } from "zod";

namespace LogTypes {
  export type Type = (typeof workspaceActivitiesEvents)[number];
  export type Workspace = _infer<typeof selectWorkspaceSchema>;
  export type Members = _infer<typeof selectMemberSchema>;

  type logMeta<T extends Type> = T extends "created"
    ? Workspace
    : T extends "members_added"
    ? Members
    : T extends "members_removed"
    ? Members
    : never;

  export type Log<T extends Type = Type> = {
    type: T;
    meta: logMeta<T>;
  };
}

export default LogTypes;
