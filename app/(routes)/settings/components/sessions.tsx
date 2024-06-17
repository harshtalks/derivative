import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/trpc/server";
import { userAgent, userAgentFromString } from "next/server";
import React from "react";

import SessionCard from "./session";
import KillAllSessions from "./kill-all-session";

const Session = async () => {
  const { sessions, currentSession } = await api.user.sessions();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Management</CardTitle>
        <CardDescription>
          Manage your active sessions and log out of them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/**sort based on current session coming on top */}
        {sessions
          .toSorted((a, b) => {
            if (a.id === currentSession.id) return -1;
            if (b.id === currentSession.id) return 1;
            return 0;
          })
          .map((el) => {
            return (
              <SessionCard
                key={el.id}
                session={el}
                currentSession={currentSession}
              />
            );
          })}
      </CardContent>
      <CardFooter className="border-t flex items-center px-6 py-4">
        <KillAllSessions />
      </CardFooter>
    </Card>
  );
};

export default Session;
