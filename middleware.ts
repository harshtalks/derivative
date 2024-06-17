import V1Route from "./app/api/v1/[trpc]/route.info";
import pipe from "./middlewares/pipe";
import withAuth from "./middlewares/with-auth";
import withWebAuthn from "./middlewares/with-web-auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/v1/*|_next/static|_next/image|favicon.ico).*)",
  ],
};

// whatever middleware you want to run at the end, keep if at the first
// order of the middleware matters -> the first will be the last to run
export default pipe(withAuth, withWebAuthn);
