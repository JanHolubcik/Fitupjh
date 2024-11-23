"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Session } from "next-auth";

export default function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <NextUIProvider>
      <SpeedInsights />
      <SessionProvider session={session}>{children}</SessionProvider>
    </NextUIProvider>
  );
}
