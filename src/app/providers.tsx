"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { Session } from "next-auth";

export function Providers(
  { children }: { children: React.ReactNode },
  session: Session | null | undefined
) {
  return (
    <NextUIProvider>
      <SessionProvider session={session}>{children}</SessionProvider>
    </NextUIProvider>
  );
}
