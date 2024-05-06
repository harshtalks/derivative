import { github } from "@/auth/lucia";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";

export const GET = async (request: Request) => {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");

  const state = url.searchParams.get("state");

  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: StatusCodes["TEMPORARY_REDIRECT"],
      statusText: "Temporary Redirect due to missing code or state",
    });
  }

  try {
    const token = await github.validateAuthorizationCode(code);
  } catch (e) {}
};
