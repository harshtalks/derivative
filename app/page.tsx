import Image from "next/image";
import Hero from "./_components/hero";
import Header from "./_components/header";

export default function Home({
  searchParams,
}: {
  searchParams: { x: string };
}) {
  return (
    <main>
      <Header />
      <Hero />
    </main>
  );
}
