import createRoute from "@/route.config";
import { object } from "zod";

const GithubAuth = createRoute({
  name: "github-auth",
  paramsSchema: object({}),
  fn: ({}) => "/api/auth/github",
});

export default GithubAuth;
