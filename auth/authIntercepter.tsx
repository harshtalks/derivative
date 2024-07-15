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
  private beforeOAuth?: () => PromiseLike<void>;
  private afterOAuth?: () => PromiseLike<void>;
  private beforeWebAuth?: () => PromiseLike<void>;
  private afterWebAuth?: () => PromiseLike<void>;
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

  beforeOAuthHook(fn: () => PromiseLike<void>) {
    this.beforeOAuth = fn;
    return this;
  }

  afterOAuthHook(fn: () => PromiseLike<void>) {
    this.afterOAuth = fn;
    return this;
  }

  beforeWebAuthHook(fn: () => PromiseLike<void>) {
    if (!this.withTF) {
      throw new Error("You must enable two factor authentication");
    }
    this.beforeWebAuth = fn;
    return this;
  }

  afterWebAuthHook(fn: () => PromiseLike<void>) {
    if (!this.withTF) {
      throw new Error("You must enable two factor authentication");
    }
    this.afterWebAuth = fn;
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

  setRedirect(url: string) {
    if (![this.webAuthPage, this.signInPage].includes(this.pathname)) {
      throw new Error(
        "You must be on the web auth page to set the redirect url"
      );
    }

    try {
      this.redirectUrl = new URL(url).toString();
    } catch (e) {
      this.redirectUrl = new URL(url, this.base).toString();
    }
    return this;
  }

  async execute() {
    // before oauth, if it exists
    if (this.beforeOAuth) {
      await this.beforeOAuth();
    }

    // check if the user session is valid
    const { session, user } = await validateRequestCached();

    // if the session or user is not found
    if (!session || !user) {
      this.pathname !== this.signInPage && redirect(this.signInPage);
      return;
    }

    // if two factor is enabled
    if (this.withTF) {
      // Check if user has enabled two factor
      const tfEnabled = user.twoFactorEnabled;

      if (!tfEnabled) {
        // redirect to the redirect url
        if (this.pathname === this.webAuthPage) {
          redirect(
            this.redirectUrl ??
              new URL(WorkspaceRouteInfo({}), this.base).toString()
          );
        }
      } else {
        // if two factor is enabled, then run the before web auth hook
        if (this.beforeWebAuth) {
          await this.beforeWebAuth();
        }

        // validate the two factor auth
        const tfSession = await validateTFAuthCached();

        //  if the two factor auth is not successful
        if (!tfSession.success) {
          // redirect to the auth
          this.pathname !== this.webAuthPage && redirect(this.webAuthPage);
          return;
        } else {
          if (this.afterWebAuth) {
            await this.afterWebAuth();
          }

          // redirect to the redirect url

          if (this.pathname === this.webAuthPage) {
            redirect(
              this.redirectUrl ??
                new URL(WorkspaceRouteInfo({}), this.base).toString()
            );
          }
        }
      }
    } else {
      if (this.afterOAuth) {
        await this.afterOAuth();
      }

      // redirect to the redirect url
      if (this.redirectUrl) {
        if (this.pathname === this.signInPage) {
          redirect(this.redirectUrl);
        }
      }
    }
  }
}
