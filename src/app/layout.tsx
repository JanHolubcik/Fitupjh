import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'reflect-metadata';


import NavbarComponent from "@/components/Navbar/NavbarComponent";
import { authOptions } from "@/lib/auth";
import Providers from "./providers";
import { getServerSession } from "next-auth";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitup",
  description: "Calculate your calories",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className="dark">
 <head>
        <Script
          id="barcode-detector-fix"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `
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
          `}}
        />
      </head>
      <body className={inter.className}>
        <Providers session={session}>
          <NavbarComponent />

          {children}
        </Providers>
      </body>
    </html>
  );
}
