import TFAuthenticate from "@/app/api/auth/two-factor/authenticate/route.info";
import enableTF from "@/app/api/auth/two-factor/enable/route.info";
import signJWT from "@/app/api/auth/two-factor/sign/route.info";
import { Button } from "@/components/ui/button";
import { FetchingState } from "@/types/ui.type";
import { startAuthentication } from "@simplewebauthn/browser";
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/types";
import React, { useState } from "react";
import { toast } from "sonner";
import WebAuthRoute from "../../route.info";
import { useRouter } from "next/navigation";

const TfLogin = () => {
  const [state, setState] = useState<FetchingState>("idle");
  const { redirectUrl } = WebAuthRoute.useSearchParams();
  const { push } = useRouter();

  const handler = async () => {
    try {
      setState("loading");

      const tfEnableResp = await enableTF({
        params: {},
        body: { value: true },
      });

      if (!tfEnableResp.success) {
        throw new Error(tfEnableResp.message);
      }

      const response = (await TFAuthenticate({
        params: {},
      })) as PublicKeyCredentialRequestOptionsJSON;

      const attResp = await startAuthentication(response);

      const verification = await fetch(
        "/api/auth/two-factor/verify-authentication",
        {
          body: JSON.stringify({ response: attResp }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!verification.ok) {
        throw new Error(verification.statusText);
      }

      const { success } = (await verification.json()) as {
        success: boolean;
        message: string;
      };

      if (!success) {
        throw new Error("Failed to register for two factor authentication");
      }

      // signing jwt

      const signedJWT = await signJWT({
        params: {},
        body: {
          type: "authenticationFlow",
          authId: attResp.id,
        },
      });

      if (!signedJWT.success) {
        throw new Error(signedJWT.message);
      }

      push(redirectUrl || "/");

      return { success: true };
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        if (e.name === "InvalidStateError") {
          throw new Error(
            "You have already registered for two factor authentication"
          );
        }
        throw new Error(e.message);
      } else {
        throw new Error(
          "An error occurred while registering for two factor authentication"
        );
      }
    } finally {
      setState("idle");
    }
  };
  return (
    <Button
      onClick={() => {
        toast.promise(handler, {
          loading: "Authenticating...",
          success: ({ success }) => {
            return success
              ? "Successfully registered for two factor authentication"
              : "Something went wrong while authenticating for two factor authentication";
          },
          error: (e) => e.message,
        });
      }}
      disabled={state === "loading"}
    >
      Authenticate
    </Button>
  );
};

export default TfLogin;
