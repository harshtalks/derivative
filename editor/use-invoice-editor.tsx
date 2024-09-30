"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import UnderlineNode from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import History from "@tiptap/extension-history";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import OrderedList from "@tiptap/extension-ordered-list";
import LinkExtension from "@tiptap/extension-link";
import { ImageExtension } from "@harshtalks/image-tiptap";
import { Slash, enableKeyboardNavigation } from "@harshtalks/slash-tiptap";
import { slashSuggestions } from "./suggestions";
import SchemaVariables, {
  enableKeyNavigationForSchemaVariablesInEditor,
} from "./dynamic-variables/schema-variable";
import { generateHTML } from "@tiptap/html";
import { useTypedParams } from "tempeh";
import TemplatePageRouteInfo from "@/app/(routes)/workspaces/[workspaceId]/templates/[templateId]/route.info";
import Branded from "@/types/branded.type";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { saveLocalMarkup } from "@/database/local-store";

const useInvoiceEditor = () => {
  const { templateId } = useTypedParams(TemplatePageRouteInfo);
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
      const { state } = editor;
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
