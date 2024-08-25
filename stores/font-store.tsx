import { lora } from "@/fonts";
import { createStore } from "@xstate/store";

export const fontStore = createStore(
  {
    editorFont: lora.variable as `--${string}`,
  },
  {
    changeEditorFont: (ctx, event: { value: `--${string}` }) => {
      return {
        editorFont: event.value,
      };
    },
  },
);
