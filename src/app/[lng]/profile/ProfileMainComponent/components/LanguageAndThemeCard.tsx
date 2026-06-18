import { CardUniversal } from "@/components/common";
import { LanguagePicker } from "@/components/Navbar/components/LanguagePicker";
import { ThemeSwitcher } from "@/components/Navbar/components/ThemeSwitcher";
import { CardHeader, Divider, CardBody } from "@nextui-org/react";
import { useT } from "next-i18next/client";

export const LanguageAndThemeCard = () => {
  const { t } = useT("profile");
  return (
    <CardUniversal className="flex sm:hidden shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-2 pt-6 px-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          {t("languageAndTheme")}
        </h3>
      </CardHeader>
      <Divider className="bg-zinc-200 dark:bg-zinc-800" />
      <CardBody className="px-6 py-2 flex flex-col gap-0">
        <div className="flex flex-row items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
          <div className="flex flex-col gap-0.5 pr-4">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {t("appearance")}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("appearanceDesc")}
            </span>
          </div>
          <div className="shrink-0">
            <ThemeSwitcher />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
          <div className="flex flex-col gap-0.5 pr-4">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {t("language")}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("languageDesc")}
            </span>
          </div>
          <div className="shrink-0">
            <LanguagePicker />
          </div>
        </div>
      </CardBody>
    </CardUniversal>
  );
};
