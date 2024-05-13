import createRoute from "@/route.config";
import { createEndPoint } from "tempeh";
import { array, object, string, boolean } from "zod";

const getGithubUserEmails = createEndPoint({
  httpMethod: "GET",
  path: createRoute({
    name: "/user/emails",
    fn: () => "/user/emails",
    paramsSchema: object({}),
    baseUrl: "GITHUB_API",
  }),
  SafeResponse: true,
  responseSchema: array(
    object({
      email: string().email(),
      primary: boolean(),
      verified: boolean(),
      visibility: string().nullable(),
    })
  ),
});

const getGithubUser = createEndPoint({
  httpMethod: "GET",
  path: createRoute({
    fn: () => "/user",
    baseUrl: "GITHUB_API",
    paramsSchema: object({}),
    name: "getGithubUser",
  }),
  SafeResponse: true,
  responseSchema: object({
    login: string().min(1),
    avatar_url: string().url(),
    name: string(),
  }),
});

const githubHandlers = { getGithubUserEmails, getGithubUser };

export default githubHandlers;
