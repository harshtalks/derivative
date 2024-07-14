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
import { Button } from "@/components/ui/button";
import TfLogin from "./tf-login";
import TFSignup from "./tf-signup";

export function TFDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>WebAuth</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Two Factor Authentication (Passwordless)
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>
              If you are new to the device,We recommend you to{" "}
              <strong>register</strong> your device with webAuth. If you are
              already registered, choose
              <strong> authenticate</strong> to move forward.
            </p>
            <div className="flex items-center pt-4 justify-center gap-4">
              <TFSignup />
              <TfLogin />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="p-0">
            <Button variant="destructive">Cancel</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
