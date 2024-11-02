import Header from "@/app/_components/header";
import { Input } from "@/components/ui/input";
import React from "react";
import { AddWorkspace } from "./_components/add-workspace";
import AuthInterceptor from "@/auth/authIntercepter";
import AddNewWorkspaceRoute from "./route.info";

const NewWorkspace = async () => {
  await new AuthInterceptor(AddNewWorkspaceRoute.navigate({}))
    .withRedirect()
    .withTwoFactor()
    .check();

  return (
    <main>
      <Header withoutCenterStuff />
      <div className="relative overflow-hidden">
        <div className="container py-24 lg:py-32">
          <div className="text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Add new workspace
            </h1>
            <p className="mt-3 text-sm max-w-lg mx-auto text-muted-foreground">
              Workspaces are our way of organizing your projects. Create as many
              as you need to keep your work organized and separated. Ideally
              each workspace will have a different team or project.
            </p>
          </div>
          <div className="py-12">
            <AddWorkspace />
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewWorkspace;
