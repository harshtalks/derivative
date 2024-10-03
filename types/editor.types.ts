import { Editor, Range as TRange } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import { ReactNode } from "react";

export type EditorRange = TRange;

export type SchemaVariable = {
  value: string;
  command: (props: { editor: Editor; range: EditorRange }) => void;
  label: ReactNode;
};

export type SchemaVariableSuggestionOptions = {
  suggestion: Omit<SuggestionOptions<SchemaVariable>, "editor">;
};
