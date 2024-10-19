"use client";
import { validateRequestCached } from "@/auth/validate-request";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import client from "@/trpc/client";
import { User2, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import SignInPage from "../(routes)/sign-in/route.info";
import SettingsRouteInfo from "../(routes)/settings/route.info";
import AddNewWorkspaceRoute from "../(routes)/workspaces/add-new-workspace/route.info";

export function UserNav() {
  const { data: user } = client.user.get.useQuery();
  const settingsPageRouter = SettingsRouteInfo.useRouter(useRouter);
  const signInPageRouter = SignInPage.useRouter(useRouter);
  const addnewWorkspaceRouter = AddNewWorkspaceRoute.useRouter(useRouter);

  const { mutate } = client.user.logout.useMutation({
    onSettled: () => {
      signInPageRouter.push({
        params: {},
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8  rounded-full">
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || ""} alt={user.username} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      {user ? (
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                settingsPageRouter.push({
                  params: {},
                })
              }
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                addnewWorkspaceRouter.push({
                  params: {},
                });
              }}
            >
              New Workspace
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              mutate();
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <></>
      )}
    </DropdownMenu>
  );
}
