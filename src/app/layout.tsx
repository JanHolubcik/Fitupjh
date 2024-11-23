import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";

import NavbarComponent from "@/components/Navbar/NavbarComponent";
import { getServerSession } from "next-auth";
import { SessionProvider } from "./SessionProvider";

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
  let session = await getServerSession();
  const checkForNewSession = async () => {
    "use server";
    session = await getServerSession();
  };
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <NavbarComponent
          session={session}
          checkForNewSession={checkForNewSession}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
