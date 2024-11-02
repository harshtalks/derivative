"use client";

import TemplatePageRouteInfo from "@/app/(routes)/workspaces/[workspaceId]/templates/[templateId]/route.info";
import { saveLocalMarkup } from "@/database/local-store";
import Branded from "@/types/branded.type";
import { ImageExtension } from "@harshtalks/image-tiptap";
import { Slash, enableKeyboardNavigation } from "@harshtalks/slash-tiptap";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import LinkExtension from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import UnderlineNode from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import SchemaVariables, {
  enableKeyNavigationForSchemaVariablesInEditor,
} from "./dynamic-variables/schema-variable";
import { slashSuggestions } from "./suggestions";

const useInvoiceEditor = () => {
  const { templateId } = TemplatePageRouteInfo.useParams();
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Italic,
      Bold,
      UnderlineNode,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
          }
          return "Press '/' for commands, {{ for variables";
        },
        includeChildren: true,
      }),
      Highlight,
      Typography,
      History,
      TextAlign.configure({
        defaultAlignment: "left",
        types: ["heading", "paragraph", "tableCell", "image"],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "!list-disc !pl-4",
        },
        itemTypeName: "listItem",
      }),
      ListItem,
      OrderedList,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Dropcursor,
      ImageExtension.configure({
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }).extend({
        allowGapCursor: true,
      }),
      TableCell,
      TableHeader,
      TableRow.extend({
        allowGapCursor: true,
      }),
      Slash.configure({
        suggestion: {
          items: () => slashSuggestions,
        },
      }),
      LinkExtension,
      SchemaVariables,
      HorizontalRule,
    ],

    editorProps: {
      attributes: {
        class:
          "prose prose-sm leading-tight marker:text-gray-900 w-full focus:outline-none",
      },
      handleDOMEvents: {
        keydown: (_, event) => {
          return (
            enableKeyboardNavigation(event) ||
            enableKeyNavigationForSchemaVariablesInEditor(event)
          );
        },
      },
    },
    onUpdate: async ({ editor }) => {
      const html = editor.getHTML();
      await saveLocalMarkup({
        templateId: Branded.TemplateId(templateId),
        markup: html,
      });
    },
  });

  return { editor };
};

export default useInvoiceEditor;
