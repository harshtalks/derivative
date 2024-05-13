import { NextHandler } from "@/types/api.type";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

const withError = <TBody = unknown>(
  handler: NextHandler<TBody>,
  config?: {
    error?: (error: unknown) => NextResponse<null> | void;
    finally?: () => void;
  }
): NextHandler => {
  return async (req, params) => {
    try {
      return await handler(req, params);
    } catch (error) {
      // custom error here
      config?.error?.(error);

      // zod error
      if (error instanceof ZodError) {
        return new NextResponse(null, {
          status: StatusCodes["BAD_REQUEST"],
          statusText: fromError(error).message,
        });
      }

      // fallback error here
      return new NextResponse(null, {
        status: StatusCodes["INTERNAL_SERVER_ERROR"],
        statusText: "Internal Server Error",
      });
    } finally {
      config?.finally?.();
    }
  };
};

export default withError;
