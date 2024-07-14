import { cookies } from "next/headers";
import { cache } from "react";

import { type Session, type User } from "lucia";
import { lucia } from "./lucia";
import { revalidatePath } from "next/cache";

export const validateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    // do nothing
  }
  return result;
};

// this should be used to cache the validateRequest function - in one render all the requests will be cached
export const validateRequestCached = cache(validateRequest);

// this should be used to invalidate the session. sign out the user
export const invalidateAuth = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return {
      success: false,
      error: "No session found",
    };
  }

  await lucia.invalidateSession(sessionId);

  console.log("reloading page thru action");
  revalidatePath("/");

  return {
    success: true,
  };
};
