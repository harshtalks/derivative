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
import TemplateSchemaEditor from "./template-schema-editor";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jsonSchemaObject } from "@/template-schema";
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

const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  schema: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("text"),
      schema: z.string().min(1),
    }),
    z.object({
      type: z.literal("form"),
      schema: jsonSchemaObject,
    }),
  ]),
  category: z.string().min(1),
  subCategories: z.string().min(1),
});

export function TemplateForm() {
  const [categoryKey, setCategoryKey] =
    useState<Invoice.Keys>("expenseInvoices");

  const subCategory = Invoice.getSubCategory(categoryKey);

  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      schema: {
        type: "form",
      },
    },
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Form {...form}>
        <form>
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
                        <Label htmlFor="name">What do you call it?</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          placeholder="i.e. Invoice Template"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">What is it about?</Label>
                        <Textarea
                          id="description"
                          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                          className="min-h-32 resize-none"
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
                    <Tabs
                      value={
                        form.getValues("schema.type") === "text"
                          ? "editor"
                          : "form"
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="form">Form</TabsTrigger>
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                      </TabsList>
                      <TabsContent value="editor">
                        <TemplateSchemaEditor />
                      </TabsContent>
                      <TabsContent
                        value="form"
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormField
                          control={form.control}
                          name="schema.schema.title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Schema Title</FormLabel>
                              <FormControl>
                                <Input
                                  className="shadow-none"
                                  placeholder="shadcn"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Title for the schema
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="schema.schema.description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Schema description</FormLabel>
                              <FormControl>
                                <Input
                                  className="shadow-none"
                                  placeholder="shadcn"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Schema description
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    </Tabs>
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
                        <Label htmlFor="category">Category</Label>
                        <Select
                          defaultValue={categoryKey}
                          onValueChange={(e) => {
                            setCategoryKey(e as Invoice.Keys);
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
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Select>
                          <SelectTrigger
                            id="subcategory"
                            aria-label="Select subcategory"
                          >
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {subCategory.map((key) => (
                              <SelectItem key={key} value={key}>
                                {key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Label htmlFor="status">Status</Label>
                        <Select>
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
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
