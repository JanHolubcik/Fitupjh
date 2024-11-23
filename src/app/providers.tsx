"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

import { SpeedInsights } from "@vercel/speed-insights/next";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <SpeedInsights />
      <SessionProvider>{children}</SessionProvider>
    </NextUIProvider>
  );
}
