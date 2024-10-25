import createRoute from "@/route.config";
import { array, object, string, boolean, infer as infer_ } from "zod";
import { effective } from "@/lib/effect.stuff";
import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Effect } from "effect";
import { EmptyRouteConfig } from "@/app/route.info";

export const githubUserEmailsResponseSchema = array(
  object({
    email: string().email(),
    primary: boolean(),
    verified: boolean(),
    visibility: string().nullable(),
  }),
);

export const githubUserSchema = object({
  login: string().min(1),
  avatar_url: string().url(),
  name: string(),
});

export const githubUserRoute = createRoute({
  name: "githubUser",
  baseUrl: "GITHUB_API",
  fn: () => `/user`,
  paramsSchema: EmptyRouteConfig,
});

export const githubUserEmailsRoute = createRoute({
  name: "githubUserEmail",
  baseUrl: "GITHUB_API",
  fn: () => `/user/emails`,
  paramsSchema: EmptyRouteConfig,
});

export type GithubUserEmails = infer_<typeof githubUserEmailsResponseSchema>;

export type GithubUser = infer_<typeof githubUserSchema>;
// Actual Code for the fetching database

const getGithubUserEmailsEffect = (token: string) =>
  effective<GithubUserEmails>()(
    HttpClientRequest.get(githubUserEmailsRoute.navigate({})).pipe(
      HttpClientRequest.setHeader("Authorization", `Bearer ${token}`),
      HttpClient.fetchOk,
      HttpClientResponse.json,
      Effect.andThen((value) => {
        const parsed = githubUserEmailsResponseSchema.safeParse(value);
        if (!parsed.success) {
          return Effect.fail(parsed.error);
        } else {
          return Effect.succeed(parsed.data);
        }
      }),
    ),
  );

const getGithubUserEffect = (token: string) =>
  effective<GithubUser>()(
    HttpClientRequest.get(githubUserRoute.navigate({})).pipe(
      HttpClientRequest.setHeader("Authorization", `Bearer ${token}`),
      HttpClient.fetchOk,
      HttpClientResponse.json,
      Effect.andThen((value) => {
        const parsed = githubUserSchema.safeParse(value);
        if (!parsed.success) {
          return Effect.fail(parsed.error);
        } else {
          return Effect.succeed(parsed.data);
        }
      }),
    ),
  );

const githubHandlers = {
  getGithubUserEffect,
  getGithubUserEmailsEffect,
};

export default githubHandlers;
