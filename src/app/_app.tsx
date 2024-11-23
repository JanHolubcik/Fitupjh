import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
export default async function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  const session = await getServerSession();
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
