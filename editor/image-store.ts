import { createStore } from "@xstate/store";

const imageStore = createStore(
  { open: false, url: "", alt: "" },
  {
    toggleOpen: (ctx, event: { value: boolean }) => {
      return { open: event.value };
    },
    setImageUrl: (ctx, event: { url: string; alt?: string }) => {
      return { url: event.url, alt: event.alt || "" };
    },
  },
);

export default imageStore;
