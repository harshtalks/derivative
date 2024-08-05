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
import { object, string, enum as enum_, infer as zInfer, array } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { workspaceTypes } from "@/database/schema";
import { InputTags } from "@/components/ui/input-tags";
import { Loader } from "lucide-react";
import clientApiTrpc from "@/trpc/client";
import { toast } from "sonner";
import WorkspaceRouteInfo from "../../route.info";
import { useRouter } from "next/navigation";

const addWorkspaceFormSchema = object({
  name: string().min(1),
  description: string().min(10),
  type: enum_(workspaceTypes),
  tags: array(string().min(1)).min(1),
  note: string().optional(),
});

type AddWorkspaceFormSchemaInfer = zInfer<typeof addWorkspaceFormSchema>;

export function AddWorkspace() {
  const form = useForm<AddWorkspaceFormSchemaInfer>({
    resolver: zodResolver(addWorkspaceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "personal",
      tags: [],
      note: "",
    },
  });

  const { push } = WorkspaceRouteInfo.useRouter(useRouter);

  const { isPending, mutate } = clientApiTrpc.workspace.create.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(
        "we have created the workspace for you with the name - " +
          data.workspace.name
      );
      // reset the form
      form.reset();
      // redirect to the workspace

      push({ params: {} });
    },
  });
  // fetching state

  // 2. Define a submit handler.
  function onSubmit(values: AddWorkspaceFormSchemaInfer) {
    mutate({
      name: values.name,
      description: values.description,
      status: "active",
      workspaceType: values.type,
      tags: values.tags,
      note: values.note,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="max-w-lg mx-auto shadow-none">
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="metadata">Tags</Label>
                    <InputTags
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. freelance, e-commerce"
                      className="max-w-[500px]"
                    />
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="note">Note</Label>
                    <Input
                      id="note"
                      placeholder="Add a note for your workspace"
                      {...field}
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-row-reverse">
            <Button disabled={isPending} type="submit">
              <span className="inline-flex items-center">
                {isPending && (
                  <Loader className="size-4 animate-spin shrink-0 mr-1" />
                )}
                {isPending ? "Creating Workspace..." : "Create Workspace"}
              </span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
