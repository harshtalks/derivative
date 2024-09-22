import {
  Editor,
  Extension,
  ReactRenderer,
  Range as TRange,
} from "@tiptap/react";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { ReactNode, RefObject } from "react";
import tippy, {
  type GetReferenceClientRect,
  type Instance,
  type Props,
} from "tippy.js";
import { SlashCommandOut } from "./components/command";
import { SLASH_CMD_DOM_ID, navigationKeys } from "./components";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  Text,
  ListOrdered,
  Image as ImageIcon,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react";
import imageStore from "../image-store";

const Command = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      } as SuggestionOptions,
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

const renderItems = (elementRef?: RefObject<Element> | null) => {
  let component: ReactRenderer | null = null;
  let popup: Instance<Props>[] | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(SlashCommandOut, {
        props,
        editor: props.editor,
      });

      const { selection } = props.editor.state;

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
    onUpdate: (props: {
      editor: Editor;
      clientRect: GetReferenceClientRect;
    }) => {
      component?.updateProps(props);

      popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect,
      });
    },

    onKeyDown: (props: { event: KeyboardEvent }) => {
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

export interface SuggestionItem {
  title: string;
  description: string;
  icon: ReactNode;
  searchTerms?: string[];
  command: (props: { editor: Editor; range: TRange }) => void;
}

export const slashSuggestions: SuggestionItem[] = [
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 3 })
        .run();
    },
  },
  {
    title: "Heading 4",
    description: "Small section heading.",
    searchTerms: ["subtitle", "smaller"],
    icon: <Heading4 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 4 })
        .run();
    },
  },
  {
    title: "Heading 5",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Heading5 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 5 })
        .run();
    },
  },
  {
    title: "Heading 6",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Heading6 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 6 })
        .run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Ordered List",
    description: "Create a simple ordered list.",
    searchTerms: ["ordered", "point", "numbers"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Image",
    description: "Create a simple ordered list.",
    searchTerms: ["ordered", "point", "numbers"],
    icon: <ImageIcon size={18} />,
    command: () => {
      imageStore.send({
        type: "toggleOpen",
        value: true,
      });
    },
  },
];

export const handleCommandNavigation = (event: KeyboardEvent) => {
  if (navigationKeys.includes(event.key)) {
    const slashCommand = document.querySelector(SLASH_CMD_DOM_ID);
    if (slashCommand) {
      return true;
    }
  }
};

const SlashCommand = Command.configure({
  suggestion: {
    render: renderItems,
    suggestions: () => slashSuggestions,
  },
});

export default SlashCommand;
