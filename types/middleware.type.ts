import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { NextMiddlewareResult } from "next/dist/server/web/types";

export type MiddlewareWrapper = (
  middleware: ChainMiddlewareType
) => ChainMiddlewareType;

export type ChainMiddlewareType = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;
