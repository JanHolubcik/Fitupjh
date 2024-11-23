"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

import { SpeedInsights } from "@vercel/speed-insights/next";
import YourIntakeProvider from "@/hooks/YourIntakeProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <SpeedInsights />
      {children}
    </NextUIProvider>
  );
}
