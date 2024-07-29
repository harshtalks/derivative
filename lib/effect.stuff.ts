import { Effect } from "effect";

export const effective =
  <Value = never>() =>
  <Error, Requirements>(effect: Effect.Effect<Value, Error, Requirements>) =>
    effect;
