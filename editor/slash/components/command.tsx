import { ReactNode, createContext, useEffect } from "react";
import { Range as TRange } from "@tiptap/react";
import { slashStore } from "../slash-store";
import { SLASH_CMD_DOM_ID, navigationKeys } from ".";
import { useSelector } from "@xstate/store/react";
import { Command } from "cmdk";
import tunnel from "@/stores/tunnel";

export const slashCommandTunnelContext = createContext(
  {} as ReturnType<typeof tunnel>,
);

interface SlashCommandOutProps {
  readonly query: string;
  readonly range: TRange;
}

export const SlashCommandOut = (props: SlashCommandOutProps) => {
  useEffect(() => {
    slashStore.send({
      type: "setQuery",
      query: props.query,
    });
  }, [props.query]);

  useEffect(() => {
    slashStore.send({
      type: "setRange",
      range: props.range,
    });
  }, [props.range]);

  useEffect(() => {
    const abortController = new AbortController();

    document.addEventListener(
      "keydown",
      (event) => {
        if (navigationKeys.includes(event.key)) {
          event.preventDefault();
          const commandRef = document.getElementById(SLASH_CMD_DOM_ID);
          if (commandRef) {
            commandRef.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: event.key,
                cancelable: true,
                bubbles: true,
              }),
            );

            return false;
          }
        }
      },
      {
        signal: abortController.signal,
      },
    );

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <slashCommandTunnelContext.Consumer>
      {(tunnel) => <tunnel.Outlet />}
    </slashCommandTunnelContext.Consumer>
  );
};

const SlashCommand = ({ children }: { children: ReactNode }) => {
  const query = useSelector(slashStore, (st) => st.context.query);
  const onChange = (query: string) => {
    slashStore.send({
      type: "setQuery",
      query,
    });
  };

  return (
    <slashCommandTunnelContext.Consumer>
      {(tunnel) => (
        <tunnel.Inlet>
          <Command
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            id={SLASH_CMD_DOM_ID}
            className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background p-4  shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] transition-all"
          >
            <Command.Input
              value={query}
              onValueChange={onChange}
              style={{ display: "none" }}
            />
            {children}
          </Command>
        </tunnel.Inlet>
      )}
    </slashCommandTunnelContext.Consumer>
  );
};

export const SlashCommandList = Command.List;

export default SlashCommand;
