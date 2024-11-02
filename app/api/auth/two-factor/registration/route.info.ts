import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import {
  HttpClientRequest,
  HttpClient,
  HttpClientResponse,
} from "@effect/platform";
import { Effect } from "effect";

const TFRegistration = () =>
  HttpClientRequest.get("/api/auth/two-factor/registration")
    .pipe(HttpClient.fetchOk, HttpClientResponse.json)
    .pipe(Effect.orDie, Effect.runPromise);

export default TFRegistration;
