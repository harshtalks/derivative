"use client";
import { Session, User } from "lucia";
import { createContext, ReactNode, useContext } from "react";

export const useSessionProvider = () => {
  const values = useContext(sessionContext);

  if (!values) {
    throw new Error("useSessionProvider must be used within a SessionProvider");
  }

  return values;
};

export type SessionProviderReturns = {
  session: Session | null;
  user: User | null;
};

export const sessionContext = createContext<SessionProviderReturns | undefined>(
  undefined
);

export const SessionProvider = ({
  children,
  sessionValue,
}: {
  children: ReactNode;
  sessionValue: SessionProviderReturns;
}) => {
  return (
    <sessionContext.Provider
      value={{
        session: sessionValue.session,
        user: sessionValue.user,
      }}
    >
      {children}
    </sessionContext.Provider>
  );
};
