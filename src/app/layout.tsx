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
      <body className={inter.className}>
        <Providers session={session}>
          <NavbarComponent />

          {children}
        </Providers>
      </body>
    </html>
  );
}
