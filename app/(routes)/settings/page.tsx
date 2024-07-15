import Link from "next/link";
import { Menu, Package2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import WorkspaceRouteInfo from "../workspaces/route.info";
import HomePageRoute from "@/app/route.info";
import { HomeIcon } from "@radix-ui/react-icons";
import { UserNav } from "@/app/_components/user";
import { ThemeToggle } from "@/app/_components/theme-toggle";
import TwoFactorStatus from "./components/two-factor-status";
import Session from "./components/sessions";
import AuthInterceptor from "@/auth/authIntercepter";
import SettingsRouteInfo from "./route.info";

export default async function Dashboard() {
  await new AuthInterceptor(SettingsRouteInfo({})).withTwoFactor().execute();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <HomePageRoute.Link
            params={{}}
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <HomeIcon className="h-6 w-6" />
            <span className="sr-only">Derivative</span>
          </HomePageRoute.Link>
          <WorkspaceRouteInfo.Link
            params={{}}
            className="text-muted-foreground hover:text-foreground"
          >
            Workspaces
          </WorkspaceRouteInfo.Link>

          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Orders
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Customers
          </Link>
          <Link
            href="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Settings
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <WorkspaceRouteInfo.Link
                params={{}}
                className="text-muted-foreground hover:text-foreground"
              >
                Workspaces
              </WorkspaceRouteInfo.Link>

              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link href="#" className="hover:text-foreground">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto flex gap-2 items-center">
          <UserNav />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground"
            x-chunk="dashboard-04-chunk-0"
          >
            <Link href="#" className="font-semibold text-primary">
              General
            </Link>
            <Link href="#">Security</Link>
            <Link href="#">Integrations</Link>
            <Link href="#">Support</Link>
            <Link href="#">Organizations</Link>
            <Link href="#">Advanced</Link>
          </nav>
          <div className="grid gap-6">
            <TwoFactorStatus />
            <Session />
          </div>
        </div>
      </main>
    </div>
  );
}
