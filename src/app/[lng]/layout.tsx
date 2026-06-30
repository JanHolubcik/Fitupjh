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
import enCommon from "@/i18n/locales/en/common.json";
import skCommon from "@/i18n/locales/sk/common.json";

const inter = Inter({ subsets: ["latin"] });

type GenerateMetadataProps = {
  params: Promise<{ lng: string }>;
};

export const generateMetadata = async ({
  params,
}: GenerateMetadataProps): Promise<Metadata> => {
  const { lng } = await params;
  const common = lng === "sk" ? skCommon : enCommon;

  const baseUrl = process.env.BETTER_AUTH_URL || "https://fitupjh.vercel.app";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: common.metadata.title,
      template: "%s | Fitup",
    },
    description: common.metadata.description,
    keywords: [
      "calorie tracker",
      "fitness tracker",
      "macro tracker",
      "gemini ai",
      "calorie counter",
      "activity tracker",
      "nutrition analysis",
      "barcode scanner",
      "sledovanie kalorii",
      "pocitadlo kalorii",
      "kaloricke tabulky",
    ],
    authors: [{ name: "Jan Holubcik" }],
    creator: "Jan Holubcik",
    openGraph: {
      type: "website",
      locale: lng === "sk" ? "sk_SK" : "en_US",
      url: `${baseUrl}/${lng}`,
      siteName: "Fitup",
      title: common.metadata.title,
      description: common.metadata.description,
      images: [
        {
          url: "/greeting_owl.png",
          width: 1200,
          height: 630,
          alt: "Fitup Calorie Tracker",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: common.metadata.title,
      description: common.metadata.description,
      images: ["/greeting_owl.png"],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/icon.png",
    },
  };
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
        className={`${inter.className} pb-4 bg-background text-foreground antialiased`}
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
