import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Effect } from "effect";

const TFAuthenticate = () =>
  HttpClientRequest.get("/api/auth/two-factor/authenticate")
    .pipe(HttpClient.fetchOk, HttpClientResponse.json)
    .pipe(Effect.orDie, Effect.runPromise);

export default TFAuthenticate;
