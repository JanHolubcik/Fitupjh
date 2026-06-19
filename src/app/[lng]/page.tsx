"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import NextLink from "next/link";
import { FaHeartbeat } from "react-icons/fa";

import { useT } from "next-i18next/client";
import { useParams } from "next/navigation";

export default function Home() {
  const { data } = authClient.useSession();
  const { t } = useT("home");
  const params = useParams();
  const lng = params?.lng || "en";

  return (
    <main className="dark min-h-[calc(100vh-100px)] flex flex-col items-center justify-center sm:p-6 p-4 relative overflow-hidden">
      <div className="max-w-[480px] w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl from-[#006FEE]/15 to-[#38bdf8]/15 flex items-center justify-center border border-white/10  ">
            <FaHeartbeat className="text-3xl text-primary" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-3xl sm:text-4xl font-black text-primary bg-clip-text  ">
              FitUp
            </h1>
            <p className="text-base sm:text-lg font-semibold text-foreground/90">
              {t("subtitle")}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-default-500 leading-relaxed">
            <strong className="text-foreground">{t("welcomeGreeting")}</strong>{" "}
            {t("welcomeText")}
          </p>

          <div className="grid grid-cols-1 gap-3 w-full">
            <div className=" p-4 rounded-xl border border-white/5 text-left flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-foreground mb-0.5">
                  {t("quickLogging.title")}
                </h3>
                <p className="text-xs text-default-400">
                  {t("quickLogging.description")}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-white/5 text-left flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary  mt-1.5 shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-foreground mb-0.5">
                  {t("deepInsights.title")}
                </h3>
                <p className="text-xs text-default-400">
                  {t("deepInsights.description")}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="w-full mt-2">
            <Button
              as={NextLink}
              href={data?.user?.id ? `/${lng}/dashboard` : `/${lng}/signup`}
              className="w-full bg-[#006FEE] text-white font-bold h-12 text-base rounded-xl shadow-[0_4px_12px_rgba(0,111,238,0.25)] hover:shadow-[0_6px_20px_rgba(0,111,238,0.4)] transition-all"
            >
              {t("button")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
