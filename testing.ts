import { Value } from "@udecode/plate-common";

// Starting with the tokens
type Numbers = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0";
type Operations = "+" | "-" | "/" | "*";
type LeftP = "(";
type RightP = ")";
type Space = " ";
type Empty = "";
type P = LeftP | RightP;
type ValidTokens = Numbers | Operations | P;

type ValidNextToken = {
  [k in Numbers]: Operations | P | Empty | Numbers;
} & {
  [k in Operations]: Numbers | P;
} & {
  [k in LeftP]: LeftP | Numbers;
} & {
  [k in RightP]: RightP | Operations | Empty;
};

type ValidStartTokens = LeftP | Numbers;

type IsValidStart<T extends string> =
  T extends `${infer F extends ValidStartTokens}${infer R}` ? true : false;

type IsValidInGroup<T extends string, Group extends string> = T extends Empty
  ? Empty extends Group
    ? true
    : false
  : T extends `${infer F extends Group}${infer R}`
    ? true
    : false;

type IsValidNext<T extends string> = T extends Empty
  ? true
  : T extends `${infer F extends keyof ValidNextToken}${infer R}`
    ? IsValidInGroup<R, ValidNextToken[F]> extends true
      ? IsValidNext<R>
      : false
    : false;

type IsValidExpression<T extends string> = [
  IsValidStart<T>,
  IsValidNext<T>,
] extends true[]
  ? true
  : false;

type RemoveChars<
  T extends string,
  ToRm extends string,
  Result extends string = "",
> = T extends `${infer F}${infer R extends string}`
  ? F extends ToRm
    ? RemoveChars<R, ToRm, Result>
    : RemoveChars<R, ToRm, `${Result}${F}`>
  : Result;

type WithoutSpaces<T extends string> = RemoveChars<T, Space>;
type OnlyParanthesis<T extends string> = RemoveChars<
  T,
  Exclude<ValidTokens, P>
>;

type ValidParanthesis<
  T extends string,
  Stack extends string[] = [],
> = T extends Empty
  ? Stack["length"] extends 0
    ? true
    : false
  : T extends `${infer F extends LeftP}${infer R}`
    ? ValidParanthesis<R, [F, ...Stack]>
    : T extends `${infer F extends RightP}${infer R}`
      ? Stack extends [infer _F extends LeftP, ...infer Rest]
        ? Rest extends string[]
          ? ValidParanthesis<R, Rest>
          : false
        : false
      : false;

// Examples
