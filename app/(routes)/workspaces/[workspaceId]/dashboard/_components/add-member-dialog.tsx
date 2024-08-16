import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { memberRoles, users, permissions } from "@/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldPlus,
  AArrowDown as AnyIcon,
  PencilRuler,
  Eraser,
  UserPlus,
  Loader,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { object, enum as _enum, array, infer as _infer } from "zod";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/cradenza";
import { Switch } from "@/components/ui/switch";
import clientApiTrpc from "@/trpc/client";
import DashboardRoute from "../route.info";
import { toast } from "sonner";

type PermissionsUIList = {
  value: (typeof permissions)[number];
  icon: typeof AnyIcon;
  label: string;
  description: string;
};

const permissionsUIList: PermissionsUIList[] = [
  {
    value: "admin",
    icon: ShieldPlus,
    label: "Admin",
    description: "Can do anything in the workspace.",
  },
  {
    value: "read",
    icon: PencilRuler,
    label: "Read",
    description: "Can read everything in the workspace.",
  },
  {
    value: "delete",
    icon: Eraser,
    label: "Write",
    description: "Can do the changes in the workspace templates",
  },
  {
    value: "member_controls",
    icon: UserPlus,
    label: "Member Controls",
    description: "Can add and remove members from the workspace.",
  },
];

const addMemberSchema = object({
  role: _enum(memberRoles),
  permisions: array(_enum(permissions)).min(1, {
    message: "Please select at least one permission.",
  }),
});

const AddMemberToWorkspace = ({
  user,
}: {
  user: typeof users.$inferSelect;
}) => {
  const form = useForm<_infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      permisions: ["read"],
      role: "dev",
    },
  });
  const utils = clientApiTrpc.useUtils();
  const mutation = clientApiTrpc.member.add.useMutation({
    onSuccess: () => {
      form.reset();
      utils.user.all.invalidate();
      utils.member.all.invalidate();
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const { workspaceId } = DashboardRoute.useParams();

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button variant="secondary" size="sm">
          Add
        </Button>
      </CredenzaTrigger>

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add new member</CredenzaTitle>
          <CredenzaDescription>
            Please choose the level of permissions and role for this member.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="flex pb-4 items-center space-x-4">
            <Avatar>
              {user.avatar && <AvatarImage src={user.avatar} />}
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((el) => el[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                toast.promise(
                  mutation.mutateAsync({
                    isCreator: false,
                    permissions: data.permisions,
                    role: data.role,
                    userId: user.id,
                    workspaceId,
                  }),
                  {
                    loading: "Adding member...",
                    success: "Member added successfully.",
                    error: (err) => err.message,
                  },
                );
              })}
            >
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {memberRoles.map((el) => (
                          <SelectItem
                            className="capitalize hover:bg-gray-50 cursor-pointer"
                            key={el}
                            value={el}
                          >
                            {el}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The role of the member in the workspace. We are going to
                      add more roles in the future.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permisions"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Member Permissions</FormLabel>

                    <div className="space-y-4">
                      {permissionsUIList.map((permission) => {
                        return (
                          <label
                            className="flex cursor-pointer hover:bg-gray-50 p-2 rounded-md items-center justify-between"
                            key={permission.value}
                          >
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold">
                                {permission.label}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {permission.description}
                              </span>
                            </div>
                            <Switch
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...field.value,
                                    permission.value,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (el) => el !== permission.value,
                                    ),
                                  );
                                }
                              }}
                              checked={field.value.includes(permission.value)}
                            />
                          </label>
                        );
                      })}
                    </div>

                    <FormDescription>
                      The permissions of the member in the workspace. We are
                      going to add more permissions in the future.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CredenzaFooter>
                <div className="mt-4">
                  <Button
                    disabled={mutation.isPending}
                    type="submit"
                    className="inline-flex gap-2"
                  >
                    {mutation.isPending && (
                      <Loader className="shrink-0 size-4 animate-spin" />
                    )}
                    {mutation.isPending ? "Adding member..." : "Add member"}
                  </Button>
                </div>
              </CredenzaFooter>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};

export default AddMemberToWorkspace;
