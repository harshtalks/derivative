import { useRef } from "react";
import { templateMarkups, templates } from "@/database/schema";
import Branded from "@/types/branded.type";
import { initialValue, templateMarkQuery } from "./markup";
import { useSelector } from "@xstate/store/react";
import { useQuery } from "@tanstack/react-query";
import { match } from "ts-pattern";
import { deepKeys } from "deeks";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Playground from "./Playground";
import { ErrorBoundary } from "react-error-boundary";

export const getSchemaKeys = (str: string) => {
  try {
    const schema = JSON.parse(str);
    return deepKeys(schema).map((l, i) => ({
      label: l,
      text: `{{${l}}}`,
      key: i.toString(),
    }));
  } catch {
    return [];
  }
};

const InvoiceEditor = ({
  template,
  markup,
}: {
  template: typeof templates.$inferSelect;
  markup: typeof templateMarkups.$inferSelect | null;
}) => {
  const query = useQuery(templateMarkQuery(Branded.TemplateId(template.id)));

  return match(query)
    .with({ status: "success" }, ({ data }) => {
      return (
        <ErrorBoundary
          fallback={
            <div className="py-24 flex items-center justify-center">
              <p>Something went wrong</p>
            </div>
          }
        >
          <Playground template={template} markup={markup} localMarkup={data} />
        </ErrorBoundary>
      );
    })
    .with({ status: "pending" }, () => {
      return (
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="shrink-0 size-4 animate-spin" />
        </div>
      );
    })
    .with({ status: "error" }, ({ error }) => (
      <div className="py-12 flex items-center justify-center">
        <p>{error.message}</p>
      </div>
    ))
    .exhaustive();
};

export default InvoiceEditor;
