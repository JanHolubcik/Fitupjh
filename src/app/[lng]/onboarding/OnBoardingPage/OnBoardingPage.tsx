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
} from "@nextui-org/react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaFire,
  FaBalanceScale,
  FaDumbbell,
  FaUtensilSpoon,
  FaBarcode,
  FaCamera,
} from "react-icons/fa";

const STEPS = [
  { id: 0, title: "Welcome" },
  { id: 1, title: "Your Goal" },
  { id: 2, title: "Your Details" },
  { id: 3, title: "Review" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
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
            activityLevel: "lightlyActive",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const { error } = await authClient.updateUser({
              goal: values.goal,
              weight: Number(values.weight),
              height: Number(values.height),
              activityLevel: values.activityLevel,
            });

            if (error) {
              toast.error(error.message);
              setSubmitting(false);
              return;
            }
            router.push("/dashboard");
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            isSubmitting,
            setFieldValue,
          }) => {
            // Helper objects to display user-friendly labels on the review screen
            const goalLabels = {
              loseWeight: "Lose Fat",
              maintainWeight: "Maintain",
              gainWeight: "Build Muscle",
            };

            const activityLabels = {
              sedentary: "Sedentary",
              lightlyActive: "Lightly Active",
              mediumActive: "Moderately Active",
              highlyActive: "Highly Active",
            };

            return (
              <Form className="flex flex-col min-h-[300px]">
                <div className="h-96 relative">
                  <AnimatePresence mode="wait">
                    {/* STEP 0: WELCOME */}
                    {step === 0 && (
                      <motion.div
                        key="step0"
                        variants={slideVariants}
                        initial="hiddenRight"
                        animate="visible"
                        exit="exitLeft"
                        className="flex flex-col items-center text-center gap-4 py-2"
                      >
                        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                          Welcome!
                        </h2>

                        <p className="text-zinc-500 dark:text-zinc-400 text-[15px] leading-relaxed max-w-sm mb-4">
                          The easiest way to track your daily food intake. Let's
                          get your profile set up so you can start logging.
                        </p>

                        <div className="w-full flex flex-col gap-3 mt-2">
                          <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-left transition-colors hover:border-blue-500/50">
                            <div className="bg-blue-500/10 text-blue-500 w-12 h-12 rounded-full flex shrink-0 items-center justify-center text-xl">
                              <FaUtensilSpoon />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900 dark:text-white">
                                Simple Daily Logging
                              </span>
                              <span className="text-sm text-zinc-500 dark:text-zinc-400 leading-snug">
                                Keep track of your meals and macros
                                effortlessly.
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-left transition-colors hover:border-blue-500/50">
                            <div className="bg-blue-500/10 text-blue-500 w-12 h-12 rounded-full flex shrink-0 items-center justify-center text-xl">
                              <FaBarcode />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900 dark:text-white">
                                Barcode Scanner
                              </span>
                              <span className="text-sm text-zinc-500 dark:text-zinc-400 leading-snug">
                                Scan packaging to instantly pull up exact
                                nutrition facts.
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-left transition-colors hover:border-blue-500/50">
                            <div className="bg-blue-500/10 text-blue-500 w-12 h-12 rounded-full flex shrink-0 items-center justify-center text-xl">
                              <FaCamera />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900 dark:text-white">
                                AI Food Analyzer
                              </span>
                              <span className="text-sm text-zinc-500 dark:text-zinc-400 leading-snug">
                                Just snap a photo and let our AI estimate your
                                meal.
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
                        className="flex flex-col items-center justify-center h-full gap-6 text-center"
                      >
                        <h2 className="text-2xl font-extrabold">
                          What is your main goal?
                        </h2>
                        <div className="grid grid-cols-3 gap-4 w-full">
                          <button
                            type="button"
                            onClick={() => setFieldValue("goal", "loseWeight")}
                            className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-colors ${
                              values.goal === "loseWeight"
                                ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300"
                            }`}
                          >
                            <FaFire size={32} />
                            <span className="font-bold text-zinc-900 dark:text-white">
                              Lose Fat
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setFieldValue("goal", "maintainWeight")
                            }
                            className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-colors ${
                              values.goal === "maintainWeight"
                                ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300"
                            }`}
                          >
                            <FaBalanceScale size={32} />
                            <span className="font-bold text-zinc-900 dark:text-white">
                              Maintain
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setFieldValue("goal", "gainWeight")}
                            className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-colors ${
                              values.goal === "gainWeight"
                                ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                : "border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300"
                            }`}
                          >
                            <FaDumbbell size={32} />
                            <span className="font-bold text-zinc-900 dark:text-white">
                              Build Muscle
                            </span>
                          </button>
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
                          Your starting point
                        </h2>

                        <div className="flex gap-4 w-full">
                          <Input
                            name="weight"
                            label="Current Weight (kg)"
                            type="number"
                            value={String(values.weight)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className="flex-1"
                          />
                          <Input
                            name="height"
                            label="Height (cm)"
                            type="number"
                            value={String(values.height)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className="flex-1"
                          />
                        </div>

                        <Select
                          name="activityLevel"
                          label="Daily Activity Level"
                          selectedKeys={[values.activityLevel]}
                          onChange={handleChange}
                          variant="faded"
                          className="w-full"
                        >
                          <SelectItem key="sedentary" value="sedentary">
                            Sedentary (Office job, little exercise)
                          </SelectItem>
                          <SelectItem key="lightlyActive" value="lightlyActive">
                            Lightly Active (1-3 days/week)
                          </SelectItem>
                          <SelectItem key="mediumActive" value="mediumActive">
                            Moderately Active (3-5 days/week)
                          </SelectItem>
                          <SelectItem key="highlyActive" value="highlyActive">
                            Highly Active (6-7 days/week)
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
                            Review your details
                          </h2>
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                            If everything looks correct, you are ready to start!
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                              Goal
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {goalLabels[values.goal]}
                            </span>
                          </div>

                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                              Activity Level
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {activityLabels[values.activityLevel]}
                            </span>
                          </div>

                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                              Weight
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {values.weight
                                ? `${values.weight} kg`
                                : "Not set"}
                            </span>
                          </div>

                          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                              Height
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {values.height
                                ? `${values.height} cm`
                                : "Not set"}
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
                    Back
                  </Button>

                  {step < STEPS.length - 1 ? (
                    <Button
                      type="button"
                      onPress={nextStep}
                      isDisabled={isAnimating}
                      className="bg-zinc-900 text-white dark:bg-white dark:text-black font-bold"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || isAnimating}
                      className="bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
                    >
                      {isSubmitting ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        "Complete Setup"
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
