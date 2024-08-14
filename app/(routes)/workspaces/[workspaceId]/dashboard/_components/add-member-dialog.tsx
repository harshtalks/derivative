import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { object, enum as _enum, array, infer as _infer } from "zod";

const addMemberSchema = object({
  role: _enum(memberRoles),
  permisions: array(_enum(permissions)),
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new member</DialogTitle>
          <DialogDescription>
            Please choose the level of permissions and role for this member.
          </DialogDescription>
        </DialogHeader>
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
          <form onSubmit={form.handleSubmit(() => {})}>
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
                        <SelectItem className="capitalize" key={el} value={el}>
                          {el}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The role of the member in the workspace. We are going to add
                    more roles in the future.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberToWorkspace;
