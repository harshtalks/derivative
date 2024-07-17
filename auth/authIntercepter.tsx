import SignInPage from "@/app/(routes)/sign-in/route.info";
import "server-only";
import {
  validateRequestCached,
  validateTFAuthCached,
} from "./validate-request";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import WorkspaceRouteInfo from "@/app/(routes)/workspaces/route.info";
import WebAuthRoute from "@/app/(routes)/webauth/route.info";

type PromiseLike<T> = T | Promise<T>;

// it should be a chain of functions
export default class AuthInterceptor {
  private withTF?: boolean;
  private signInPage: string;
  private webAuthPage: string;
  private redirectUrl?: string;
  private base: string;
  private pathname: string;

  constructor(pathname: string) {
    this.signInPage = SignInPage({});
    this.webAuthPage = WebAuthRoute({});
    let protocol = headers().get("x-forwarded-proto");
    let host = headers().get("host");
    this.base = new URL(`${protocol}://${host}`).toString();
    this.pathname = pathname;
  }

  withTwoFactor() {
    this.withTF = true;
    return this;
  }

  authSignInPath(path: string) {
    this.signInPage = path;
    return this;
  }

  webAuthSignInPath(path: string) {
    if (!this.withTF) {
      throw new Error("You must enable two factor authentication");
    }
    this.webAuthPage = path;
    return this;
  }

  withRedirect() {
    const redirectUrl = headers().get("x-derivative-url") || undefined;

    this.signInPage = SignInPage(
      {},
      {
        search: {
          redirectUrl: redirectUrl,
        },
      }
    );

    this.webAuthPage = WebAuthRoute(
      {},
      {
        search: {
          redirectUrl: redirectUrl,
        },
      }
    );

    return this;
  }

  async check() {
    // check if the user session is valid
    const { session, user } = await validateRequestCached();

    // check auth
    if (!session || !user) {
      // auth failed
      if (this.pathname === SignInPage({})) {
        // if the user is on the sign in page, we return
        return;
      } else {
        // if the user is not on the sign in page, we redirect to the sign in page
        redirect(this.signInPage);
      }
    }

    // now check if two factor is enabled
    if (this.withTF) {
      if (user.twoFactorEnabled) {
        // we are in the two factor enabled state
        // validate the two factor auth
        const tfSession = await validateTFAuthCached();
        //  if the two factor auth is not successful
        if (!tfSession.success) {
          // redirect to the auth
          this.pathname !== WebAuthRoute({}) && redirect(this.webAuthPage);
          return;
        } else {
          // success check
          if (this.pathname === WebAuthRoute({})) {
            redirect(
              this.redirectUrl ??
                new URL(WorkspaceRouteInfo({}), this.base).toString()
            );
          } else {
            return;
          }
        }
      } else {
        // redirect to the redirect url
        this.pathname === WebAuthRoute({}) &&
          redirect(
            this.redirectUrl ??
              new URL(WorkspaceRouteInfo({}), this.base).toString()
          );

        return;
      }
    } else {
      // redirect to the redirect url
      if (this.pathname === SignInPage({})) {
        redirect(
          this.redirectUrl ??
            new URL(WorkspaceRouteInfo({}), this.base).toString()
        );
      }

      return;
    }
  }
}
