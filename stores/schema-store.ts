import { createStore } from "@xstate/store";
import type { Editor } from "@tiptap/react";
import { EditorRange } from "@/types/editor.types";

const schemaVariableStore = createStore(
  {
    query: "",
    range: null as EditorRange | null,
    localEditor: null as Editor | null,
  },
  {
    setQuery: (_, event: { query: string }) => {
      return {
        query: event.query,
      };
    },
    setRange: (_, event: { range: EditorRange }) => {
      return {
        range: event.range,
      };
    },
    setLocalEditor: (_, event: { localEditor: Editor }) => {
      return {
        localEditor: event.localEditor,
      };
    },
  },
);

export default schemaVariableStore;
