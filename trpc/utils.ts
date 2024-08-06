// trpc utils
//

export const inputAs =
  <T>() =>
  (input: unknown) =>
    input as T;
