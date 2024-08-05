"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import client from "@/trpc/client";
import Branded from "@/types/branded.type";
import { Session } from "lucia";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { userAgentFromString } from "next/server";
import React from "react";
import { toast } from "sonner";

const SessionCard = ({
  session,
  currentSession,
}: {
  session: Session;
  currentSession: Session;
}) => {
  const { refresh } = useRouter();
  const { mutate, isPending } = client.user.killSession.useMutation({
    onSuccess: () => {
      toast.success("Session is killed successfully");
      refresh();
    },
  });
  const ua = session.userAgent;
  if (!ua) return null;

  const agent = userAgentFromString(ua);

  return (
    <div key={session.id} className="py-4 space-y-3">
      <div className="space-y-1">
        {session.id === currentSession.id ? (
          <Badge
            variant="outline"
            className="bg-green-100 border-none text-green-600"
          >
            Current Session
          </Badge>
        ) : null}
        <p>
          <strong>{agent.browser.name}</strong> - {agent.browser.version}
        </p>
        <p className="text-sm">{agent.os.name}</p>

        <p className="text-sm">
          {agent.device.model} ({agent.device.vendor})
        </p>
        {Date.now() > session.expiresAt.getTime() ? (
          <p className="text-red-500 font-medium text-sm">
            Expired at:{" "}
            {session.expiresAt.toLocaleString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
        ) : (
          <p className="text-sm">
            Expires at:{" "}
            {session.expiresAt.toLocaleString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
        )}
      </div>
      <Button
        onClick={() => {
          mutate({ sessionId: Branded.SessionId(session.id) });
        }}
        disabled={isPending}
        size="sm"
        variant="destructive"
      >
        {isPending && <Loader className="size-4 mr-1 animate-spin" />}{" "}
        {session.id === currentSession.id
          ? "Logout from this session"
          : "Logout"}
      </Button>
    </div>
  );
};

export default SessionCard;
