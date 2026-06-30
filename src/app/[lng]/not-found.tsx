"use client";

import React from "react";
import { useT } from "next-i18next/client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import NextLink from "next/link";
import { FaDumbbell, FaHome, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  const { t } = useT("common");
  const params = useParams();
  const router = useRouter();

  const lng = typeof params?.lng === "string" ? params.lng : "en";

  const handleGoBack = () => {
    router.back();
  };

  return (
    <main className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center sm:p-6 p-4 relative overflow-hidden bg-background text-foreground transition-colors duration-200">
      <div className="max-w-[480px] w-full bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-sky-400/10 dark:from-[#006FEE]/15 dark:to-[#38bdf8]/15 flex items-center justify-center border border-zinc-200/30 dark:border-white/10">
            <FaDumbbell className="text-3xl text-primary" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-4xl sm:text-5xl font-black text-primary">
              {t("notFound.title")}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-foreground/90">
              {t("notFound.subtitle")}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-default-500 leading-relaxed">
            {t("notFound.description")}
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3 w-full mt-2">
            <Button
              as={NextLink}
              href={`/${lng}/dashboard`}
              className="w-full bg-[#006FEE] text-white font-bold h-12 text-base rounded-xl shadow-[0_4px_12px_rgba(0,111,238,0.25)] hover:shadow-[0_6px_20px_rgba(0,111,238,0.4)] transition-all"
            >
              <FaHome className="text-lg mr-2" />
              {t("notFound.dashboardButton")}
            </Button>

            <Button
              onPress={handleGoBack}
              variant="light"
              className="w-full text-default-500 hover:text-foreground font-semibold h-12 text-sm rounded-xl transition-colors"
            >
              <FaArrowLeft className="text-xs mr-2 animate-none" />
              {lng === "sk" ? "Späť" : "Go Back"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
