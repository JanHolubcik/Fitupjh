"use client";

import {
  Button,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";

import { useT } from "next-i18next/client";
import { CardUniversal } from "../common";
import { ThemeSwitcher } from "../Navbar/components/ThemeSwitcher";

import { LanguagePicker } from "../Navbar/components/LanguagePicker";

export default function ProfileMainComponent() {
  const { t } = useT("profile");

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col">
      <div className="md:col-span-8 flex flex-col gap-6">
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
        <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2 pt-6 px-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              {t("biometricsAndGoals")}
            </h3>
          </CardHeader>
          <Divider className="bg-zinc-200 dark:bg-zinc-800" />
          <CardBody className="px-6 py-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t("currentWeight")}
                type="number"
                defaultValue="75"
                variant="faded"
              />
              <Input
                label={t("goalWeight")}
                type="number"
                defaultValue="70"
                variant="faded"
              />
              <Input
                label={t("height")}
                type="number"
                defaultValue="180"
                variant="faded"
              />
              <Select
                label={t("activityLevel")}
                defaultSelectedKeys={["light"]}
                variant="faded"
              >
                <SelectItem key="sedentary" value="sedentary">
                  {t("sedentary")}
                </SelectItem>
                <SelectItem key="light" value="light">
                  {t("lightlyActive")}
                </SelectItem>
                <SelectItem key="moderate" value="moderate">
                  {t("moderatelyActive")}
                </SelectItem>
                <SelectItem key="active" value="active">
                  {t("veryActive")}
                </SelectItem>
              </Select>
              <Select
                label={t("primaryGoal")}
                defaultSelectedKeys={["cut"]}
                variant="faded"
              >
                <SelectItem key="cut" value="cut">
                  {t("loseFat")}
                </SelectItem>
                <SelectItem key="maintain" value="maintain">
                  {t("maintainWeight")}
                </SelectItem>
                <SelectItem key="bulk" value="bulk">
                  {t("buildMuscle")}
                </SelectItem>
              </Select>
            </div>
            <Button className="w-fit mt-2 bg-[#00FFAA] text-black font-bold">
              {t("updateBiometrics")}
            </Button>
          </CardBody>
        </CardUniversal>

        <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex justify-between items-center pb-2 pt-6 px-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              {t("macroTargets")}
            </h3>
            <Switch size="sm" color="success">
              {t("manualOverride")}
            </Switch>
          </CardHeader>
          <Divider className="bg-zinc-200 dark:bg-zinc-800" />
          <CardBody className="px-6 py-6 flex flex-col gap-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
              {t("automaticNotice")}
            </p>
            <Input
              label={t("dailyCalories")}
              type="number"
              defaultValue="2200"
              variant="faded"
              isDisabled // Remove this when override is toggled
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={t("protein")}
                type="number"
                defaultValue="160"
                variant="faded"
                isDisabled
              />
              <Input
                label={t("carbs")}
                type="number"
                defaultValue="200"
                variant="faded"
                isDisabled
              />
              <Input
                label={t("fat")}
                type="number"
                defaultValue="85"
                variant="faded"
                isDisabled
              />
            </div>
            <Button className="w-fit mt-2 bg-[#00FFAA] text-black font-bold">
              {t("saveTargets")}
            </Button>
          </CardBody>
        </CardUniversal>

        <CardUniversal className="shadow-md bg-red-50 dark:bg-zinc-900/80 backdrop-blur-md border border-red-200 dark:border-red-500/30">
          <CardHeader className="pb-2 pt-6 px-6">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-500">
              {t("dangerZone")}
            </h3>
          </CardHeader>
          <Divider className="bg-red-200 dark:bg-red-500/20" />
          <CardBody className="px-6 py-6 flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                {t("deleteAccount")}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                {t("deleteAccountNotice")}
              </p>
            </div>
            <Button color="danger" variant="flat" className="font-bold">
              {t("deleteAccount")}
            </Button>
          </CardBody>
        </CardUniversal>
      </div>
    </div>
  );
}
