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
  const session = await getServerSession();
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          {
            //Why session is not in providers?
            //Well session gets rendered on server side now,
            // so there will not be any loading on client side.
          }
          <SessionProvider session={session}>
            <NavbarComponent />
            {children}
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
