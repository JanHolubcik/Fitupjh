"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

import { SpeedInsights } from "@vercel/speed-insights/next";
import YourIntakeProvider from "@/hooks/YourIntakeProvider";
import { Session } from "next-auth";
export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <NextUIProvider>
      <SpeedInsights />
      <SessionProvider session={session}>{children}</SessionProvider>
    </NextUIProvider>
  );
}
