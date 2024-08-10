import AuthInterceptor from "@/auth/authIntercepter";
import WorkspaceInvitationRoute from "./route.info";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import InviteFlow from "./_components/invite-flow";
import { brandedCurrentWorkspace } from "../../route.info";

const Page = async ({
  searchParams,
}: {
  searchParams: { invite?: string };
}) => {
  await new AuthInterceptor(
    WorkspaceInvitationRoute(
      { workspaceId: brandedCurrentWorkspace() },
      { search: { invite: searchParams.invite } },
    ),
  )
    .withRedirect()
    .withTwoFactor()
    .check();

  return (
    <div>
      <div className="absolute dark:hidden inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className="absolute hidden dark:block top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="container py-24 lg:py-32">
        {/* Title */}
        <div className="mt-5 max-w-2xl text-center mx-auto">
          <h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl lg:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            Derivative
          </h1>
        </div>
        {/* End Title */}
        <div className="my-10 max-w-xl text-center mx-auto">
          <p className="text-sm leading-relaxed text-muted-foreground">
            We are excited to have you join us. Please wait while we set up your
            membership in this workspace. You will be prompted for a redirect to
            the workspace shortly.
          </p>
        </div>
        {/* Buttons */}
        <div className="mt-5 flex justify-center items-center gap-x-1 sm:gap-x-3">
          <span className="text-xs md:text-sm text-muted-foreground">
            Derivative Version:
          </span>
          <span className="text-xs md:text-sm font-medium">0.1 Alpha</span>
          <svg
            className="h-5 w-5 text-muted-foreground"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round" />
          </svg>
          <a
            className="inline-flex text-xs md:text-sm items-center gap-x-1 decoration-2 hover:underline font-medium"
            href="#"
          >
            Terms and Conditions
            <ChevronRightIcon className="flex-shrink-0 w-4 h-4" />
          </a>
        </div>
        <InviteFlow />
        {/* End Buttons */}
      </div>
    </div>
  );
};

export default Page;
