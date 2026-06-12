"use client";

import {
  Button,
  Card,
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

export default function ProfileMainComponent() {
  const { t } = useT();

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col ">
      <div className="md:col-span-8 flex flex-col gap-6">
        {/* 1. BIOMETRICS & GOALS */}
        <CardUniversal className="shadow-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
          <CardHeader className="pb-2 pt-6 px-6">
            <h3 className="text-lg font-bold text-white">
              {t("biometricsAndGoals", { ns: "profile" })}
            </h3>
          </CardHeader>
          <Divider className="bg-zinc-800" />
          <CardBody className="px-6 py-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t("currentWeight", { ns: "profile" })}
                type="number"
                defaultValue="75"
                variant="faded"
              />
              <Input
                label={t("goalWeight", { ns: "profile" })}
                type="number"
                defaultValue="70"
                variant="faded"
              />
              <Input
                label={t("height", { ns: "profile" })}
                type="number"
                defaultValue="180"
                variant="faded"
              />
              <Select
                label={t("activityLevel", { ns: "profile" })}
                defaultSelectedKeys={["light"]}
                variant="faded"
              >
                <SelectItem key="sedentary" value="sedentary">
                  {t("sedentary", { ns: "profile" })}
                </SelectItem>
                <SelectItem key="light" value="light">
                  {t("lightlyActive", { ns: "profile" })}
                </SelectItem>
                <SelectItem key="moderate" value="moderate">
                  {t("moderatelyActive", { ns: "profile" })}
                </SelectItem>
                <SelectItem key="active" value="active">
                  {t("veryActive", { ns: "profile" })}
                </SelectItem>
              </Select>
              <Select
                label={t("primaryGoal", { ns: "profile" })}
                defaultSelectedKeys={["cut"]}
                variant="faded"
              >
                <SelectItem key="cut" value="cut">
                  {t("loseFat", { ns: "profile" })}
                </SelectItem>
                <SelectItem key="maintain" value="maintain">
                  {t("maintainWeight", { ns: "profile" })}
                </SelectItem>
                <SelectItem key="bulk" value="bulk">
                  {t("buildMuscle", { ns: "profile" })}
                </SelectItem>
              </Select>
            </div>
            <Button className="w-fit mt-2 bg-[#00FFAA] text-black font-bold">
              {t("updateBiometrics", { ns: "profile" })}
            </Button>
          </CardBody>
        </CardUniversal>

        {/* 2. MACRO TARGETS */}
        <CardUniversal className="shadow-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
          <CardHeader className="flex justify-between items-center pb-2 pt-6 px-6">
            <h3 className="text-lg font-bold text-white">
              {t("macroTargets", { ns: "profile" })}
            </h3>
            <Switch size="sm" color="success">
              {t("manualOverride", { ns: "profile" })}
            </Switch>
          </CardHeader>
          <Divider className="bg-zinc-800" />
          <CardBody className="px-6 py-6 flex flex-col gap-4">
            <p className="text-sm text-zinc-400 mb-2">
              {t("automaticNotice", { ns: "profile" })}
            </p>
            <Input
              label={t("dailyCalories", { ns: "profile" })}
              type="number"
              defaultValue="2200"
              variant="faded"
              isDisabled // Remove this when override is toggled
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={t("protein", { ns: "profile" })}
                type="number"
                defaultValue="160"
                variant="faded"
                isDisabled
              />
              <Input
                label={t("carbs", { ns: "profile" })}
                type="number"
                defaultValue="200"
                variant="faded"
                isDisabled
              />
              <Input
                label={t("fat", { ns: "profile" })}
                type="number"
                defaultValue="85"
                variant="faded"
                isDisabled
              />
            </div>
            <Button className="w-fit mt-2 bg-[#00FFAA] text-black font-bold">
              {t("saveTargets", { ns: "profile" })}
            </Button>
          </CardBody>
        </CardUniversal>

        {/* 3. DANGER ZONE */}
        <CardUniversal className="shadow-md bg-zinc-900/80 backdrop-blur-md border border-red-500/30">
          <CardHeader className="pb-2 pt-6 px-6">
            <h3 className="text-lg font-bold text-red-500">
              {t("dangerZone", { ns: "profile" })}
            </h3>
          </CardHeader>
          <Divider className="bg-red-500/20" />
          <CardBody className="px-6 py-6 flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-bold text-white">
                {t("deleteAccount", { ns: "profile" })}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                {t("deleteAccountNotice", { ns: "profile" })}
              </p>
            </div>
            <Button color="danger" variant="flat" className="font-bold">
              {t("deleteAccount", { ns: "profile" })}
            </Button>
          </CardBody>
        </CardUniversal>
      </div>
    </div>
  );
}
