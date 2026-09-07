"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  CardBody,
  Progress,
  Input,
} from "@heroui/react";
import type { Selection } from "@heroui/react";
import { CardUniversal } from "@/components/common";
import { useT } from "next-i18next/client";
import useWaterOperations from "@/hooks/useWaterOperations";
import useRecommendedWater from "@/hooks/useRecommendedWater";
import {
  FaTint,
  FaPlus,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
} from "react-icons/fa";

type WaterSizePreset = {
  id: string;
  nameKey: "cup" | "bottle" | "largeBottle";
  amount: number;
  noticeKey?: "cupNotice";
};

const PRESETS: WaterSizePreset[] = [
  {
    id: "cup",
    nameKey: "cup",
    amount: 250,
    noticeKey: "cupNotice",
  },
  {
    id: "bottle",
    nameKey: "bottle",
    amount: 500,
  },
  {
    id: "largeBottle",
    nameKey: "largeBottle",
    amount: 1000,
  },
];

const WaterTracker = () => {
  const { t } = useT("dashboard");
  const { savedWaterEntries, totalWaterMl, addWater, removeWater, clearWater } =
    useWaterOperations();
  const { recommendedWater, age, gender } = useRecommendedWater();

  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["daily-water"]),
  );
  const [customAmount, setCustomAmount] = useState<string>("");
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const isKeyActive = (key: string) => {
    if (selectedKeys === "all") return true;
    return selectedKeys.has(key);
  };

  const percentage = Math.min(
    Math.round((totalWaterMl / (recommendedWater || 2000)) * 100),
    100,
  );
  const remainingMl = Math.max(recommendedWater - totalWaterMl, 0);
  const isGoalReached = totalWaterMl >= recommendedWater;

  const handleAddPreset = (amount: number) => {
    addWater(amount);
  };

  const handleAddCustom = () => {
    const parsed = Number(customAmount);
    if (!parsed || parsed <= 0) return;
    addWater(parsed);
    setCustomAmount("");
  };

  const active = isKeyActive("daily-water");

  const itemClasses = {
    base: "py-1 w-full border-none mb-1 last:mb-0",
    title: "font-semibold text-sm text-default-800 capitalize tracking-tight",
    subtitle: "text-xs text-default-400 mt-0.5",
    trigger:
      "px-3 py-0 data-[hover=true]:bg-default-100 rounded-xl h-16 flex items-center transition-all duration-200",
    indicator:
      "text-medium text-default-400 data-[open=true]:text-primary transition-transform duration-200",
    content: "text-small font-bold pt-1",
  };

  return (
    <CardUniversal id="tour-water" className="w-full sm:max-w-2xl self-center">
      <CardBody className="p-3 sm:p-5 max-w-2xl">
        <Accordion
          variant="light"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          showDivider={false}
          itemClasses={itemClasses}
        >
          <AccordionItem
            key="daily-water"
            aria-label={t("waterTracker.title")}
            title={
              <span
                className={
                  active
                    ? "text-primary font-bold transition-colors"
                    : "font-bold"
                }
              >
                {t("waterTracker.title")}
              </span>
            }
            subtitle={
              <span className="text-default-400 font-bold flex items-center gap-1.5 flex-wrap">
                <span>
                  {totalWaterMl} / {recommendedWater} {t("waterTracker.ml")}
                </span>
                <span>•</span>
                {isGoalReached ? (
                  <span className="text-emerald-500 font-bold">
                    {t("waterTracker.goalReached")}
                  </span>
                ) : (
                  <span>
                    {t("waterTracker.remaining", { amount: remainingMl })}
                  </span>
                )}
              </span>
            }
            startContent={
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                  active
                    ? "bg-primary-400 dark:bg-primary/10 text-white dark:text-primary shadow-sm scale-105"
                    : "bg-primary-100 dark:bg-default-100 text-default-500"
                }`}
              >
                <FaTint
                  className={`text-lg transition-transform ${
                    active ? "rotate-[6deg]" : ""
                  }`}
                />
              </div>
            }
          >
            <div className="flex flex-col gap-4 pt-1">
              {/* Progress and Recommendation */}
              <div className="flex flex-col gap-1.5 bg-default-50/60 dark:bg-white/2 p-3.5 rounded-2xl border border-default-200/50 dark:border-white/5">
                <div className="flex items-baseline justify-between text-xs sm:text-sm">
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-primary-500  ">
                      {totalWaterMl}
                    </span>
                    <span className="text-primary-500 font-semibold ">
                      / {recommendedWater} {t("waterTracker.ml")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-400 dark:bg-primary/10 rounded-full text-[11px] font-semibold transition-opacity hover:opacity-80">
                    <FaInfoCircle size={11} />
                    <span>
                      {recommendedWater} {t("waterTracker.ml")}
                    </span>
                  </div>
                </div>

                <Progress
                  value={percentage}
                  color={isGoalReached ? "success" : "primary"}
                  className="h-2.5"
                  aria-label={t("waterTracker.title")}
                />
              </div>

              {/* Presets */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-default-500">
                  {t("waterTracker.quickAdd")}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      size="md"
                      variant="flat"
                      color="primary"
                      onPress={() => handleAddPreset(preset.amount)}
                      className="h-auto py-2 px-2 flex flex-col items-center justify-center gap-0.5 rounded-xl border border-primary-500/20 hover:border-primary-500/40 bg-primary-500/5 hover:bg-primary-500/10 transition-all"
                    >
                      <span className="text-xs sm:text-sm font-bold text-foreground">
                        +{preset.amount} {t("waterTracker.ml")}
                      </span>
                      <span className="text-[10px] text-default-500 font-medium">
                        {t(`waterTracker.${preset.nameKey}`)}
                      </span>
                      {preset.noticeKey && (
                        <span className="text-[9px] text-primary-500 font-semibold">
                          {t(`waterTracker.${preset.noticeKey}`)}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="flex items-center gap-2">
                <Input
                  size="sm"
                  type="number"
                  min={1}
                  placeholder={t("waterTracker.customPlaceholder")}
                  value={customAmount}
                  onValueChange={setCustomAmount}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustom();
                    }
                  }}
                  endContent={
                    <span className="text-default-400 text-xs font-semibold">
                      {t("waterTracker.ml")}
                    </span>
                  }
                  aria-label={t("waterTracker.customAmount")}
                  variant="faded"
                  className="flex-1"
                />
                <Button
                  size="sm"
                  color="primary"
                  variant="solid"
                  startContent={<FaPlus size={10} />}
                  onPress={handleAddCustom}
                  isDisabled={!customAmount || Number(customAmount) <= 0}
                  className="font-bold rounded-xl px-4 bg-primary-500 text-white shadow-sm"
                >
                  {t("waterTracker.add")}
                </Button>
              </div>

              {/* History */}
              {savedWaterEntries.length > 0 && (
                <div className="flex flex-col gap-2 pt-1 border-t border-default-200/50 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="light"
                      onPress={() => setShowHistory((prev) => !prev)}
                      endContent={
                        showHistory ? (
                          <FaChevronUp size={10} />
                        ) : (
                          <FaChevronDown size={10} />
                        )
                      }
                      className="text-xs text-default-500 font-semibold px-1 min-w-0 h-7"
                    >
                      {t("waterTracker.todayEntries")} (
                      {savedWaterEntries.length})
                    </Button>
                    {showHistory && (
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={clearWater}
                        className="text-[11px] h-6 px-2 text-danger-500"
                      >
                        {t("waterTracker.clearAll")}
                      </Button>
                    )}
                  </div>

                  {showHistory && (
                    <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {savedWaterEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-default-100/50 dark:bg-white/[0.02] text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <FaTint className="text-sky-500 text-[10px]" />
                            <span className="font-bold text-foreground">
                              {entry.amount} {t("waterTracker.ml")}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            color="danger"
                            onPress={() => removeWater(entry.id)}
                            aria-label={t("waterTracker.remove")}
                            className="w-6 h-6 bg-danger-100 dark:bg-danger-900/30 text-danger sm:bg-transparent sm:text-default-400 sm:hover:text-danger"
                          >
                            <FaTrash size={10} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </AccordionItem>
        </Accordion>
      </CardBody>
    </CardUniversal>
  );
};

export default WaterTracker;
