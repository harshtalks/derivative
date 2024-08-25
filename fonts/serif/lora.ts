import { Lora as LoraFont } from "next/font/google";

export const lora = LoraFont({
  variable: "--lora-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
