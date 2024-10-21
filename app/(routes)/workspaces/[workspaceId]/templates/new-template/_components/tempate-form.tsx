"use client";
import { ChevronLeft, Loader } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fragment, useState } from "react";
import { Invoice } from "@/static/invoice";
import TemplateSchemaEditor, {
  DEFAULT_SCHEMA,
  DEFAULT_SCHEMA_JSON,
} from "./template-schema-editor";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { templateStatus } from "@/database/schema";
import clientApiTrpc from "@/trpc/client";
import { toast } from "sonner";
import NewTemplateRouteInfo from "../route.info";
import Branded from "@/types/branded.type";
import { Navigate, useTempehRouter } from "@/route.config";
import { useRouter } from "next/navigation";
import templatesPageRoute from "../../route.info";
import { validate } from "json-schema";
import Ajv from "ajv";
import JSchema from "@/schema-processing";

const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  schema: z.object({
    type: z.literal("text"),
    json: z
      .string()
      .min(1)
      .refine(
        (schema) => {
          try {
            const parsed = JSON.parse(schema);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Invalid JSON",
        },
      ),
  }),
  category: z.string().min(1),
  subCategory: z.string().min(1),
  status: z.enum(templateStatus),
});

const btnLabel = (isLoading: boolean, existing: boolean) => {
  return isLoading
    ? existing
      ? "Updating the template..."
      : "Creating the template..."
    : existing
      ? "Update Template"
      : "Create Template";
};

type TemplateFormSchema = z.infer<typeof templateSchema>;

