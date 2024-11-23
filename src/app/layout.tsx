import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";

import NavbarComponent from "@/components/Navbar/NavbarComponent";

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
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <NavbarComponent />

          {children}
        </Providers>
      </body>
    </html>
  );
}
