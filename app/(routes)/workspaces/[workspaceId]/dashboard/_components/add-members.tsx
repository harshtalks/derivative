"use client";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import {
  Credenza,
  CredenzaBody,
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
          <CardDescription>
            Anyone with the link can join this workspace. Account Required.
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
          <Button>Add Members</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default AddMembers;
