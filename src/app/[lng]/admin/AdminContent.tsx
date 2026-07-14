"use client";

import React, { useState } from "react";
import { useT } from "next-i18next/client";
import { Divider, Tabs, Tab } from "@heroui/react";
import { CardUniversal } from "@/components/common";
import { FaUserShield } from "react-icons/fa";
import { AdminUsersTab } from "./components/AdminUsersTab";
import { AdminFoodsTab } from "./components/AdminFoodsTab";
import { AdminActivitiesTab } from "./components/AdminActivitiesTab";

type AdminContentProps = {
  lng: string;
};

export const AdminContent = ({ lng }: AdminContentProps) => {
  const { t } = useT("admin");
  const [activeTab, setActiveTab] = useState<"users" | "foods" | "activities">(
    "users",
  );

  return (
    <main className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-start sm:p-6 p-4 relative overflow-hidden bg-background text-foreground transition-colors duration-200 pt-10 sm:pt-16">
      <CardUniversal className="max-w-[900px] w-full p-6 sm:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <FaUserShield className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                {t("title")}
              </h1>
              <p className="text-xs text-default-500">{t("subtitle")}</p>
            </div>
          </div>
        </div>

        <Divider className="bg-zinc-200 dark:bg-zinc-800" />

        {/* Tab switcher */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as any)}
          variant="underlined"
          color="primary"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none border-b border-divider p-0",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0.5 h-12",
            tabContent: "group-data-[selected=true]:text-primary font-bold",
          }}
        >
          <Tab key="users" title={t("tabs.users")} />
          <Tab key="foods" title={t("tabs.foods")} />
          <Tab key="activities" title={t("tabs.activities")} />
        </Tabs>

        {activeTab === "users" && <AdminUsersTab lng={lng} />}
        {activeTab === "foods" && <AdminFoodsTab lng={lng} />}
        {activeTab === "activities" && <AdminActivitiesTab lng={lng} />}
      </CardUniversal>
    </main>
  );
};
