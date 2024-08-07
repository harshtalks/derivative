"use client";

import { FetchingState } from "@/types/ui.type";
import { useState } from "react";

export const useFetchingState = (initialState?: FetchingState) => {
  const [fetchState, setFetchState] = useState<FetchingState>(
    initialState ?? "idle",
  );

  return {
    fetchState,
    setFetchState,
  };
};
