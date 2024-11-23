import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import NavbarComponent from "@/components/Navbar/NavbarComponent";
import { getSession } from "next-auth/react";
import Providers from "./providers";

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
  const session = await getSession();
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers session={session}>
          <NavbarComponent />

          {children}
        </Providers>
      </body>
    </html>
  );
}