export function TemplateForm({
  existingTemplate,
}: {
  existingTemplate?: TemplateFormSchema;
}) {
  const { push: moveToTemplatesPage } = templatesPageRoute.useRouter(useRouter);
  const { templateId: existingTemplateId } =
    NewTemplateRouteInfo.useSearchParams();
  const { workspaceId } = NewTemplateRouteInfo.useParams();

  const form = useForm<TemplateFormSchema>({
    resolver: zodResolver(templateSchema),
    defaultValues: existingTemplate
      ? existingTemplate
      : {
          category: "Expense Invoices" satisfies Invoice.Keys,
          schema: {
            type: "text",
            json: DEFAULT_SCHEMA_JSON,
          },
        },
  });

  const updatedKey = form.watch("category");

  const mutation = clientApiTrpc.template.addNew.useMutation({
    onSuccess: () => {
      moveToTemplatesPage({
        params: {
          workspaceId: Branded.WorkspaceId(workspaceId),
        },
      });
    },
  });

  const updateMutation = clientApiTrpc.template.update.useMutation({
    onSuccess: () => {
      moveToTemplatesPage({
        params: {
          workspaceId: Branded.WorkspaceId(workspaceId),
        },
      });
    },
  });

  const { back } = useTempehRouter(useRouter);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            try {
              const json = JSON.parse(data.schema.json);
              const schema = new JSchema(json)
                .assertValidObject()
                .applyConstraints({
                  noTopLevelArray: true,
                })
                .createSchema({
                  title: data.name,
                  description: data.description,
                })
                .getSchema();

              const ajv = new Ajv();
              const validate = ajv.compile(schema);
              const valid = validate(json);

              if (!valid) {
                throw new Error(
                  "Oops. looks like the json is invalid against the given schema.",
                );
              }

              if (existingTemplate && existingTemplateId) {
                toast.promise(
                  updateMutation.mutateAsync({
                    id: Branded.TemplateId(existingTemplateId),
                    category: data.category,
                    subcategory: data.subCategory,
                    jsonSchema: JSON.stringify(schema),
                    status: data.status,
                    name: data.name,
                    description: data.description,
                    json: data.schema.json,
                    workspaceId: Branded.WorkspaceId(workspaceId),
                    updatedAt: Date.now(),
                  }),
                  {
                    success: () => "Successfully created the template",
                    error: (err) => err.message,
                    loading: "Updating the template...",
                  },
                );
              } else {
                toast.promise(
                  mutation.mutateAsync({
                    workspaceId: Branded.WorkspaceId(workspaceId),
                    category: data.category,
                    subcategory: data.subCategory,
                    jsonSchema: JSON.stringify(schema),
                    status: data.status,
                    name: data.name,
                    description: data.description,
                    json: data.schema.json,
                  }),
                  {
                    success: () => "Successfully created the template",
                    error: (err) => err.message,
                    loading: "Creating the template...",
                  },
                );
              }
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Invalid JSON");
              return;
            }
          })}
        >
          <div className="mx-auto grid container max-w-6xl py-12 flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={back}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                New Template
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                workspace
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button type="button" variant="outline" size="sm">
                  Save as Draft
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={mutation.isPending}
                  className="inline-flex items-center gap-2"
                >
                  {mutation.isPending ? (
                    <Loader className="shrink-0 animate-spin size-4" />
                  ) : null}
                  {btnLabel(
                    mutation.isPending || updateMutation.isPending,
                    Boolean(existingTemplateId) && Boolean(existingTemplate),
                  )}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0" className="shadow-none">
                  <CardHeader>
                    <CardTitle>Template Details</CardTitle>
                    <CardDescription>
                      Add your invoice template details here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What do you call it?</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="w-full shadow-none"
                                  placeholder="i.e. Invoice Template"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What is it about?</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  id="description"
                                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                                  className="min-h-32 resize-none shadow-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-1" className="shadow-none">
                  <CardHeader>
                    <CardTitle>Template Schema</CardTitle>
                    <CardDescription>
                      Add your json object here containing all the necessary
                      information for the invoice generation. Schema will be
                      inferred from the given json object. This is an AI powered
                      editor that will help you to create JSON on the fly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="schema.json"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sample JSON Object</FormLabel>
                          <TemplateSchemaEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormDescription>
                            Please make sure, that given sample json object is
                            valid compared to the schema.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="justify-center border-t p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We need both schema and json object to generate the
                      invoice in future. this will allow us to generate the
                      invoice based on the schema and json object. You can
                      create as complex schema as you want. For more
                      information, visit{" "}
                      <Navigate
                        base="JSON_SCHEMA_TOOL"
                        path="/json-to-json-schema"
                        className="text-primary underline"
                        target="_blank"
                      >
                        json to json-schema helper
                      </Navigate>{" "}
                      to see how your json object will be used to generate a
                      seriliazable schema.
                    </p>
                  </CardFooter>
                </Card>
                <Card x-chunk="dashboard-07-chunk-2" className="shadow-none">
                  <CardHeader>
                    <CardTitle>Invoice Categories</CardTitle>
                    <CardDescription>
                      It is always adviced to categorize your invoices for
                      better. This can be used for better reporting, analytics,
                      and filtering also.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={(v) => {
                                  field.onChange(v);
                                  form.setValue("subCategory", "");
                                }}
                              >
                                <SelectTrigger
                                  id="category"
                                  aria-label="Select category"
                                >
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Invoice.getKeys().map((key) => (
                                    <SelectItem key={key} value={key}>
                                      {Invoice.getCategory(key)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="subCategory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SubCategory</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  id="subcategory"
                                  aria-label="Select subcategory"
                                >
                                  <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Invoice.getSubCategory(
                                    updatedKey as Invoice.Keys,
                                  ).map((key) => (
                                    <SelectItem key={key} value={key}>
                                      {key}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3" className="shadow-none">
                  <CardHeader>
                    <CardTitle>Template Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Status</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className="capitalize"
                                  id="status"
                                  aria-label="Select status"
                                >
                                  <SelectValue
                                    className="capitalize"
                                    placeholder="Select status"
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {templateStatus.map((el) => (
                                    <SelectItem
                                      className="capitalize"
                                      key={el}
                                      value={el}
                                    >
                                      {el}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card x-chunk="dashboard-07-chunk-5">
                  <CardHeader>
                    <CardTitle>Workspace templates</CardTitle>
                    <CardDescription>
                      Access all your workspaces from here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div></div>
                    <templatesPageRoute.Link
                      params={{ workspaceId: Branded.WorkspaceId(workspaceId) }}
                    >
                      <Button size="sm" variant="secondary">
                        Workspace templates
                      </Button>
                    </templatesPageRoute.Link>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button type="button" variant="outline" size="sm">
                Discard
              </Button>
              <Button
                size="sm"
                type="submit"
                className="inline-flex items-center gap-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader className="shrink-0 animate-spin size-4" />
                ) : null}
                {btnLabel(
                  mutation.isPending || updateMutation.isPending,
                  Boolean(existingTemplateId) && Boolean(existingTemplate),
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
