import * as z from "zod";

import { NextRequest, NextResponse } from "next/server";

// next handler signature
export type NextHandler<TBody = unknown> = (
  req: NextRequest,
  { params }: { params: Record<string, string | undefined> }
) => Promise<NextResponse<TBody>>;

// api.type.ts - UTILS
export type RequestSuccess<TData> = {
  status: "success";
  result: TData;
};

export type RequestError = {
  status: "error";
  error: string;
};

export type RequestResponse<TData> = RequestSuccess<TData> | RequestError;

// Zod Specials - compatible with safefetch-http

export const RequestSuccessSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    status: z.literal("success"),
    result: schema,
  });

export const RequestErrorSchema = z.object({
  status: z.literal("error"),
  error: z.string(),
});

export const RequestResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.union([RequestSuccessSchema(schema), RequestErrorSchema]);

export type NullResponseType =
  | {
      success: false;
      error: string;
    }
  | { success: boolean; message: string };

export type ErrorWrapperResponse<T = unknown> =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      response: T;
    };
