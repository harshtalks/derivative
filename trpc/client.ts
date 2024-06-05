import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@/trpc";

const client = createTRPCReact<AppRouter>({});

export default client;
