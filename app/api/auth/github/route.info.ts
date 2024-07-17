import createRoute from "@/route.config";
import { object, string } from "zod";

const GithubAuth = createRoute({
  name: "github-auth",
  paramsSchema: object({}),
  fn: ({}) => "/api/auth/github",
  searchParamsSchema: object({
    redirectUrl: string().optional(),
  }),
});

export default GithubAuth;
