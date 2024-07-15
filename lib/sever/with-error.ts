import { NextHandler } from "@/types/api.type";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

const withError = <TBody = unknown>(
  handler: NextHandler<TBody>,
  config?: {
    error?: (error: unknown) => NextResponse<null | {
      error: string;
    }> | void;
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
        return new NextResponse(null, {
          status: StatusCodes["BAD_REQUEST"],
          statusText: fromError(error).message,
        });
      }

      return error instanceof Error
        ? // thrown error here
          NextResponse.json(
            {
              error: error.message,
            },
            {
              status: StatusCodes["INTERNAL_SERVER_ERROR"],
              statusText: error.message,
            }
          )
        : // fallback error here
          NextResponse.json(
            {
              error: "Internal Server Error",
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
