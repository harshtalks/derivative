import { routeBuilder } from "tempeh";
import { env } from "./env";
import { void as _void } from "zod";

const { createRoute, useTempehRouter, Navigate } = routeBuilder({
  additionalBaseUrls: {
    GITHUB_API: "https://api.github.com",
    APP_BASE_URL: env.NEXT_PUBLIC_BASE_URL,
    JSON_SCHEMA_TOOL: "https://transform.tools",
  },
}).getInstance();

export { useTempehRouter, Navigate };

export const EmptyRouteParams = _void();

export default createRoute;
