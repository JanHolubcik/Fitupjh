"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Input,
  Button,
  Spinner,
  Progress,
  Select,
  SelectItem,
} from "@heroui/react";
import { Formik, Form } from "formik";
import { showToast } from "@/utils/toast";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "next-i18next/client";
import { onboardingSchema } from "@/lib/validationShemas/userValidationSchema";
import { z } from "zod";

import {
  FaFire,
  FaBalanceScale,
  FaDumbbell,
  FaUtensilSpoon,
  FaBarcode,
  FaCamera,
} from "react-icons/fa";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useT("onboarding");

  const STEPS = [
    { id: 0, title: t("steps.welcome") },
    { id: 1, title: t("steps.yourGoal") },
    { id: 2, title: t("steps.yourDetails") },
    { id: 3, title: t("steps.review") },
  ];

  const slideVariants = {
    hiddenRight: { x: 50, opacity: 0 },
    hiddenLeft: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exitRight: { x: 50, opacity: 0, transition: { duration: 0.3 } },
    exitLeft: { x: -50, opacity: 0, transition: { duration: 0.3 } },
  };

  const nextStep = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStep((p) => Math.min(p + 1, STEPS.length - 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevStep = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStep((p) => Math.max(p - 1, 0));
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    //65px is height on navbar
    <main className="min-h-[calc(100vh-65px)] w-full flex items-center justify-center  bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-xl w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl overflow-hidden">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setStep(s.id);
                    setTimeout(() => setIsAnimating(false), 300);
                  }
                }}
                className={`text-xs font-bold transition-colors ${
                  step >= s.id ? "text-blue-500" : "text-zinc-400"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
          <Progress
            value={((step + 1) / STEPS.length) * 100}
            color="primary"
            className="h-2"
            classNames={{ indicator: "bg-blue-500" }}
          />
        </div>

        <Formik
          initialValues={{
            goal: "loseWeight",
            weight: "",
            height: "",
            yearOfBirth: "",
            gender: "male",
            activityLevel: "lightlyActive",
          }}
          validate={(values) => {
            const errors: Record<string, string> = {};

            if (!values.weight && values.weight !== "0") {
              errors.weight = t("validation.weightRequired");
            }
            if (!values.height && values.height !== "0") {
              errors.height = t("validation.heightRequired");
            }
            if (!values.yearOfBirth && values.yearOfBirth !== "0") {
              errors.yearOfBirth = t("validation.yearOfBirthRequired");
            }

            const result = onboardingSchema.safeParse(values);
            if (!result.success) {
              for (const issue of result.error.issues) {
                const field = issue.path[0] as string;
                if (field === "weight" && !errors.weight) {
                  if (issue.code === z.ZodIssueCode.too_small) {
                    errors.weight = t("validation.weightMin");
                  } else if (issue.code === z.ZodIssueCode.too_big) {
                    errors.weight = t("validation.weightMax");
                  } else {
                    errors.weight = t("validation.weightRequired");
                  }
                } else if (field === "height" && !errors.height) {
                  if (issue.code === z.ZodIssueCode.too_small) {
                    errors.height = t("validation.heightMin");
                  } else if (issue.code === z.ZodIssueCode.too_big) {
                    errors.height = t("validation.heightMax");
                  } else {
                    errors.height = t("validation.heightRequired");
                  }
                } else if (field === "yearOfBirth" && !errors.yearOfBirth) {
                  if (issue.code === z.ZodIssueCode.too_small) {
                    errors.yearOfBirth = t("validation.yearOfBirthMin");
                  } else if (issue.code === z.ZodIssueCode.too_big) {
                    errors.yearOfBirth = t("validation.yearOfBirthMax");
                  } else {
                    errors.yearOfBirth = t("validation.yearOfBirthRequired");
                  }
                }
              }
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            const { error } = await authClient.updateUser({
              goal: values.goal,
              weight: Number(values.weight),
              height: Number(values.height),
              yearOfBirth: Number(values.yearOfBirth),
              gender: values.gender,
              activityLevel: values.activityLevel,
            });

            if (error) {
              showToast.error(error.message || t("toast.error"));
              setSubmitting(false);
              return;
            }
            setStatus({ success: true });
            router.push("/dashboard");
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,

            setFieldValue,
            setFieldTouched,
            status,
          }) => {
            // Helper objects to display user-friendly labels on the review screen
            const goalLabels: Record<string, string> = {
              loseWeight: t("review.goals.loseWeight"),
              maintainWeight: t("review.goals.maintainWeight"),
              gainWeight: t("review.goals.gainWeight"),
            };

            const activityLabels: Record<string, string> = {
              sedentary: t("review.activities.sedentary"),
              lightlyActive: t("review.activities.lightlyActive"),
              mediumActive: t("review.activities.mediumActive"),
              highlyActive: t("review.activities.highlyActive"),
            };

            const genderLabels: Record<string, string> = {
              male: t("review.genders.male"),
              female: t("review.genders.female"),
            };

            return (
              <Form className="flex flex-col min-h-[300px]">
                <div className="h-[410px] relative">
                  <AnimatePresence mode="wait">
                    {/* STEP 0: WELCOME */}
                    {step === 0 && (
                      <motion.div
                        key="step0"
                        variants={slideVariants}
                        initial="hiddenRight"
                        animate="visible"
                        exit="exitLeft"
                        className="flex flex-col items-center text-center gap-3 w-full absolute top-0"
                      >
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                          {t("welcome.title")}
                        </h2>

                        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-[15px] leading-relaxed max-w-sm mb-2 sm:mb-4">
                          {t("welcome.subtitle")}
                        </p>

                        <div className="w-full flex flex-col gap-3 mt-2">
                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-left transition-colors">
                            <div className="bg-blue-500/10 text-blue-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex shrink-0 items-center justify-center text-lg sm:text-xl">
                              <FaUtensilSpoon />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                                {t("welcome.features.logging.title")}
                              </span>
                              <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-snug">
                                {t("welcome.features.logging.desc")}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-left transition-colors">
                            <div className="bg-blue-500/10 text-blue-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex shrink-0 items-center justify-center text-lg sm:text-xl">
                              <FaBarcode />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                                {t("welcome.features.scanner.title")}
                              </span>
                              <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-snug">
                                {t("welcome.features.scanner.desc")}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-left transition-colors">
                            <div className="bg-blue-500/10 text-blue-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex shrink-0 items-center justify-center text-lg sm:text-xl">
                              <FaCamera />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                                {t("welcome.features.ai.title")}
                              </span>
                              <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-snug">
                                {t("welcome.features.ai.desc")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        variants={slideVariants}
                        initial="hiddenRight"
                        animate="visible"
                        exit="exitLeft"
                        className="flex flex-col justify-center h-full gap-6 text-center w-full absolute top-0 sm:top-auto"
                      >
                        <h2 className="text-2xl font-extrabold mt-4 sm:mt-0">
                          {t("goal.title")}
                        </h2>
                        {/* Stacks vertically on mobile, horizontal on desktop */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
                          <Button
                            onPress={() => setFieldValue("goal", "loseWeight")}
                            className={`p-4 border-2 sm:h-20 rounded-xl flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-4 transition-all duration-200 active:scale-[0.98] ${
                              values.goal === "loseWeight"
                                ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-sm"
                                : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300"
                            }`}
                          >
                            <FaFire
                              size={28}
                              className="sm:text-3xl shrink-0"
                            />
                            <span className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                              {t("goal.loseFat")}
                            </span>
                          </Button>

                          <Button
                            onPress={() =>
                              setFieldValue("goal", "maintainWeight")
                            }
                            className={`p-4 border-2 rounded-xl flex flex-row  sm:h-20  sm:flex-col items-center justify-start sm:justify-center gap-4 transition-all duration-200 active:scale-[0.98] ${
                              values.goal === "maintainWeight"
                                ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-sm"
                                : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300"
                            }`}
                          >
                            <FaBalanceScale
                              size={28}
                              className="sm:text-3xl shrink-0"
                            />
                            <span className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                              {t("goal.maintain")}
                            </span>
                          </Button>

                          <Button
                            onPress={() => setFieldValue("goal", "gainWeight")}
                            className={`p-4 border-2 rounded-xl flex  sm:h-20  flex-row sm:flex-col items-center justify-start sm:justify-center gap-4 transition-all duration-200 active:scale-[0.98] ${
                              values.goal === "gainWeight"
                                ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-sm"
                                : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300"
                            }`}
                          >
                            <FaDumbbell
                              size={28}
                              className="sm:text-3xl shrink-0"
                            />
                            <span className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                              {t("goal.buildMuscle")}
                            </span>
                          </Button>
                        </div>
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        variants={slideVariants}
                        initial="hiddenRight"
                        animate="visible"
                        exit="exitLeft"
                        className="flex flex-col justify-center h-full gap-6 w-full"
                      >
                        <h2 className="text-2xl font-extrabold mb-2 text-center md:text-left">
                          {t("details.title")}
                        </h2>

                        <div className="grid grid-cols-2 gap-4 w-full">
                          <Input
                            name="weight"
                            label={t("details.weightLabel")}
                            type="number"
                            value={String(values.weight)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!errors.weight && touched.weight}
                            errorMessage={errors.weight}
                            required
                            className="flex-1"
                          />
                          <Input
                            name="height"
                            label={t("details.heightLabel")}
                            type="number"
                            value={String(values.height)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!errors.height && touched.height}
                            errorMessage={errors.height}
                            required
                            className="flex-1"
                          />
                          <Input
                            name="yearOfBirth"
                            label={t("details.yearOfBirthLabel")}
                            type="number"
                            min={1900}
                            max={new Date().getFullYear()}
                            value={String(values.yearOfBirth)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!errors.yearOfBirth && touched.yearOfBirth}
                            errorMessage={errors.yearOfBirth}
                            required
                            className="flex-1"
                          />
                          <Select
                            name="gender"
                            label={t("details.genderLabel")}
                            selectedKeys={[values.gender]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="faded"
                            className="flex-1"
                          >
                            <SelectItem key="male">{t("details.gender.male")}</SelectItem>
                            <SelectItem key="female">{t("details.gender.female")}</SelectItem>
                          </Select>
                        </div>

                        <Select
                          name="activityLevel"
                          label={t("details.activityLevel")}
                          selectedKeys={[values.activityLevel]}
                          onChange={handleChange}
                          variant="faded"
                          className="w-full"
                        >
                          <SelectItem key="sedentary">
                            {t("details.activity.sedentary")}
                          </SelectItem>
                          <SelectItem key="lightlyActive">
                            {t("details.activity.lightlyActive")}
                          </SelectItem>
                          <SelectItem key="mediumActive">
                            {t("details.activity.mediumActive")}
                          </SelectItem>
                          <SelectItem key="highlyActive">
                            {t("details.activity.highlyActive")}
                          </SelectItem>
                        </Select>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        variants={slideVariants}
                        initial="hiddenRight"
                        animate="visible"
                        exit="exitLeft"
                        className="flex flex-col justify-center items-center h-full gap-6 w-full text-center"
                      >
                        <div>
                          <h2 className="text-2xl font-extrabold mb-2">
                            {t("review.title")}
                          </h2>
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                            {t("review.subtitle")}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                              {t("review.goalLabel")}
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {goalLabels[values.goal]}
                            </span>
                          </div>

                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                              {t("review.activityLevelLabel")}
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {activityLabels[values.activityLevel]}
                            </span>
                          </div>

                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                              {t("review.weightLabel")}
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {values.weight
                                ? `${values.weight} ${t("review.kg")}`
                                : t("review.notSet")}
                            </span>
                          </div>

                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                              {t("review.heightLabel")}
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {values.height
                                ? `${values.height} ${t("review.cm")}`
                                : t("review.notSet")}
                            </span>
                          </div>

                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                              {t("review.yearOfBirthLabel")}
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {values.yearOfBirth
                                ? values.yearOfBirth
                                : t("review.notSet")}
                            </span>
                          </div>

                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                              {t("review.genderLabel")}
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {genderLabels[values.gender] || t("review.notSet")}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-between mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <Button
                    type="button"
                    variant="light"
                    onPress={prevStep}
                    isDisabled={step === 0 || isSubmitting || isAnimating}
                  >
                    {t("buttons.back")}
                  </Button>

                  {step < STEPS.length - 1 ? (
                    <Button
                      type="button"
                      onPress={() => {
                        if (step === 2) {
                          setFieldTouched("weight", true);
                          setFieldTouched("height", true);
                          setFieldTouched("yearOfBirth", true);

                          const hasWeightError =
                            !values.weight ||
                            isNaN(Number(values.weight)) ||
                            Number(values.weight) < 50 ||
                            Number(values.weight) > 300;
                          const hasHeightError =
                            !values.height ||
                            isNaN(Number(values.height)) ||
                            Number(values.height) < 50 ||
                            Number(values.height) > 300;
                          const currentYear = new Date().getFullYear();
                          const hasYearOfBirthError =
                            !values.yearOfBirth ||
                            isNaN(Number(values.yearOfBirth)) ||
                            Number(values.yearOfBirth) < 1900 ||
                            Number(values.yearOfBirth) > currentYear;

                          if (hasWeightError || hasHeightError || hasYearOfBirthError) {
                            return;
                          }
                        }
                        nextStep();
                      }}
                      isDisabled={isAnimating}
                      className="bg-zinc-900 text-white dark:bg-white dark:text-black font-bold"
                    >
                      {t("buttons.continue")}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      isDisabled={
                        isSubmitting || status?.success || isAnimating
                      }
                      className={`font-bold transition-all duration-200 text-white ${
                        status?.success
                          ? "bg-emerald-500 dark:bg-emerald-600 cursor-default"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {isSubmitting ? (
                        <Spinner size="sm" color="white" />
                      ) : status?.success ? (
                        <span>✓ {t("buttons.success") || "Done!"}</span>
                      ) : (
                        t("buttons.completeSetup")
                      )}
                    </Button>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </main>
  );
}
