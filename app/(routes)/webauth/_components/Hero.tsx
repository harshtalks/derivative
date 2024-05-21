import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

import React from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Auth from "./two-factor/auth";
import { TFDialog } from "./two-factor/tf-dialog";

const Hero = () => {
  return (
    <section>
      <div className="px-8 pt-32 mx-auto md:px-12 lg:px-32 max-w-7xl">
        <div className="relative px-6 py-20 overflow-hidden bg-zinc-100 dark:bg-zinc-900 border isolate sm:rounded-3xl sm:px-10 sm:py-24 lg:py-24 xl:px-24">
          <div className="grid max-w-2xl grid-cols-1 mx-auto gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-y-0">
            <div className="lg:row-start-2 lg:max-w-md">
              <h1 className="text-3xl font-semibold tracking-tighter">
                Secure your identity with added layer of passkey authentication
              </h1>
              <p className="mt-4 text-base font-medium text-balance">
                This is an optional however recommended feature to secure your
                account. You can enable this feature from your account settings
                later on as well.
              </p>
            </div>
            <div className="p-2 overflow-hidden border rounded-3xl relative shadow-lg bg-gray-50 -z-20 min-w-full max-w-xl lg:row-span-4 lg:w-[64rem] lg:max-w-none">
              <div className="h-[400px]" />
            </div>
            <div className="py-12 flex items-center gap-2">
              <TFDialog />
              <div className="flex items-center justify-center">
                <Button variant="link">Skip for Now</Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      You can enable this feature from your account settings
                      later on as well.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
