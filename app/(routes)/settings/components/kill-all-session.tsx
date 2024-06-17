"use client";
import { Button } from "@/components/ui/button";
import client from "@/trpc/client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const KillAllSessions = () => {
  const { refresh } = useRouter();
  const { mutate, isPending } = client.user.killAllSessions.useMutation({
    onSuccess: () => {
      toast.success("All sessions are killed successfully");
      refresh();
    },
  });
  return (
    <Button
      onClick={() => {
        mutate();
      }}
      disabled={isPending}
      size="sm"
      variant="destructive"
    >
      {isPending && <Loader className="mr-1 size-4 animate-spin" />} Logout of
      all sessions
    </Button>
  );
};

export default KillAllSessions;
