import React from "react";
import { CardUniversal } from "@/components/common";
import { CardHeader, Divider, CardBody, Link } from "@heroui/react";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { FaShieldAlt } from "react-icons/fa";

export const LegalCard = () => {
  const { t } = useT("profile");
  const params = useParams();
  const lng = params?.lng || "en";

  return (
    <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-2 pt-6 px-6 flex flex-row items-center gap-3">
        <FaShieldAlt className="text-xl text-primary" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          {t("legal.title")}
        </h3>
      </CardHeader>
      <Divider className="bg-zinc-200 dark:bg-zinc-800" />
      <CardBody className="px-6 py-2 flex flex-col gap-0">
        <div className="flex flex-row justify-between items-center py-4 border-b border-zinc-100 dark:border-zinc-800/50">
          <div className="flex flex-col gap-0.5 pr-4">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {t("legal.privacyPolicy")}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("legal.privacyPolicyDesc")}
            </span>
          </div>
          <Link
            as={NextLink}
            href={`/${lng}/privacy-policy`}
            color="primary"
            className="text-sm font-semibold hover:underline shrink-0"
          >
            {t("legal.view")} →
          </Link>
        </div>

        <div className="flex flex-row justify-between items-center py-4">
          <div className="flex flex-col gap-0.5 pr-4">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {t("legal.termsOfUse")}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("legal.termsOfUseDesc")}
            </span>
          </div>
          <Link
            as={NextLink}
            href={`/${lng}/terms-of-use`}
            color="primary"
            className="text-sm font-semibold hover:underline shrink-0"
          >
            {t("legal.view")} →
          </Link>
        </div>
      </CardBody>
    </CardUniversal>
  );
};
