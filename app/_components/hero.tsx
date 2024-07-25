import { Button } from "@/components/ui/button";
import React from "react";
import SignInPage from "../(routes)/sign-in/route.info";
import Container from "./container";
import Frame from "./frame";
import { validateRequestCached } from "@/auth/validate-request";
import WebAuthRoute from "../(routes)/webauth/route.info";
import Meteors from "./meteor";
import AnimatedGradientText from "./animated-badge";
import clsx from "clsx";
import { RetroGrid } from "./retro";

const Hero = async () => {
  const { session } = await validateRequestCached();

  return (
    <div
      className={clsx(
        "absolute inset-0 h-full w-full items-center dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]",
        "bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"
      )}
    >
      <RetroGrid />
      <div
        aria-hidden
        className="opacity-0 dark:opacity-25 absolute [background-image:radial-gradient(theme(colors.gray.500),transparent_50%)] top-0 w-[1000px] z-10 h-[800px] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <Container>
        <div className="relative pt-32 sm:pt-44 ml-auto">
          <Meteors />
          <div className="lg:w-2/3 text-center mx-auto">
            <AnimatedGradientText className="mb-4">
              Announcing Invoicing APIs {"->"}
            </AnimatedGradientText>
            <h1 className="text-gray-900 dark:text-white font-bold text-4xl sm:text-5xl md:text-6xl">
              Fastest Invoice Experience Ever Made
            </h1>
            <p className="max-w-xl mx-auto mt-8 text-gray-700 dark:text-gray-300">
              Create and send professional invoices in minutes. Get paid faster
              with our simple and secure invoicing software. Create invoices
              that are on-brand and professional.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-y-4 gap-x-6">
              <Frame>
                {session ? (
                  <WebAuthRoute.Link params={{}}>
                    <Button size="sm" variant="gooeyRight">
                      Get Started Now
                    </Button>
                  </WebAuthRoute.Link>
                ) : (
                  <SignInPage.Link params={{}}>
                    <Button size="sm" variant="gooeyRight">
                      Join Derivative Now
                    </Button>
                  </SignInPage.Link>
                )}
              </Frame>
            </div>{" "}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
