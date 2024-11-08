import TFAuthenticate from "@/app/api/auth/two-factor/authenticate/route.info";
import { Button } from "@/components/ui/button";
import { FetchingState } from "@/types/ui.type";
import { startAuthentication } from "@simplewebauthn/browser";
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/types";
import React, { useState } from "react";
import { toast } from "sonner";
import WebAuthRoute from "../../route.info";
import { useRouter } from "next/navigation";
import WorkspaceRouteInfo from "@/app/(routes)/workspaces/route.info";
import { useTempehRouter } from "@/route.config";
import { ErrorWrapperResponse } from "@/types/api.type";
import clientApiTrpc from "@/trpc/client";

const TfLogin = () => {
  const [state, setState] = useState<FetchingState>("idle");
  const { redirectUrl } = WebAuthRoute.useSearchParams();

  const { push: workspacePush } = WorkspaceRouteInfo.useRouter(useRouter);
  const nextRouter = useRouter();

  const tfMutation = clientApiTrpc.user.twoFactor.useMutation({
    throwOnError: true,
  });

  const handler = async () => {
    try {
      setState("loading");

      await tfMutation.mutateAsync({
        action: "enable",
      });

      const response =
        (await TFAuthenticate()) as PublicKeyCredentialRequestOptionsJSON;

      const attResp = await startAuthentication(response);

      const verification = await fetch(
        "/api/auth/two-factor/verify-authentication",
        {
          body: JSON.stringify({ response: attResp }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!verification.ok) {
        throw new Error(verification.statusText);
      }

      const resp = (await verification.json()) as ErrorWrapperResponse<{
        message: string;
      }>;

      if (!resp.success) {
        throw new Error(resp.message);
      }

      redirectUrl
        ? nextRouter.push(redirectUrl)
        : workspacePush({
            params: {},
          });
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        if (e.name === "InvalidStateError") {
          throw new Error(
            "You have already registered for two factor authentication",
          );
        }
        throw new Error(e.message);
      } else {
        throw new Error(
          "An error occurred while registering for two factor authentication",
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
          success: () => {
            return "Successfully registered for two factor authentication";
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
