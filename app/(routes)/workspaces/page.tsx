import { ThemeToggle } from "@/app/_components/theme-toggle";
import { UserNav } from "@/app/_components/user";
import { validateRequestCached } from "@/auth/validate-request";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import api from "@/trpc/server";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import AddNewWorkspaceRoute from "./add-new-workspace/route.info";
import WorkspaceRouteInfo from "./route.info";
import AuthInterceptor from "@/auth/authIntercepter";
import Workspaces from "./_components/workspaces";

export default async function Page() {
  await new AuthInterceptor(WorkspaceRouteInfo.navigate({}))
    .withTwoFactor()
    .withRedirect()
    .check();

  const user = await api.user.get();
  return (
    <>
      {/* Hero */}
      <div>
        <div className="container py-24 lg:py-32">
          {/* Announcement Banner */}
          <div className="flex items-center gap-2 justify-center">
            <a
              className="inline-flex hover:shadow-xl items-center gap-x-2 border text-sm p-1 ps-3 rounded-full transition"
              href="#"
            >
              Invoice API Pricing
              <span className="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-muted-foreground/15 font-semibold text-sm">
                <svg
                  className="flex-shrink-0 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </a>
            <ThemeToggle />
            <UserNav />
          </div>
          {/* End Announcement Banner */}
          {/* Title */}
          <div className="mt-5 max-w-2xl text-center mx-auto">
            <h1 className="scroll-m-20 capitalize text-4xl font-extrabold tracking-tight lg:text-5xl">
              Welcome, {user?.username.toLowerCase()}
            </h1>
          </div>
          {/* End Title */}
          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-base text-muted-foreground">
              Workspaces are our way of organizing your projects. Create as many
              as you need to keep your work organized and separated. Ideally
              each workspace will have a different team or project.
            </p>
          </div>

          <Workspaces />
          <div className="mt-8 gap-3 flex justify-center">
            <AddNewWorkspaceRoute.Link params={{}}>
              <Button variant="ringHover" size={"lg"}>
                Create a Workspace
              </Button>
            </AddNewWorkspaceRoute.Link>
          </div>
        </div>
      </div>
    </>
  );
}
