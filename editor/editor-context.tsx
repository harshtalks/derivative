import { Editor } from "@tiptap/react";
import React, { ReactNode, createContext } from "react";

const invoiceEditorContext = createContext<Editor | null>(null);

export const InvoiceEditorContextProvider = ({
  children,
  editor,
}: {
  children: ReactNode;
  editor: Editor;
}) => {
  return (
    <invoiceEditorContext.Provider value={editor}>
      {children}
    </invoiceEditorContext.Provider>
  );
};

export const useInvoiceEditorContext = () => {
  const context = React.useContext(invoiceEditorContext);
  if (!context) {
    throw new Error(
      "useInvoiceEditor must be used within a InvoiceEditorContextProvider",
    );
  }
  return context;
};

export default invoiceEditorContext;
