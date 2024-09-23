import { ReactNode, useRef } from "react";
import { slashCommandTunnelContext } from "./command";
import tunnel from "@/stores/tunnel";

export const SLASH_CMD_DOM_ID = "editor__slash__command__dom__id";
export const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];

const SlashCommandRoot = ({ children }: { children: ReactNode }) => {
  const tunnelInstance = useRef(tunnel()).current;

  return (
    <slashCommandTunnelContext.Provider value={tunnelInstance}>
      {children}
    </slashCommandTunnelContext.Provider>
  );
};

export default SlashCommandRoot;
