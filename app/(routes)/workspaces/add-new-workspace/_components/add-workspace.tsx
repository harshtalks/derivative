"use client";
import * as React from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { object, string, enum as enum_, infer as zInfer } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormMessage } from "@/components/ui/form";

const addWorkspaceFormSchema = object({
  name: string().min(1),
  description: string().min(10),
  type: enum_(["personal", "standard", "enterprise"]),
});

type AddWorkspaceFormSchemaInfer = zInfer<typeof addWorkspaceFormSchema>;

export function AddWorkspace() {
  const form = useForm<AddWorkspaceFormSchemaInfer>({
    resolver: zodResolver(addWorkspaceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "personal",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: AddWorkspaceFormSchemaInfer) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="max-w-lg mx-auto border-none shadow-none">
          <CardHeader>
            <CardTitle>Add Workspace</CardTitle>
            <CardDescription>
              Separate your Invoices for different teams, organizations or
              businesses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Name of your workspace i.e. Acme inc."
                      {...field}
                    />
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="workspace_type">Type of the team</Label>
                    <Select {...field}>
                      <SelectTrigger id="workspace_type">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="metadata">Short Description</Label>
                    <Textarea
                      className="resize-none"
                      placeholder="What is the use of the team"
                      {...field}
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-row-reverse">
            <Button type="submit">
              <span>Create Workspace</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
