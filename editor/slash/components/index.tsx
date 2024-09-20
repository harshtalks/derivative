import { ReactNode, useRef } from "react";
import tunnel from "tunnel-rat";
import { slashCommandTunnelContext } from "./command";

export const SLASH_CMD_DOM_ID = "slash-cmd";
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
