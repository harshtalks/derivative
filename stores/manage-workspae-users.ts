import { createStore } from "@xstate/store";

const DEFAULT_PAGE = 1;

const workspaceUsersMgmtDialogStore = createStore(
  {
    userSearchTerm: "",
    memberSearchTerm: "",
    userSearchPage: DEFAULT_PAGE,
  },
  {
    setUserSearchTerm: (ctx, event: { value: string }) => {
      return {
        userSearchTerm: event.value,
        userSearchPage: DEFAULT_PAGE,
      };
    },
    setMemberSearchTerm: (ctx, event: { value: string }) => {
      return {
        memberSearchTerm: event.value,
      };
    },
  },
);

export default workspaceUsersMgmtDialogStore;
