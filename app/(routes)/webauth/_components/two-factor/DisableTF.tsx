"use client";

import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import client from "@/trpc/client";
import { useRouter } from "next/navigation";
import WorkspaceRouteInfo from "@/app/(routes)/workspaces/route.info";

export const DisableTF = () => {
  const { push } = useRouter();

  const { mutate, isPending } = client.user.twoFactor.useMutation({
    onSuccess: (data) => {
      toast.success(
        "Two factor authentication is disabled. You can enable it again in your settings."
      );
      push(WorkspaceRouteInfo({}));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Button
      onClick={() => {
        mutate({ action: "disable" });
      }}
      variant="link"
      disabled={isPending}
    >
      {isPending && <Loader className="m-1 h-4 w-4 animate-spin" />} Skip for
      Now
    </Button>
  );
};
