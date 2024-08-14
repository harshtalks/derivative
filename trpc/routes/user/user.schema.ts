// related to user procedures

import { object, string } from "zod";

export const fetchUsersFilterSchema = object({
  query: string(),
});
