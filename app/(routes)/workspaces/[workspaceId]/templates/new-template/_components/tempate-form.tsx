"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";

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
import { Label } from "@/components/ui/label";
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
import TemplateSchemaEditor, { DEFAULT_SCHEMA } from "./template-schema-editor";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  schema: z.object({
    type: z.literal("text"),
    schema: z
      .string()
      .min(1)
      .refine((schema) => {
        try {
          const parsed = JSON.parse(schema);
          return true;
        } catch {
          return false;
        }
      }),
  }),
  category: z.string().min(1),
  subCategory: z.string().min(1),
  status: z.enum(templateStatus),
});

export function TemplateForm() {
  const [categoryKey, setCategoryKey] =
    useState<Invoice.Keys>("expenseInvoices");

  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      category: "expenseInvoices" satisfies Invoice.Keys,
      schema: {
        schema: DEFAULT_SCHEMA,
        type: "text",
      },
    },
  });

  const updatedKey = form.watch("category");

  const mutation = clientApiTrpc.template.addNew.useMutation();

  const { workspaceId } = NewTemplateRouteInfo.useParams();

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            toast.promise(
              mutation.mutateAsync({
                workspaceId: Branded.WorkspaceId(workspaceId),
                category: data.category,
                subcategory: data.subCategory,
                jsonSchema: data.schema.schema,
                status: data.status,
                name: data.name,
                description: data.description,
              }),
              {
                success: () => "Successfully created the template",
                error: (err) => err.message,
              },
            );
          })}
        >
          <div className="mx-auto grid container max-w-6xl py-12 flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7">
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
                <Button variant="outline" size="sm">
                  Save as Draft
                </Button>
                <Button size="sm">Save Template</Button>
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
                      Generate Schema for your template here, you may be able to
                      edit this later depending on your plan.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="schema.schema"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Add some schema</FormLabel>
                          <TemplateSchemaEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormDescription>
                            You can add schema for your template here. This will
                            be used to generate the invoice.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="justify-center border-t p-4">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Variant
                    </Button>
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
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Image
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="300"
                        src="/placeholder.svg"
                        width="300"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <button>
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src="/placeholder.svg"
                            width="84"
                          />
                        </button>
                        <button>
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src="/placeholder.svg"
                            width="84"
                          />
                        </button>
                        <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Upload</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-5">
                  <CardHeader>
                    <CardTitle>Archive Product</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div></div>
                    <Button size="sm" variant="secondary">
                      Archive Product
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
