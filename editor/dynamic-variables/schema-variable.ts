import {
  SchemaVariable,
  SchemaVariableSuggestionOptions,
} from "@/types/editor.types";
import { Extension, ReactRenderer } from "@tiptap/react";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import tippy, { Instance, Props } from "tippy.js";
import {
  SCHEMA__VARIABLES_MARKUP_ID,
  SchemaOut,
  navigationKeys,
} from "./components";
import { KeyboardEvent } from "react";
import { PluginKey } from "@tiptap/pm/state";

const renderItems: SuggestionOptions["render"] = (
  elementRef?: React.RefObject<Element> | null,
) => {
  let component: ReactRenderer | null = null;
  let popup: Instance<Props>[] | null = null;

  return {
    onStart: (props) => {
      const { editor, clientRect } = props;

      component = new ReactRenderer(SchemaOut, {
        editor: editor,
        props,
      });

      const { selection } = editor.state;
      const parentNode = selection.$from.node(selection.$from.depth);
      const blockType = parentNode.type.name;

      if (blockType === "codeBlock") {
        return false;
      }

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => (elementRef ? elementRef.current : document.body),
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },

    onUpdate: (props) => {
      component?.updateProps(props);

      popup?.[0]?.setProps({
        // @ts-ignore
        getReferenceClientRect: props.clientRect,
      });
    },

    onKeyDown: (props) => {
      if (props.event.key === "Escape") {
        popup?.[0]?.hide();

        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },

    onExit: () => {
      popup?.[0]?.destroy();
      component?.destroy();
    },
  };
};

export const createSchemaVariables = (items: string[]): SchemaVariable[] => {
  return items.map((item) => ({
    value: item,
    command: ({ editor, range }) => {
      // empty space closes the suggestion
      const content = `{{${item}}}` + " ";
      editor.chain().focus().deleteRange(range).insertContent(content).run();
    },
  }));
};

const SchemaVariableExtension =
  Extension.create<SchemaVariableSuggestionOptions>({
    name: "schemaVariable",
    addOptions: () => {
      return {
        suggestion: {
          char: "{{",
          command: ({ editor, range, props }) => {
            props.command({ editor, range });
          },
          pluginKey: new PluginKey("schemaVariable"),
          render: renderItems,
        },
      };
    },
    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  });

export const enableKeyNavigationForSchemaVariablesInEditor = (
  e: KeyboardEvent,
) => {
  if (navigationKeys.includes(e.key)) {
    const schemaNode = document.getElementById(SCHEMA__VARIABLES_MARKUP_ID);
    if (schemaNode) {
      return true;
    }
  }
};

export default SchemaVariableExtension;
