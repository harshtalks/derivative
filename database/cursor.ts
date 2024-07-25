import { CursorConfig, generateCursor } from "drizzle-cursor";
import * as schema from "./schema";

const workspaceCursorConfig: CursorConfig = {
  primaryCursor: {
    order: "DESC",
    key: "createdAt",
    schema: schema.users.createdAt,
  },
};

export const workspaceCursor = generateCursor(workspaceCursorConfig);