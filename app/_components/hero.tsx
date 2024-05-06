import { Button } from "@/components/ui/button";
import React from "react";
import SignInPage from "../(routes)/sign-in/route.info";
import { cn } from "@/lib/utils";
import Container from "./container";
import Frame from "./frame";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { createEndPoint } from "safe-fetchttp";

const Hero = () => {
  return (
    <div className="relative overflow-hidden" id="home">
      <div
        aria-hidden
        className="opacity-0 dark:opacity-25 absolute [background-image:radial-gradient(theme(colors.gray.500),transparent_50%)] top-0 w-[1000px] z-10 h-[800px] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <Container>
        <div className="relative pt-32 sm:pt-44 ml-auto">
          <div className="lg:w-2/3 text-center mx-auto">
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
                <SignInPage.Link params={{}}>
                  <Button size="sm" variant="gooeyRight">
                    Start Building Invoices
                  </Button>
                </SignInPage.Link>
              </Frame>
            </div>
            <div className="py-8 mt-16 gap-4 border-y dark:border-gray-800 flex-wrap flex justify-between">
              <div className="text-left">
                <svg
                  className="size-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                >
                  <g fill="currentColor">
                    <path d="M208 40v168h-56V40Z" opacity="0.2" />
                    <path d="M224 200h-8V40a8 8 0 0 0-8-8h-56a8 8 0 0 0-8 8v40H96a8 8 0 0 0-8 8v40H48a8 8 0 0 0-8 8v64h-8a8 8 0 0 0 0 16h192a8 8 0 0 0 0-16M160 48h40v152h-40Zm-56 48h40v104h-40Zm-48 48h32v56H56Z" />
                  </g>
                </svg>
                <h2 className="my-2 text-base font-semibold text-gray-700 dark:text-white">
                  Project Insights
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Some text here
                </p>
              </div>
              <div className="text-left">
                <svg
                  className="size-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                >
                  <g fill="currentColor">
                    <path d="m224 80l-96 56l-96-56l96-56Z" opacity="0.2" />
                    <path d="M230.91 172a8 8 0 0 1-2.91 10.91l-96 56a8 8 0 0 1-8.06 0l-96-56A8 8 0 0 1 36 169.09l92 53.65l92-53.65a8 8 0 0 1 10.91 2.91M220 121.09l-92 53.65l-92-53.65a8 8 0 0 0-8 13.82l96 56a8 8 0 0 0 8.06 0l96-56a8 8 0 1 0-8.06-13.82M24 80a8 8 0 0 1 4-6.91l96-56a8 8 0 0 1 8.06 0l96 56a8 8 0 0 1 0 13.82l-96 56a8 8 0 0 1-8.06 0l-96-56A8 8 0 0 1 24 80m23.88 0L128 126.74L208.12 80L128 33.26Z" />
                  </g>
                </svg>
                <h2 className="my-2 text-base font-semibold text-gray-700 dark:text-white">
                  Easy Integration
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Some text here
                </p>
              </div>
              <div className="text-left">
                <svg
                  className="size-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                >
                  <g fill="currentColor">
                    <path
                      d="M232 94c0 66-104 122-104 122S24 160 24 94a54 54 0 0 1 54-54c22.59 0 41.94 12.31 50 32c8.06-19.69 27.41-32 50-32a54 54 0 0 1 54 54"
                      opacity="0.2"
                    />
                    <path d="M178 32c-20.65 0-38.73 8.88-50 23.89C116.73 40.88 98.65 32 78 32a62.07 62.07 0 0 0-62 62c0 70 103.79 126.66 108.21 129a8 8 0 0 0 7.58 0C136.21 220.66 240 164 240 94a62.07 62.07 0 0 0-62-62m-50 174.8C109.74 196.16 32 147.69 32 94a46.06 46.06 0 0 1 46-46c19.45 0 35.78 10.36 42.6 27a8 8 0 0 0 14.8 0c6.82-16.67 23.15-27 42.6-27a46.06 46.06 0 0 1 46 46c0 53.61-77.76 102.15-96 112.8" />
                  </g>
                </svg>
                <h2 className="my-2 text-base font-semibold text-gray-700 dark:text-white">
                  The most loved
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Some text here
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
