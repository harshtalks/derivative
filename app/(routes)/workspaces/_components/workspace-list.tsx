"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { workspaces, workspaceStatus } from "@/database/schema";
import { cn } from "@/lib/utils";
import { useSessionProvider } from "@/providers/session.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow, set } from "date-fns";
import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { object, string, enum as _enum, infer as _infer } from "zod";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Alert } from "@/components/ui/alert";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import AddNewWorkspaceRoute from "../add-new-workspace/route.info";
import DashboardRoute from "../[workspaceId]/dashboard/route.info";
import Branded from "@/types/branded.type";
import { VirtuosoGrid } from "react-virtuoso";

const filters = ["Name", "Type", "Status", "Tags"] as const;

const gridComponents = {
  List: forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
    ({ style, children, ...props }, ref) => (
      <div
        ref={ref}
        {...props}
        className="grid h-[200px] grid-cols-1 md:grid-cols-2 max-w-[1020px] mx-auto w-full gap-2 p-4 pt-0"
      >
        {children}
      </div>
    ),
  ),
};

gridComponents.List.displayName = "List";

const workspaceStatusToColor = (status: (typeof workspaceStatus)[number]) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "inactive":
      return "bg-red-500";
    case "archived":
      return "bg-yellow-500";
    default:
      status satisfies never;
      throw new Error(
        `workspace status - ${status} not intercepted by switch case`,
      );
  }
};

const filterSchema = object({
  value: string({ message: "Please enter a search term." }).min(1),
  filter: _enum(filters, {
    message: "You need to select a filter to continue",
  }),
});

type FilterSchema = _infer<typeof filterSchema>;

const WorkspaceList = ({
  workspaceList,
}: {
  workspaceList: (typeof workspaces.$inferSelect)[];
}) => {
  const { user } = useSessionProvider();
  const form = useForm<FilterSchema>({
    resolver: zodResolver(filterSchema),
  });

  // const [parent] = useAutoAnimate();

  const [appliedFilters, setAppliedFilters] = useState<FilterSchema[]>([]);

  const filteredWorkspaces = workspaceList.filter((workspace) => {
    // filter by all the applied filters
    return appliedFilters.every((filter) => {
      switch (filter.filter) {
        case "Name":
          return workspace.name
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        case "Type":
          return workspace.workspaceType
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        case "Status":
          return workspace.status
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        case "Tags":
          return workspace.tags
            ?.map((el) => el.toLowerCase())
            .includes(filter.value.toLowerCase());
        default:
          filter.filter satisfies never;
          throw new Error(
            `filter - ${filter.filter} not intercepted by switch case`,
          );
      }
    });
  });

  return (
    <div className="gap-y-6 flex flex-col pt-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) => {
            // check if the same filter already exists
            const isFilterExists = appliedFilters.find(
              (el) => el.filter === e.filter,
            );

            if (isFilterExists) {
              toast.error("Given filter already exists", {
                position: "top-center",
              });
            } else {
              setAppliedFilters([...appliedFilters, e]);
            }
          })}
          className="w-full flex flex-col max-w-[500px] mx-auto gap-y-4 p-4 rounded-md"
        >
          <div className="flex items-center gap-2 flex-wrap">
            {appliedFilters.map((filter) => (
              <div
                key={filter.filter}
                className="flex text-xs items-center px-4 py-2 rounded-md border"
              >
                <span className="lowercase">{filter.filter} includes </span>
                <Badge variant="secondary" className="ml-2">
                  {filter.value}
                </Badge>
                <button
                  onClick={() => {
                    setAppliedFilters(
                      appliedFilters.filter(
                        (el) => el.filter !== filter.filter,
                      ),
                    );
                  }}
                  className="ml-2"
                >
                  <Cross2Icon className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <div>
                <Input {...field} placeholder="e.g. active" />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="filter"
            render={({ field }) => (
              <div className="flex flex-row-reverse items-center gap-2 flex-wrap">
                {filters.map((el) => {
                  return (
                    <button
                      key={el}
                      type="button"
                      className="group focus-within:outline-none"
                    >
                      <Badge
                        onClick={() => {
                          field.onChange(el);
                        }}
                        variant="outline"
                        className={cn(
                          "group-focus-within:border-primary",
                          field.value === el &&
                            "border-primary fill-background",
                        )}
                      >
                        {el}
                      </Badge>
                    </button>
                  );
                })}
                <FormMessage />
              </div>
            )}
          />
          <Button className="self-end">Apply Filter</Button>
        </form>
      </Form>
      <div>
        {filteredWorkspaces.length === 0 && <Alert>No workspaces found</Alert>}
      </div>
      <VirtuosoGrid
        components={gridComponents}
        itemContent={(index, item) => {
          return (
            <DashboardRoute.Link
              params={{ workspaceId: Branded.WorkspaceId(item.id) }}
              key={index}
              className="w-full max-w-[500px]"
            >
              <button
                className={cn(
                  "flex flex-col w-full h-full items-start gap-4 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  "hover:bg-muted group",
                )}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{item.name}</div>
                      {/* {!item.read && ( */}
                      <span
                        className={cn(
                          "flex h-2 w-2 rounded-full",
                          workspaceStatusToColor(item.status),
                        )}
                      />
                      {/* )} */}
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs text-muted-foreground",
                        "group-hover:text-foreground",
                      )}
                    >
                      {item.createdAt &&
                        formatDistanceToNow(item.createdAt * 1000, {
                          addSuffix: true,
                        })}
                    </div>
                  </div>
                  {item.note && (
                    <div className="text-xs w-fit font-medium">{item.note}</div>
                  )}
                </div>
                <div className="line-clamp-2 w-fit text-xs text-muted-foreground">
                  {item.description.substring(0, 300)}
                </div>
                {item.tags?.length ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{item.workspaceType}</Badge>
                    {item.createdBy === user?.id && (
                      <Badge className="text-xs w-fit font-medium">Owner</Badge>
                    )}
                    {item.tags.map((label) => (
                      <Badge key={label} variant={"outline"}>
                        {label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </button>
            </DashboardRoute.Link>
          );
        }}
        data={filteredWorkspaces}
        style={{ height: 400 }}
      />
    </div>
  );
};

export default WorkspaceList;
