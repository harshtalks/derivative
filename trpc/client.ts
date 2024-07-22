import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@/trpc";

const clientApiTrpc = createTRPCReact<AppRouter>({});

export default clientApiTrpc;
