"use client";

import { NextUIProvider } from "@nextui-org/react";

import { SpeedInsights } from "@vercel/speed-insights/next";
import YourIntakeProvider from "@/hooks/YourIntakeProvider";
import { Session } from "next-auth";
import { SessionProvider } from "./SessionProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <SessionProvider>
        <SpeedInsights />
        {children}
      </SessionProvider>
    </NextUIProvider>
  );
}
