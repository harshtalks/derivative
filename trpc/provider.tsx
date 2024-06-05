"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import client from "./client";
import { ReactNode, useState } from "react";
import superjson from "superjson";

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({}));

  const [trpcClient] = useState(() =>
    client.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/v1/",
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <client.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </client.Provider>
  );
};

export default QueryProvider;
