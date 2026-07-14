"use client";

import React from "react";
import { useT } from "next-i18next/client";
import { FaUserShield } from "react-icons/fa";

type AdminTestContentProps = {
  lng: string;
};

export const AdminTestContent = ({ lng }: AdminTestContentProps) => {
  const { t } = useT("common");

  return (
    <main className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center sm:p-6 p-4 relative overflow-hidden bg-background text-foreground transition-colors duration-200">
      <div className="max-w-[480px] w-full bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#006FEE]/10 to-[#38bdf8]/10 dark:from-[#006FEE]/15 dark:to-[#38bdf8]/15 flex items-center justify-center border border-zinc-200/30 dark:border-white/10 text-primary">
            <FaUserShield className="text-3xl" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-3xl font-black text-primary">
              {t("adminTest.title")}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-foreground/90">
              {t("adminTest.welcome")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
