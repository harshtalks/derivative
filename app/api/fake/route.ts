import withError from "@/lib/sever/with-error";
import { runWithServices } from "@/services";
import { generateFakeUsers } from "@/services/faker";
import { NextResponse } from "next/server";

export const GET = withError(async () => {
  // await runWithServices(generateFakeUsers());
  //
  throw new Error("not allowed");

  return NextResponse.json({ success: true });
});
