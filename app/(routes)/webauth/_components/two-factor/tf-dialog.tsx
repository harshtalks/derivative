"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import TfLogin from "./tf-login";
import TFSignup from "./tf-signup";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/cradenza";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function TFDialog() {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>Web Auth</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Two Factor Authentication</CredenzaTitle>
          <CredenzaDescription>
            Secure your account with two factor authentication.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4 pb-4 text-center text-sm sm:pb-0 sm:text-left">
          <p className="leading-relaxed">
            You can enable two factor authentication for your account to add an
            extra layer of security. We are using the most secure and reliable
            two factor authentication method using the webAuthn/Passkeys.
          </p>
        </CredenzaBody>
        <CredenzaFooter>
          <TFSignup />
          <TfLogin />
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
