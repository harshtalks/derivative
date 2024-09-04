import type { Metadata } from "next";
import "./globals.css";
import Header from "./_components/header";

import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme.provider";
import { Toaster } from "sonner";
import QueryProvider from "@/trpc/provider";
import { validateRequestCached } from "@/auth/validate-request";
import { SessionProvider } from "@/providers/session.provider";

const fontSans = FontSans({
  subsets: ["latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await validateRequestCached();

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <SessionProvider sessionValue={{ session: session, user: user }}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
