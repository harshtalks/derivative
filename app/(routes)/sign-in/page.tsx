import GithubAuth from "@/app/api/auth/github/route.info";
import HomePageRoute from "@/app/route.info";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { HomeIcon } from "lucide-react";
import React from "react";
import AuthInterceptor from "@/auth/authIntercepter";
import SignInPage from "./route.info";
import Header from "@/app/_components/header";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | undefined | string[];
  };
}) => {
  await new AuthInterceptor(SignInPage.navigate({})).check();

  return (
    <section>
      <div className="relative z-40 h-full w-full bg-background">
        <div className="dark:hidden -z-10 absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <div className="hidden -z-10 dark:block absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <Header />
        <div className="grid grid-rows-[1fr_auto]">
          <div className="px-8 py-48 mx-auto md:px-12 lg:px-32 max-w-7xl">
            <div className="flex flex-col text-center">
              <h1>
                <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl lg:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                  start building with derivative
                </span>
              </h1>
            </div>
            <div className="mt-8 gap-4 w-full flex flex-col items-center justify-center">
              <GithubAuth.Link
                params={{}}
                searchParams={{
                  redirectUrl: searchParams.redirectUrl?.toString(),
                }}
              >
                <Button
                  aria-label="Sign in with Github"
                  className="inline-flex gap-2"
                  variant={"gooeyLeft"}
                  size="lg"
                >
                  <GitHubLogoIcon className="size-5 shrink-0 " />
                  <span>Sign in with Github</span>
                </Button>
              </GithubAuth.Link>
              <HomePageRoute.Link params={{}}>
                <Button variant="ghost">
                  <HomeIcon />
                </Button>
              </HomePageRoute.Link>
            </div>
          </div>
          <div className="text-center opacity-50 text-xs max-w-xl mx-auto leading-relaxed px-4">
            <p>
              Derivative do not access to your any github repositories and
              personal content other than your email account, username, full
              name, and avatar. Derivative allows you to delete your account and
              all the data associated with it. Exceptions are the workspaces.
              Workspaces are not deleted when you delete your account. However
              you can delete the workspaces manually before deleting your
              account. You can secure your account with passkey powered 2FA.
              Note that it may be subjected to a change of pricing plans in the
              future.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
