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
import ImageResize from "tiptap-extension-resize-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

const useInvoiceEditor = () => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Italic,
      Bold,
      UnderlineNode,
      Placeholder.configure({
        placeholder: "Start typing...",
        showOnlyCurrent: false,
      }),
      Highlight,
      Typography,
      History,
      TextAlign.configure({
        defaultAlignment: "left",
        types: ["heading", "paragraph", "tableCell"],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "!list-disc !pl-4",
        },
        itemTypeName: "listItem",
      }),
      ListItem,
      Heading,
      Image.configure({
        allowBase64: true,
      }),
      Dropcursor,
      ImageResize.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "image-node",
        },
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
    ],
    content: `
            <p>The Text extension is required, at least if you want to have text in your text editor and that’s very likely.</p>
          `,
  });

  return { editor };
};

export default useInvoiceEditor;
