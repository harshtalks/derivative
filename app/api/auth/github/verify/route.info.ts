import createRoute from "@/route.config";
import { User, Session } from "lucia";
import { createEndPoint } from "tempeh";
import * as z from "zod";

const validateGithubAuth = createEndPoint({
  httpMethod: "GET",
  path: createRoute({
    name: "github-auth-verify",
    paramsSchema: z.object({}),
    fn: () => "/api/auth/github/verify",
    baseUrl: "APP_BASE_URL",
  }),
  SafeResponse: false,
});

export type ValidateGithubAuth = {
  user: User;
  session: Session;
};

export default validateGithubAuth;
