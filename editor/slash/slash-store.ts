import { Range as TRange } from "@tiptap/react";
import { createStore } from "@xstate/store";

export const slashStore = createStore(
  {
    query: "",
    range: null as TRange | null,
  },
  {
    setQuery: (_, event: { query: string }) => {
      return {
        query: event.query,
      };
    },
    setRange: (_, event: { range: TRange }) => {
      return {
        range: event.range,
      };
    },
  },
);
