"use client";
import TFRegistration from "@/app/api/auth/two-factor/registration/route.info";
import { Button } from "@/components/ui/button";
import { FetchingState } from "@/types/ui.type";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";
import React, { useEffect, useReducer, useState } from "react";
import {
  browserSupportsWebAuthn,
  startRegistration,
} from "@simplewebauthn/browser";
import { toast } from "sonner";
import enableTF from "@/app/api/auth/two-factor/enable/route.info";
import { useRouter } from "next/navigation";
import WorkspaceRouteInfo from "@/app/(routes)/workspaces/route.info";
import { useTempehRouter } from "@/route.config";
import WebAuthRoute from "../../route.info";

const TFSignup = () => {
  const [state, setState] = useState<FetchingState>("idle");
  const [isSupported, setIsSupported] = useState(true);
  const { push } = WorkspaceRouteInfo.useRouter(useRouter);
  const { push: tempehPush } = useTempehRouter(useRouter);
  const { redirectUrl } = WebAuthRoute.useSearchParams();

  const handler = async () => {
    setState("loading");
    try {
      const response = await enableTF({
        params: {},
        body: { value: true },
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      const startRegResp = (await TFRegistration({
        params: {},
      })) as PublicKeyCredentialCreationOptionsJSON;

      const attResp = await startRegistration(startRegResp);

      const verification = await fetch(
        "/api/auth/two-factor/verify-registration",
        {
          method: "POST",
          body: JSON.stringify({
            registrationResponse: attResp,
            webAuthUserId: startRegResp.user.id,
          }),
        }
      );

      if (!verification.ok) {
        throw new Error(verification.statusText);
      }

      const { verified } = (await verification.json()) as { verified: boolean };

      redirectUrl
        ? tempehPush({ path: redirectUrl })
        : push({
            // as it accepts empty object
            params: {},
          });

      return {
        verified,
      };
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

  useEffect(() => {
    // check if the browser supports webAuthn

    if (!browserSupportsWebAuthn()) {
      // looks like the browser does not support webAuthn
      setIsSupported(false);
      toast.error(
        "Your browser does not support webAuthn as of now, try a different browser or skip this step. you can enable it later from the settings page in dashboard."
      );
    }
  }, []);

  return (
    <Button
      disabled={isSupported === false || state === "loading"}
      onClick={() => {
        toast.promise(handler, {
          loading: "Wait while registering...",
          success: ({ verified }) => {
            return verified
              ? "Successfully registered for two factor authentication"
              : "Failed to register for two factor authentication";
          },
          error: (e) => e.message,
        });
      }}
    >
      Register
    </Button>
  );
};

export default TFSignup;
