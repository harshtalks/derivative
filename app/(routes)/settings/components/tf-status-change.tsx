"use client";
import { Button } from "@/components/ui/button";
import client from "@/trpc/client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const TfStatusChange = ({ tf }: { tf: boolean }) => {
  const { refresh } = useRouter();
  const { mutate, isPending } = client.user.twoFactor.useMutation({
    onSuccess: (data) => {
      toast.success(
        `Two factor authentication is ${tf ? "disabled" : "enabled"}.`
      );

      refresh();
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
