"use client";

import {
  Button,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";

import { useT } from "next-i18next/client";
import { CardUniversal } from "../common";
import { ThemeSwitcher } from "../Navbar/components/ThemeSwitcher";
import { LanguagePicker } from "../Navbar/components/LanguagePicker";
import { UserInfoOptions } from "@/lib/queriesOptions/UserInfoOptions";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { Formik, Form } from "formik";
import { toast } from "react-toastify";

import { UsersClass } from "@/models/users";

export default function ProfileMainComponent() {
  const { t } = useT("profile");
  const { data: user } = useSuspenseQuery(UserInfoOptions());

  const updateUserMutation = useMutation({
    mutationFn: async (payload: Partial<UsersClass>) => {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
  });

  const handleManualSubmit = async (values: Partial<UsersClass>) => {
    try {
      const updatePromise = (async () => {
        await updateUserMutation.mutateAsync(values);
      })();

      await toast.promise(
        updatePromise,
        {
          pending: "Updating profile...",
          success: "Profile updated successfully!",
          error: {
            render({ data }: any) {
              return data?.message || "Failed to update profile.";
            },
          },
        },
        {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        },
      );
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

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

          <Formik
            initialValues={{
              weight: user?.weight,
              weightGoal: user?.weightGoal,
              height: user?.height,
              activityLevel: user?.activityLevel || "sedatory",
              goal: user?.goal || "lose weight",
            }}
            onSubmit={async (values, { setSubmitting }) => {
              await handleManualSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <CardBody className="px-6 py-6 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      name="weight"
                      label={t("currentWeight")}
                      type="number"
                      value={String(values.weight)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                      min={50}
                      max={300}
                    />
                    <Input
                      name="weightGoal"
                      label={t("goalWeight")}
                      type="number"
                      value={String(values.weightGoal)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                      min={50}
                      max={300}
                    />
                    <Input
                      name="height"
                      label={t("height")}
                      type="number"
                      value={String(values.height)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                      min={50}
                      max={300}
                    />
                    <Select
                      name="activityLevel"
                      label={t("activityLevel")}
                      selectedKeys={[values.activityLevel]}
                      onChange={handleChange}
                      variant="faded"
                      isDisabled={isSubmitting}
                    >
                      <SelectItem key="sedentary" value="sedentary">
                        {t("sedentary")}
                      </SelectItem>
                      <SelectItem key="lightlyActive" value="lightlyActive">
                        {t("lightlyActive")}
                      </SelectItem>
                      <SelectItem key="mediumActive" value="mediumActive">
                        {t("moderatelyActive")}
                      </SelectItem>
                      <SelectItem key="highlyActive" value="highlyActive">
                        {t("veryActive")}
                      </SelectItem>
                    </Select>

                    <Select
                      name="goal"
                      label={t("primaryGoal")}
                      selectedKeys={[values.goal]}
                      onChange={handleChange}
                      variant="faded"
                      isDisabled={isSubmitting}
                    >
                      <SelectItem key="loseWeight" value="loseWeight">
                        {t("loseFat")}
                      </SelectItem>
                      <SelectItem key="maintainWeight" value="maintainWeight">
                        {t("maintainWeight")}
                      </SelectItem>
                      <SelectItem key="gainWeight" value="gainWeight">
                        {t("buildMuscle")}
                      </SelectItem>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-fit mt-2 bg-[#00FFAA] text-black font-bold"
                  >
                    {isSubmitting ? (
                      <Spinner size="sm" color="current" />
                    ) : (
                      t("updateBiometrics")
                    )}
                  </Button>
                </CardBody>
              </Form>
            )}
          </Formik>
        </CardUniversal>

        {/* === MACRO TARGETS FORM === */}
        {/* <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
          <Formik
            initialValues={{
              manualOverride: user?.manualOverride || false,
              targetCalories: user?.targetCalories || 2200,
              targetProtein: user?.targetProtein || 160,
              targetCarbs: user?.targetCarbs || 200,
              targetFat: user?.targetFat || 85,
              targetSugar: user?.targetSugar || 50,
            }}
            onSubmit={async (values, { setSubmitting }) => {
              await handleManualSubmit(values);
              setSubmitting(false);
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              setFieldValue,
              isSubmitting,
            }) => (
              <Form>
                <CardHeader className="flex justify-between items-center pb-2 pt-6 px-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {t("macroTargets")}
                  </h3>
                  <Switch
                    size="sm"
                    color="success"
                    isSelected={values.manualOverride}
                    onValueChange={(val) =>
                      setFieldValue("manualOverride", val)
                    }
                    isDisabled={isSubmitting}
                  >
                    {t("manualOverride")}
                  </Switch>
                </CardHeader>
                <Divider className="bg-zinc-200 dark:bg-zinc-800" />

                <CardBody className="px-6 py-6 flex flex-col gap-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                    {t("automaticNotice")}
                  </p>

   
                  <Input
                    name="targetCalories"
                    label={t("dailyCalories")}
                    type="number"
                    value={String(values.targetCalories)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="faded"
                    isDisabled={!values.manualOverride || isSubmitting}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input
                      name="targetProtein"
                      label={t("protein")}
                      type="number"
                      value={String(values.targetProtein)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={!values.manualOverride || isSubmitting}
                    />
                    <Input
                      name="targetCarbs"
                      label={t("carbs")}
                      type="number"
                      value={String(values.targetCarbs)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={!values.manualOverride || isSubmitting}
                    />
                    <Input
                      name="targetFat"
                      label={t("fat")}
                      type="number"
                      value={String(values.targetFat)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={!values.manualOverride || isSubmitting}
                    />
                    <Input
                      name="targetSugar"
                      label={t("sugar")}
                      type="number"
                      value={String(values.targetSugar)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={!values.manualOverride || isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-fit mt-2 bg-[#00FFAA] text-black font-bold"
                  >
                    {isSubmitting ? (
                      <Spinner size="sm" color="current" />
                    ) : (
                      t("saveTargets")
                    )}
                  </Button>
                </CardBody>
              </Form>
            )}
          </Formik>
        </CardUniversal> */}

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
            <Button color="danger" variant="flat" className="font-semibold ">
              <p className="p-2">{t("deleteAccount")}</p>
            </Button>
          </CardBody>
        </CardUniversal>
      </div>
    </div>
  );
}
