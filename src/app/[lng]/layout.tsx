import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "reflect-metadata";
import React from "react";

import {
  getT,
  getResources,
  initServerI18next,
  generateI18nStaticParams,
} from "next-i18next/server";
import { I18nProvider } from "next-i18next/client";

import NavbarComponent from "@/components/Navbar/NavbarComponent";
import Providers from "./providers";
import Script from "next/script";
import i18nConfig from "@/i18n.config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitup",
  description: "Calculate your calories",
};

initServerI18next(i18nConfig);

export async function generateStaticParams() {
  return generateI18nStaticParams();
}

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}>) {
  const { lng } = await params;
  const { i18n } = await getT();
  const resources = getResources(i18n);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  initServerI18next;

  return (
    <html lang={lng} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <Script
          id="barcode-detector-fix"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              var ua = navigator.userAgent;
              var isChromeMobile = /Chrome/i.test(ua) && /Android|iPhone|iPad/i.test(ua) && !/Edg|OPR/i.test(ua);
              if (isChromeMobile) {
                try {
                  Object.defineProperty(window, 'BarcodeDetector', {
                    get: function() { return undefined; },
                    configurable: true
                  });
                } catch(e) {}
                delete window.BarcodeDetector;
              }
            })();
          `,
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-background text-foreground antialiased`}
      >
        <Providers>
          <I18nProvider language={lng} resources={resources}>
            <NavbarComponent data={session} />

            <main className="pb-10 sm:pb-0">{children}</main>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
