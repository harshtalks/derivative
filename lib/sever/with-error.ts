import { ErrorWrapperResponse, NextHandler } from "@/types/api.type";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

type ErrorCallbackReturn =
  | NextResponse<ErrorWrapperResponse>
  | void
  | Promise<ErrorCallbackReturn>;

const withError = <TBody = unknown>(
  handler: NextHandler<TBody>,
  config?: {
    error?: (error: unknown) => ErrorCallbackReturn;
    finally?: () => void;
    logError?: boolean;
    withAuth?: boolean;
    withWebAuth?: boolean;
  }
): NextHandler => {
  return async (req, params) => {
    try {
      return await handler(req, params);
    } catch (error) {
      config?.logError && console.error(error);
      // custom error here
      config?.error?.(error);

      // zod error
      if (error instanceof ZodError) {
        return NextResponse.json<ErrorWrapperResponse>(
          { success: false, message: fromError(error).message },
          {
            status: StatusCodes["BAD_REQUEST"],
            statusText: "Bad Request",
          }
        );
      }

      return error instanceof Error
        ? // thrown error here
          NextResponse.json<ErrorWrapperResponse>(
            {
              success: false,
              message: error.message,
            },
            {
              status: StatusCodes["INTERNAL_SERVER_ERROR"],
              statusText: "Internal Server Error",
            }
          )
        : // fallback error here
          NextResponse.json<ErrorWrapperResponse>(
            {
              success: false,
              message: "Internal Server Error",
            },
            {
              status: StatusCodes["INTERNAL_SERVER_ERROR"],
              statusText: "Internal Server Error",
            }
          );
    } finally {
      config?.finally?.();
    }
  };
};

export default withError;
