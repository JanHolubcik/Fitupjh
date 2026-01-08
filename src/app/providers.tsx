"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Session } from "next-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/get-query-client";
import StoreProvider from "@/StoreProvider";
import { ApolloWrapper } from "@/lib/apolloClient";

export default function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <NextUIProvider>
      <StoreProvider>
        <ApolloWrapper>
          <QueryClientProvider client={queryClient}>
            <SpeedInsights />
            <SessionProvider session={session}>{children}</SessionProvider>
          </QueryClientProvider>
        </ApolloWrapper>
      </StoreProvider>
    </NextUIProvider>
  );
}
