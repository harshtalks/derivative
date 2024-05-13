import { routeBuilder } from "tempeh";

const { createRoute } = routeBuilder.getInstance({
  formattedValidationErrors: true,
  additionalBaseUrls: {
    GITHUB_API: "https://api.github.com",
  },
});

export default createRoute;
