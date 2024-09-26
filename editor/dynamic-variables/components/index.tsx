import schemaVariableStore from "@/stores/schema-store";
import tunnel from "@/stores/tunnel";
import { EditorRange } from "@/types/editor.types";
import { Editor } from "@tiptap/react";
import { useSelector } from "@xstate/store/react";
import { Command, CommandEmpty, CommandItem, CommandList } from "cmdk";
import {
  ComponentPropsWithoutRef,
  ReactNode,
  createContext,
  useEffect,
  useRef,
} from "react";

export const navigationKeys = ["Enter", "ArrowUp", "ArrowDown"];
export const SCHEMA__VARIABLES_MARKUP_ID =
  "schema__variables__for__the__markup";

const injectContext = createContext({} as ReturnType<typeof tunnel>);

const SchemaProvider = ({ children }: { children: ReactNode }) => {
  const ref = useRef(tunnel());

  return (
    <injectContext.Provider value={ref.current}>
      {children}
    </injectContext.Provider>
  );
};

export const SchemaOut = ({
  query,
  range,
}: {
  query: string;
  range: EditorRange;
}) => {
  useEffect(() => {
    schemaVariableStore.send({
      type: "setQuery",
      query: query,
    });
  }, [query]);

  useEffect(() => {
    schemaVariableStore.send({
      type: "setRange",
      range: range,
    });
  }, [range]);

  useEffect(() => {
    const controller = new AbortController();

    document.addEventListener(
      "keydown",
      (e) => {
        if (navigationKeys.includes(e.key)) {
          e.preventDefault();

          const command = document.getElementById(SCHEMA__VARIABLES_MARKUP_ID);

          if (command) {
            command.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: e.key,
                cancelable: true,
                bubbles: true,
              }),
            );

            return false;
          }
        }
      },
      {
        signal: controller.signal,
      },
    );

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <injectContext.Consumer>
      {(tunnel) => <tunnel.Outlet />}
    </injectContext.Consumer>
  );
};

const Root = ({
  editor,
  children,
}: {
  editor: Editor;
  children: ReactNode;
}) => {
  useEffect(() => {
    schemaVariableStore.send({
      localEditor: editor,
      type: "setLocalEditor",
    });
  }, [editor]);

  const query = useSelector(
    schemaVariableStore,
    (state) => state.context.query,
  );

  const onChange = (q: string) => {
    schemaVariableStore.send({
      type: "setQuery",
      query: q,
    });
  };

  return (
    <injectContext.Consumer>
      {(tunnel) => {
        return (
          <tunnel.Inlet>
            <Command
              onKeyDown={(e) => e.stopPropagation()}
              id={SCHEMA__VARIABLES_MARKUP_ID}
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
        );
      }}
    </injectContext.Consumer>
  );
};

const Item = ({
  onCommand,
  children,
  ...props
}: {
  onCommand: ({
    editor,
    range,
  }: {
    editor: Editor;
    range: EditorRange;
  }) => void;
} & ComponentPropsWithoutRef<typeof CommandItem>) => {
  const editor = useSelector(
    schemaVariableStore,
    (state) => state.context.localEditor,
  );

  const range = useSelector(
    schemaVariableStore,
    (state) => state.context.range,
  );

  if (!editor) {
    throw new Error(
      "Editor is required, Please provide editor to the Cmd.Root or use within EditorProvider.",
    );
  }

  if (!range) {
    return null;
  }

  return (
    <CommandItem
      {...props}
      onSelect={() => onCommand({ editor: editor, range: range })}
      className="flex w-full items-center space-x-2 cursor-pointer rounded-md p-2 text-left text-sm hover:bg-accent aria-selected:bg-accent"
    >
      {children}
    </CommandItem>
  );
};

const SchemNode = {
  provider: SchemaProvider,
  root: Root,
  item: Item,
  List: CommandList,
  Empty: CommandEmpty,
};

export default SchemNode;
