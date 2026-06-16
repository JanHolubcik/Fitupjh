"use client";

import { authClient } from "@/lib/auth-client";
import { Image, Link, Button } from "@nextui-org/react";

import { useT } from "next-i18next/client";
import { useParams } from "next/navigation";

export default function Home() {
  const { data } = authClient.useSession();
  const { t } = useT("home");
  const params = useParams();
  const lng = params?.lng || "en";
  return (
    <main className="dark min-h-screen flex flex-col items-center justify-center sm:p-10 p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00FFAA]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-[600px] w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-[240px] h-[240px] drop-shadow-2xl">
            <Image
              className="object-contain w-full h-full"
              alt={t("button")}
              src="greeting_owl.png"
              width={240}
              height={240}
            />
          </div>

          <div className="flex flex-col items-center gap-2 mt-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFAA] to-[#00BFFF] tracking-tight">
              FitUp
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-foreground">
              {t("subtitle")}
            </p>
          </div>

          <p className="text-default-500 leading-relaxed max-w-[450px]">
            <strong className="text-foreground">{t("welcomeGreeting")}</strong>{" "}
            {t("welcomeText")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors text-left">
              <h3 className="font-semibold text-foreground mb-2">
                {t("quickLogging.title")}
              </h3>
              <p className="text-sm text-default-400">
                {t("quickLogging.description")}
              </p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors text-left">
              <h3 className="font-semibold text-foreground mb-2">
                {t("deepInsights.title")}
              </h3>
              <p className="text-sm text-default-400">
                {t("deepInsights.description")}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 mt-6 w-full">
            <h2 className="text-lg font-medium text-foreground">
              {t("start")}
            </h2>
            <Button
              as={Link}
              href={data?.user?.id ? `/${lng}/dashboard` : `/${lng}/signup`}
              className="w-full sm:w-auto bg-[#00FFAA] text-black font-bold px-10 py-6 text-lg rounded-2xl shadow-[0_0_15px_rgba(0,255,170,0.2)] hover:shadow-[0_0_30px_rgba(0,255,170,0.5)] transition-all hover:-translate-y-1"
            >
              {t("button")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
