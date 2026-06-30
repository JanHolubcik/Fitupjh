"use client";

import React, { useEffect } from "react";
import { useT } from "next-i18next/client";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react";
import NextLink from "next/link";
import { FaExclamationTriangle, FaHome, FaRedo } from "react-icons/fa";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage = ({ error, reset }: ErrorProps) => {
  const { t } = useT("common");
  const params = useParams();

  const lng = typeof params?.lng === "string" ? params.lng : "en";

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <main className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center sm:p-6 p-4 relative overflow-hidden bg-background text-foreground transition-colors duration-200">
      <div className="max-w-[480px] w-full bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500/10 to-orange-400/10 dark:from-[#F31260]/15 dark:to-[#f5a524]/15 flex items-center justify-center border border-zinc-200/30 dark:border-white/10">
            <FaExclamationTriangle className="text-3xl text-danger" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-4xl sm:text-5xl font-black text-danger">
              {t("serverError.title")}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-foreground/90">
              {t("serverError.subtitle")}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-default-500 leading-relaxed">
            {t("serverError.description")}
          </p>

          <div className="grid grid-cols-1 gap-3 w-full mt-2">
            <Button
              onPress={reset}
              className="w-full bg-[#006FEE] text-white font-bold h-12 text-base rounded-xl shadow-[0_4px_12px_rgba(0,111,238,0.25)] hover:shadow-[0_6px_20px_rgba(0,111,238,0.4)] transition-all"
            >
              <FaRedo className="text-sm mr-2" />
              {lng === "sk" ? "Skúsiť znova" : "Try Again"}
            </Button>

            <Button
              as={NextLink}
              href={`/${lng}/dashboard`}
              variant="light"
              className="w-full text-default-500 hover:text-foreground font-semibold h-12 text-sm rounded-xl transition-colors"
            >
              <FaHome className="text-lg mr-2" />
              {t("serverError.button")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
