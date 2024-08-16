import { users } from "@/database/schema";
import { createStore } from "@xstate/store";

const DEFAULT_PAGE = 1;

const workspaceUsersMgmtDialogStore = createStore(
  {
    userSearchTerm: "",
    memberSearchTerm: "",
    selectedUser: null as typeof users.$inferSelect | null,
  },
  {
    setUserSearchTerm: (ctx, event: { value: string }) => {
      return {
        userSearchTerm: event.value,
      };
    },
    setMemberSearchTerm: (ctx, event: { value: string }) => {
      return {
        memberSearchTerm: event.value,
      };
    },
    setSelectedUser: (
      ctx,
      event: { value: typeof users.$inferSelect | null },
    ) => {
      return {
        selectedUser: event.value,
      };
    },
  },
);

export default workspaceUsersMgmtDialogStore;
