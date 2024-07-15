// Wrapping the Component
import "server-only";
import {
  validateRequestCached,
  validateTFAuthCached,
} from "../validate-request";
import SignInPage from "@/app/(routes)/sign-in/route.info";
import { redirect } from "next/navigation";
import { TfTokenPayload } from "../tf";
import { Session, User } from "lucia";
import WebAuthRoute from "@/app/(routes)/webauth/route.info";

export type WithOAuthConfigProps = {
  redirectPath?: string;
  withWebAuthn?:
    | {
        enabled: false;
      }
    | {
        enabled: true;
        onSuccess?: (payload: TfTokenPayload) => void;
      };
  withAuth?: {
    onSuccess: (session: Session, user: User) => void;
  };
};

const withAuth = <TProps extends {}>(
  renderFn: (props: TProps) => JSX.Element | Promise<JSX.Element>,
  withOAuthConfig?: WithOAuthConfigProps
) => {
  return async (props: TProps) => {
    // check if the user session is valid
    const { session, user } = await validateRequestCached();

    if (!session || !user) {
      // redirect to the auth
      redirect(withOAuthConfig?.redirectPath ?? SignInPage({}));
    }

    if (withOAuthConfig?.withWebAuthn?.enabled) {
      const tfEnabled = user.twoFactorEnabled;

      if (tfEnabled) {
        const tfSession = await validateTFAuthCached();

        if (!tfSession.success) {
          // redirect to the auth
          redirect(withOAuthConfig?.redirectPath ?? WebAuthRoute({}));
        }

        const payload = tfSession.payload;

        if (withOAuthConfig.withWebAuthn.onSuccess) {
          withOAuthConfig.withWebAuthn.onSuccess(payload);
        }

        return renderFn(props);
      } else {
        return renderFn(props);
      }
    } else {
      if (withOAuthConfig?.withAuth?.onSuccess) {
        withOAuthConfig.withAuth.onSuccess(session, user);
      }
      return renderFn(props);
    }
  };
};

export default withAuth;
