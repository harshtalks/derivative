import { routeBuilder } from "tempeh";
import { env } from "./env";

const { createRoute, useTempehRouter, Navigate } = routeBuilder.getInstance({
  formattedValidationErrors: true,
  additionalBaseUrls: {
    GITHUB_API: "https://api.github.com",
    APP_BASE_URL: env.NEXT_PUBLIC_BASE_URL,
  },
});

export { useTempehRouter, Navigate };

export default createRoute;
