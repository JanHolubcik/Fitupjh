"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";

import { SpeedInsights } from "@vercel/speed-insights/next";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/get-query-client";
import StoreProvider from "@/StoreProvider";

import { ToastContainer } from "react-toastify";
import React from "react";


export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const router = useRouter();

  return (
    <HeroUIProvider navigate={(path, options) => router.push(path, options)}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <StoreProvider>
          <QueryClientProvider client={queryClient}>
            <SpeedInsights />

            {children}
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </QueryClientProvider>
        </StoreProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
