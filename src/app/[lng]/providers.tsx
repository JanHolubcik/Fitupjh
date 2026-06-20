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
import { useTheme } from "next-themes";

function AppToastContainer() {
  const { theme } = useTheme();
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
}

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
            <AppToastContainer />
          </QueryClientProvider>
        </StoreProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
