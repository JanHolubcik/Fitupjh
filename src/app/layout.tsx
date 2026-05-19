import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import NavbarComponent from "@/components/Navbar/NavbarComponent";
import { authOptions } from "@/lib/auth";
import Providers from "./providers";
import { getServerSession } from "next-auth";

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
      <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Destroys native BarcodeDetector on window and globalThis completely
                  Object.defineProperty(window, 'BarcodeDetector', {
                    value: undefined,
                    writable: false,
                    configurable: false
                  });
                  Object.defineProperty(globalThis, 'BarcodeDetector', {
                    value: undefined,
                    writable: false,
                    configurable: false
                  });
                  console.log("Native BarcodeDetector disabled. Software polyfill forced.");
                } catch (e) {
                  console.error("Failed to force polyfill:", e);
                }
              })();
            `,
          }}
        />
      <body className={inter.className}>
        <Providers session={session}>
          <NavbarComponent />

          {children}
        </Providers>
      </body>
    </html>
  );
}
