import React from "react";
import { ThemeToggle } from "./theme-toggle";
import Logo from "./logo";
import Container from "./container";
import Frame from "./frame";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user";

const links = [
  {
    to: "/#features",
    label: "Product",
  },
  {
    to: "/#features",
    label: "Features",
  },
  {
    to: "/#solution",
    label: "Solution",
  },
  {
    to: "/#reviews",
    label: "Reviews",
  },
];

const Header = ({ withoutCenterStuff }: { withoutCenterStuff?: boolean }) => {
  return (
    <header>
      <nav className="absolute z-50 w-full lg:bg-transparent dark:lg:bg-transparent">
        <Container>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 md:gap-0 md:py-4 lg:py-8">
            <div className="relative z-20 flex w-full items-center justify-between md:px-0 lg:w-max">
              <Logo />

              <div className="relative flex max-h-10 items-center lg:hidden">
                <button
                  aria-label="humburger"
                  id="hamburger"
                  className="relative -mr-6 p-6"
                >
                  <div
                    aria-hidden="true"
                    id="line"
                    className="m-auto h-0.5 w-5 rounded bg-sky-900 transition duration-300 dark:bg-gray-300"
                  ></div>
                  <div
                    aria-hidden="true"
                    id="line2"
                    className="m-auto mt-2 h-0.5 w-5 rounded bg-sky-900 transition duration-300 dark:bg-gray-300"
                  ></div>
                </button>
              </div>
            </div>
            {withoutCenterStuff ? null : (
              <div
                id="navLayer"
                aria-hidden="true"
                className="fixed inset-0 z-10 h-screen w-screen origin-bottom scale-y-0 bg-white/70 backdrop-blur-2xl transition duration-500 dark:bg-gray-900/70 lg:hidden"
              ></div>
            )}

            <div
              id="navlinks"
              className="hidden flex-wrap lg:flex gap-6 items-center w-full lg:w-fit"
            >
              {withoutCenterStuff ? null : (
                <div className="lg:fixed lg:inset-x-0 lg:size-fit lg:m-auto">
                  <Frame>
                    <div className="relative w-full text-gray-600 dark:text-gray-300">
                      <ul className="flex flex-col gap-6 tracking-wide lg:flex-row lg:gap-0 lg:text-sm">
                        {links.map((link) => (
                          <li key={link.label}>
                            <a
                              href={link.to}
                              className="px-2 py-1 hover:bg-gray-950/5 hover:text-gray-950 rounded-[--btn-border-radius] block transition dark:hover:text-white md:px-4 dark:hover:bg-white/5"
                            >
                              <span>{link.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Frame>
                </div>
              )}

              <div className="w-full my-6 border-t dark:border-[--ui-dark-border-color] pt-6 lg:mt-0 flex gap-2 lg:my-0 lg:border-none lg:pt-0">
                {/* <Button className="rounded-full">Get Started</Button> */}
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
};

export default Header;
