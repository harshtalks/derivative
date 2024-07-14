"use client";
import { Button } from "@/components/ui/button";
import client from "@/trpc/client";
import { Loader } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const TfStatusChange = ({ tf }: { tf: boolean }) => {
  const { mutate, isPending } = client.user.twoFactor.useMutation({
    onSuccess: async (data) => {
      toast.success(
        `Two factor authentication is ${tf ? "disabled" : "enabled"}.`
      );

      // refresh the page using windows
      window.location.href = window.location.href;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Button
      onClick={() => {
        mutate({ action: tf ? "disable" : "enable" });
      }}
      disabled={isPending}
    >
      {isPending && <Loader className="size-4 mr-1 animate-spin" />}{" "}
      {tf
        ? "Disable Two Factor Authentication"
        : "Enable Two Factor Authentication"}
    </Button>
  );
};

export default TfStatusChange;
