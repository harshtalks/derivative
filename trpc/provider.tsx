"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import client from "./client";
import { ReactNode, useState } from "react";
import superjson from "superjson";
import { env } from "@/env";
import V1Route from "@/app/api/v1/[...trpc]/route.info";

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({}));

  const [trpcClient] = useState(() =>
    client.createClient({
      links: [
        httpBatchLink({
          url: new URL(V1Route({}), env.NEXT_PUBLIC_BASE_URL).toString(),
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <client.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </client.Provider>
  );
};

export default QueryProvider;
