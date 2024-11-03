"use client";

import { TextShimmer } from "@/components/motion-ui/text-shimmer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CodeiumEditor } from "@codeium/react-code-editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import TemplateSchemaEditor from "../../../new-template/_components/template-schema-editor";

const formSchema = z.object({
  sendTo: z
    .string({
      message: "Please enter a valid email address",
    })
    .email({
      message: "Please enter a valid email address",
    }),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string(),
  message: z.string(),
  json: z
    .string({
      message: "Please enter a valid JSON, it should match the schema",
    })
    .min(1),
});

type FormSchema = z.infer<typeof formSchema>;

const SendInvoice = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  return (
    <div className="border-r border-t overflow-auto border-l w-full">
      <div className="p-4">
        <div className="text-center space-y-4 pt-12">
          <TextShimmer
            duration={1.2}
            className="text-base font-light [--base-color:theme(colors.blue.600)] [--base-gradient-color:theme(colors.blue.200)] dark:[--base-color:theme(colors.blue.700)] dark:[--base-gradient-color:theme(colors.blue.400)]"
          >
            Send an Invoice
          </TextShimmer>
          <h1 className="font-bold text-4xl">
            Fill in the form to send an invoice
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            You will not require to use the Access Token to send an invoice
            through the dashboard. However, if you plan to send an invoice
            through the API, you will need to use the Access Token.
          </p>
        </div>
        <div className="max-w-lg mx-auto pt-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <Card className={cn("w-full shadow-none")}>
                <CardHeader>
                  <CardTitle>Send Invoice</CardTitle>
                  <CardDescription>
                    You can enable email notifications to the invoice recipient.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="sendTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Recipient Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="abc@xyz.com"
                              className="shadow-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Sales Invoice #1234"
                              className="shadow-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Message (note)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="this mails is regarding.."
                              className="shadow-none resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="json"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Schema Object
                          </FormLabel>
                          <FormControl>
                            <TemplateSchemaEditor
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <BellRing />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Push Notifications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Send notifications to device.
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Send Invoice</Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SendInvoice;
