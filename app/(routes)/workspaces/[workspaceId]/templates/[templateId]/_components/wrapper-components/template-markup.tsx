"use client";

import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import { Match } from "effect";

import { compile } from "handlebars";
import TemplatePageEditorRouteInfo from "../../editor/route.info";

const TemplateMarkup = ({
  markup,
  jsonStr,
}: {
  markup?: string;
  jsonStr: string;
}) => {
  const renderMarkup = compile(markup ?? "")(JSON.parse(jsonStr));
  const params = TemplatePageEditorRouteInfo.useParams();

  return Match.value(renderMarkup).pipe(
    Match.when(
      (v) => !!v,
      () => (
        <div className="border p-12 overflow-y-auto  w-full">
          <div className="pb-12">
            <div className="mx-auto p-4 max-w-[800px] w-fit text-sm text-muted-foreground rounded-md border z-20 bg-background">
              <p className="">
                This is a preview of the invoice template. All the variable
                instances are replaced with sample json data that was provided.
                You can edit the template and see the changes in real-time.
              </p>
            </div>
          </div>
          <div
            style={{
              // min width and max width being set, minimum A4 size.
              minHeight: "29.7cm",
              minWidth: "21cm",
              maxWidth: "21cm",
            }}
            className="border mx-auto tiptap data-[read-only=true]:border-black p-12 bg-white rounded-md transition-all duration-200"
          >
            <div
              className="prose prose-sm leading-tight marker:text-gray-900 w-full focus:outline-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMarkup),
              }}
            />
          </div>
        </div>
      ),
    ),
    Match.orElse(() => (
      <div className="text-center mx-auto flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          We could not find any markup for this template.
        </p>
        <TemplatePageEditorRouteInfo.Link params={params}>
          <Button size="sm">Create your markup</Button>
        </TemplatePageEditorRouteInfo.Link>
      </div>
    )),
  );
};

export default TemplateMarkup;
