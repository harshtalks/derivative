"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { object, string, infer as infer_ } from "zod";

const dummySchema = {
  firstName: "Joe",
  lastName: "Dane",
};

/**
 * Function to check if a string is a valid JSON string
 * @param str string to check
 * @returns
 *  parsed JSON, if string is a valid JSON string
 *  undefined, if string is not a valid JSON string
 */
const checkIsValidJson = (str: string) => {
  /**
   * If you don't care about primitives and only objects then this function
   * is for you, otherwise look elsewhere.
   * This function will return `false` for any valid json primitive.
   * EG, 'true' -> false
   *     '123' -> false
   *     'null' -> false
   *     '"I'm a string"' -> false
   */
  try {
    var o = JSON.parse(str);

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === "object") {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
};

const formSchema = object({
  schema: string()
    .min(1)
    .refine((value) => checkIsValidJson(value), {
      message: "The given schema is not a valid JSON.",
    }),
});

const SchemaForm = () => {
  const form = useForm<infer_<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schema: "",
    },
    mode: "all",
  });
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((data) => {})}
      >
        <FormField
          control={form.control}
          name="schema"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                This json schema is used to populate dynamic values inside the
                invoices. Each invoice template can be then generated with data
                sent to API as long as the same data is valid against the given
                JSON object.
              </FormDescription>
              <pre className="px-4 py-3 mt-8 font-mono text-left bg-transparent border rounded border-zinc-600 focus:border-zinc-100/80 focus:ring-0 sm:text-sm text-zinc-100">
                <div className="flex items-start px-1 text-sm">
                  <div
                    aria-hidden="true"
                    className="pr-4 font-mono border-r select-none border-zinc-300/5 text-zinc-700"
                  >
                    {Array.from({
                      length: form.getValues("schema").split("\n").length,
                    }).map((_, index) => (
                      <Fragment key={index}>
                        {(index + 1).toString().padStart(2, "0")}
                        <br />
                      </Fragment>
                    ))}
                  </div>
                  <textarea
                    minLength={1}
                    {...field}
                    rows={Math.max(
                      5,
                      form.getValues("schema").split("\n").length
                    )}
                    placeholder={JSON.stringify(dummySchema, null, 2)}
                    className="w-full p-0 pl-2 text-base !resize-none bg-transparent border-0 appearance-none hover:resize text-zinc-100 placeholder-zinc-500 focus-visible:outline-0 focus:ring-0 sm:text-sm"
                  />
                </div>
              </pre>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit">
          Submit Schema
        </Button>
      </form>
    </Form>
  );
};

export default SchemaForm;
