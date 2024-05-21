import type { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import type {
  MiddlewareWrapper,
  ChainMiddlewareType,
} from "@/types/middleware.type";

function middlewareHandler(
  middlewares: Array<MiddlewareWrapper>,
  i = 0
): ChainMiddlewareType {
  const current = middlewares[i];

  if (current) {
    const next = middlewareHandler(middlewares, i + 1);

    return current(next);
  }

  return (_req: NextRequest, _evt: NextFetchEvent, res: NextResponse) => {
    return res;
  };
}

const pipe = (...middlewares: Array<MiddlewareWrapper>) => {
  return middlewareHandler(middlewares);
};

export default pipe;
