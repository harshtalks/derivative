import { createRoute } from "tempeh";
import { object } from "zod";

const GithubAuth = createRoute({
  name: "github-auth",
  paramsSchema: object({}),
  options: {
    internal: true,
  },
  fn: ({}) => "/api/auth/github",
});

export default GithubAuth;
