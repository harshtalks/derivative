"use client";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTrigger,
} from "@/components/ui/cradenza";

import { Separator } from "@/components/ui/separator";
import { UserPlus, X } from "lucide-react";
import InviteMembers from "./invite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersList from "./users-list";
import MembersList from "./members-list";
import { INVITE_COUNT, WEEKS_TO_EXPIRE } from "@/auth/invite";

const AddMembers = () => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <UserPlus className="h-3.5 w-3.5" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            Add Members
          </span>
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CardTitle>Invite Members</CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            Anyone with the link can join this workspace. Account Required. Note
            that by default every member will be joined with{" "}
            <strong>developer</strong> role. In future, we aim to support unique
            invite links for different roles. Each invite link is valid for{" "}
            <strong>{WEEKS_TO_EXPIRE} weeks</strong> with limit of{" "}
            <strong>{INVITE_COUNT} invites</strong> per link.
          </CardDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <InviteMembers />
          <Separator className="my-4" />
          <Tabs defaultValue="members">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="members">People with Access</TabsTrigger>
              <TabsTrigger value="new-users">Add new people</TabsTrigger>
            </TabsList>
            <TabsContent className="pt-4" value="new-users">
              <UsersList />
            </TabsContent>{" "}
            <TabsContent className="pt-4" value="members">
              <MembersList />
            </TabsContent>
          </Tabs>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Close Modal</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default AddMembers;
