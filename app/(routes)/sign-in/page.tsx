import GithubAuth from "@/app/api/auth/github/route.info";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import React from "react";

const Page = () => {
  return (
    <section>
      <div className="px-8 py-48  mx-auto md:px-12 lg:px-32 max-w-7xl">
        <div className="max-w-md mx-auto md:max-w-sm md:w-96">
          <div className="flex flex-col text-center">
            <h1 className="text-3xl font-semibold tracking-tighter ">
              Collaborating on single-page projects,
              <span className="text-gray-600">from any location</span>
            </h1>
            <p className="mt-4 text-base font-medium ">
              A rapid approach to collaborate in staging and provisional
              settings.
            </p>
          </div>
          <div className="mt-8">
            <GithubAuth.Link params={{}}>
              <Button
                className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium duration-200 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                aria-label="Sign in with Google"
              >
                <GitHubLogoIcon className="size-6" />
                <span>Sign in with Google</span>
              </Button>
            </GithubAuth.Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
