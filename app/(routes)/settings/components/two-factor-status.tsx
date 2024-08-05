import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/trpc/server";
import React from "react";
import TfStatusChange from "./tf-status-change";

const TwoFactorStatus = async () => {
  const { twoFactorEnabled } = await api.user.get();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Two Factor Authentication</CardTitle>
        <CardDescription>
          Two factor authentication adds an extra layer of security to your
          account. We use the latest security standards with passkey (webAuthN)
          to ensure your account is safe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {twoFactorEnabled ? (
          <Alert variant="default" className="flex w-fit items-center gap-2">
            <div className="size-3 rounded-full shrink-0 bg-green-500"></div>{" "}
            You are currently using two factor authentication.
          </Alert>
        ) : (
          <Alert variant="default" className="flex w-fit items-center gap-2">
            <div className="size-3 rounded-full shrink-0 bg-red-500"></div> You
            are not using two factor authentication. Enable it now to secure
            your account.
          </Alert>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <TfStatusChange tf={twoFactorEnabled} />
      </CardFooter>
    </Card>
  );
};

export default TwoFactorStatus;
