import Link from "next/link";

import PlateEditor from "@/components/plate-editor";
import Header from "@/app/_components/header";
import Container from "@/app/_components/container";
import { buttonVariants } from "@/components/ui/button";

export default function IndexPage() {
  return (
    <main>
      <Header withoutCenterStuff />
      <Container>
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-[150px]">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              PDF Generation
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Here we generate a PDF from the content you write in the editor.
              This is a Next.js app with a custom Slate plugin and a custom
              Next.js API route. The PDF is generated on the server using
              Puppeteer.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href={"/"}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants()}
            >
              Documentation
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href={"/"}
              className={buttonVariants({ variant: "link" })}
            >
              GitHub
            </Link>
          </div>

          <div className="max-w-[1336px] bg-white border rounded-lg ">
            <PlateEditor />
          </div>
        </section>
      </Container>
    </main>
  );
}
