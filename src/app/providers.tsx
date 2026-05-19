"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Session } from "next-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/get-query-client";
import StoreProvider from "@/StoreProvider";
import { ApolloWrapper } from "@/lib/apolloClient";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";


export default function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  /**
   * Scanner had issues with Chrome Mobile's native BarcodeDetector, so we force it to use the software polyfill instead.
   *  This is done by deleting the native BarcodeDetector from the window object if we detect Chrome Mobile. 
   */
  useEffect(() => {
    // 1. Check if we are in the browser and if BarcodeDetector exists
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      
      // 2. Target Chrome Mobile specifically via UserAgent
      const ua = navigator.userAgent;
      const isChromeMobile = /Chrome/i.test(ua) && /Android|iPhone|iPad/i.test(ua);
      
      if (isChromeMobile) {
        try {
          // 3. Delete it so the scanner library resorts to the software polyfill
          delete (window as any).BarcodeDetector;
          console.log("Chrome Mobile detected: Native BarcodeDetector disabled to force software polyfill.");
        } catch (e) {
          // Fallback if 'delete' fails due to strict mode protections
          (window as any).BarcodeDetector = undefined;
        }
      }
    }
  }, []); 

  return (
    <NextUIProvider>
      <StoreProvider>
        <ApolloWrapper>
          <QueryClientProvider client={queryClient}>
            <SpeedInsights />
            <SessionProvider session={session}>
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
            </SessionProvider>
          </QueryClientProvider>
        </ApolloWrapper>
      </StoreProvider>
    </NextUIProvider>
  );
}
