"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, CardBody, CardHeader, Divider } from "@heroui/react";
import { CardUniversal } from "@/components/common";
import { FaChevronLeft, FaShieldAlt } from "react-icons/fa";
import { useT } from "next-i18next/client";

interface Section {
  title: string;
  items: string[];
}

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const { t } = useT("privacy");

  const title = t("title");
  const lastUpdated = t("lastUpdated");
  const backBtn = t("backBtn");
  const intro = t("intro");
  const sections = (t("sections", { returnObjects: true }) || []) as Section[];

  return (
    <main className="min-h-[calc(100vh-100px)] py-8 px-4 sm:px-6 md:px-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="light"
          onPress={() => router.back()}
          startContent={<FaChevronLeft />}
          className="font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
        >
          {backBtn}
        </Button>
      </div>

      <CardUniversal className="shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-4 pt-8 px-8 flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <FaShieldAlt className="text-2xl text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                {title}
              </h1>
              <p className="text-xs text-default-400 mt-1">
                {lastUpdated}
              </p>
            </div>
          </div>
        </CardHeader>
        <Divider className="bg-zinc-200 dark:bg-zinc-800" />
        <CardBody className="px-8 py-8 flex flex-col gap-6 text-zinc-700 dark:text-zinc-300">
          <p className="text-sm sm:text-base leading-relaxed font-medium">
            {intro}
          </p>

          {Array.isArray(sections) && sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-2">
                {section.title}
              </h3>
              <ul className="list-disc pl-5 flex flex-col gap-2">
                {Array.isArray(section.items) && section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-sm leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardBody>
      </CardUniversal>
    </main>
  );
}
