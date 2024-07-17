import Link from "next/link";

import PlateEditor from "@/components/plate-editor";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { TooltipProvider } from "@/components/plate-ui/tooltip";

export default function IndexPage() {
  return (
    <TooltipProvider
      disableHoverableContent
      delayDuration={500}
      skipDelayDuration={0}
    >
      <Header withoutCenterStuff />

      <Container>
        <section className="!pt-[100px] grid items-center gap-6 pb-8 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Plate Playground.
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Plugin system & primitive component library.{" "}
              <br className="hidden sm:inline" />
              CLI for styled components. Customizable. Open Source. And Next.js
              14 Ready.
            </p>
          </div>

          <div className="max-w-[1336px] border bg-background rounded-lg">
            <PlateEditor />
          </div>
        </section>
      </Container>
    </TooltipProvider>
  );
}
