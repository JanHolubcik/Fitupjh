import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";

import { useT } from "next-i18next/client";
import { toast } from "react-toastify";
import { ActivityClass } from "@/lib/mongo/models/Activity";
import useActivityOperations from "@/hooks/useActivityOperations";
import { usePathname } from "next/navigation";
import { useModalBackButton } from "@/hooks/useModalBackButton";

export type ActivityRecord = {
  _id: string;
  activity: string;
  durationMinutes: number;
  caloriesBurned?: number;
};

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  activities: ActivityClass[];
  userWeightKg?: number;
  onCloseAll?: () => void;
  existingRecord?: ActivityRecord | null;
};

const ActivityRecordModal = ({
  isOpen,
  onOpenChange,
  activities = [],
  userWeightKg = 70,
  onCloseAll,
  existingRecord = null,
}: Props) => {
  useModalBackButton(isOpen, () => onOpenChange(false));
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedActivityName, setSelectedActivityName] = useState<string>("");
  const [minutes, setMinutes] = useState<number>(30);
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const { addActivityRecord, updateActivity } = useActivityOperations();
  const { t } = useT("dashboard");
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";

  const getLocalizedName = (act: ActivityClass): string => {
    const map = act.localizedNames;
    if (!map) return act.name;
    return (
      (map as unknown as Record<string, string>)[currentLocale] || act.name
    );
  };

  const isEditMode = !!existingRecord;

  // Pre-fill state if editing, or reset if creating new
  useEffect(() => {
    if (isOpen) {
      setIsSaving(false);
      isSavingRef.current = false;
      setIsCategoryOpen(false);
      setIsActivityOpen(false);
      if (isEditMode && existingRecord) {
        // Find the base activity to get the category and name
        const matchedActivity = activities.find(
          (a) => a._id.toString() === existingRecord.activity,
        );

        if (matchedActivity) {
          setSelectedCategory(matchedActivity.category || "General");
          setSelectedActivityName(matchedActivity.name);
        }
        setMinutes(existingRecord.durationMinutes);
      } else {
        setSelectedCategory("");
        setSelectedActivityName("");
        setMinutes(30);
      }
    }
  }, [isOpen, isEditMode, existingRecord, activities]);

  const categories = useMemo(() => {
    const cats = activities.map((a) => a.category || "General");
    return Array.from(new Set(cats)).sort();
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (!selectedCategory) return [];
    return activities
      .filter((a) => (a.category || "General") === selectedCategory)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activities, selectedCategory]);

  const selectedActivity = useMemo(() => {
    return activities.find((a) => a.name === selectedActivityName) || null;
  }, [activities, selectedActivityName]);

  const caloriesBurned = selectedActivity
    ? Math.round(selectedActivity.metValue * userWeightKg * (minutes / 60))
    : 0;

  const handleSave = (onClose: () => void) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);

    if (!selectedActivity) {
      toast.error(t("newActivityModal.toastNoActivity"), {
        position: "bottom-left",
      });
      return;
    }

    if (minutes < 1) {
      toast.error(t("newActivityModal.toastBadValue"), {
        position: "bottom-left",
      });
      return;
    }
    const activityId = selectedActivity._id.toString();

    const payload = {
      activity: activityId,
      durationMinutes: minutes,
      caloriesBurned: caloriesBurned,
    };

    if (isEditMode && existingRecord) {
      updateActivity({
        id: existingRecord._id,
        ...payload,
      });
    } else {
      addActivityRecord(payload);
    }

    onClose();
    onCloseAll && onCloseAll();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      placement="top"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 max-w-md font-semibold mx-4",
        header:
          "border-b border-zinc-200 dark:border-zinc-800 pb-2 font-semibold",
        footer:
          "border-t border-zinc-200 dark:border-zinc-800 pt-2 font-semibold",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-semibold">
              <h3 className="text-lg font-bold capitalize text-zinc-900 dark:text-zinc-200">
                {isEditMode
                  ? t("editActivityModal.title")
                  : t("newActivityModal.title")}
              </h3>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {isEditMode
                  ? t("editActivityModal.subtitle")
                  : t("newActivityModal.subtitle")}
              </p>
            </ModalHeader>

            <ModalBody className="py-4 gap-4 font-semibold">
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`w-full flex flex-col justify-center px-3 py-1.5 min-h-[56px] rounded-xl border-2 transition-colors duration-150 bg-transparent text-left relative focus:outline-none ${
                    isCategoryOpen
                      ? "border-zinc-500 dark:border-zinc-400"
                      : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <span className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 select-none mb-0.5">
                    {t("newActivityModal.categoryLabel")}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      selectedCategory
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {selectedCategory
                      ? t(`activity.categories.${selectedCategory}`)
                      : t("newActivityModal.categoryPlaceholder")}
                  </span>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-4 h-4 transition-transform duration-200"
                      style={{
                        transform: isCategoryOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </button>

                {isCategoryOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setIsCategoryOpen(false)}
                    />
                    <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-h-60 overflow-y-auto py-1 animate-appearance-in">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setSelectedActivityName("");
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors duration-150
                            ${
                              selectedCategory === cat
                                ? "bg-blue-600 text-white"
                                : "text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                        >
                          {t(`activity.categories.${cat}`)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="relative w-full">
                <button
                  type="button"
                  disabled={!selectedCategory}
                  onClick={() => setIsActivityOpen(!isActivityOpen)}
                  className={`w-full flex flex-col justify-center px-3 py-1.5 min-h-[56px] rounded-xl border-2 transition-colors duration-150 bg-transparent text-left relative focus:outline-none ${
                    !selectedCategory
                      ? "border-zinc-200 dark:border-zinc-800/60 opacity-50 cursor-not-allowed bg-zinc-100/50 dark:bg-zinc-800/20"
                      : isActivityOpen
                        ? "border-zinc-500 dark:border-zinc-400"
                        : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <span className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 select-none mb-0.5">
                    {t("newActivityModal.activityLabel")}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      selectedActivityName
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {selectedActivityName && selectedActivity
                      ? getLocalizedName(selectedActivity)
                      : t("newActivityModal.activityPlaceholder")}
                  </span>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-4 h-4 transition-transform duration-200"
                      style={{
                        transform: isActivityOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </button>

                {isActivityOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setIsActivityOpen(false)}
                    />
                    <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-h-60 overflow-y-auto py-1 animate-appearance-in">
                      {filteredActivities.map((act) => (
                        <button
                          key={act.name}
                          type="button"
                          onClick={() => {
                            setSelectedActivityName(act.name);
                            setIsActivityOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors duration-150
                            ${
                              selectedActivityName === act.name
                                ? "bg-blue-600 text-white"
                                : "text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                        >
                          {getLocalizedName(act)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <Input
                type="number"
                label={t("newActivityModal.durationLabel")}
                placeholder="0"
                value={minutes === 0 ? "" : minutes.toString()}
                onChange={(e) =>
                  setMinutes(Math.max(0, parseInt(e.target.value) || 0))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave(onClose);
                  }
                }}
                endContent={<span className="text-zinc-500 text-sm">min</span>}
                variant="bordered"
                classNames={{
                  inputWrapper:
                    "font-semibold border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:focus-within:!border-zinc-400 focus-within:!border-zinc-500",
                  label: "text-zinc-500 dark:text-zinc-400",
                }}
              />

              {selectedActivity && (
                <div className="bg-zinc-100 dark:bg-zinc-950/50 p-3 mt-2 rounded-xl border border-zinc-200 dark:border-white/5 space-y-2 animate-appearance-in">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {t("newActivityModal.caloriesBurned")}
                    </span>
                    <span className="font-bold text-primary-500">
                      {caloriesBurned} kcal
                    </span>
                  </div>

                  <hr className="border-zinc-300 dark:border-zinc-800" />

                  <div className="flex flex-row justify-between items-center py-1">
                    <span className="text-xs font-extrabold text-zinc-500">
                      {t("newActivityModal.intensity")}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-bold text-xs">
                      {selectedActivity.metValue}
                    </span>
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="p-2">
              <Button
                size="sm"
                variant="flat"
                className="bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                isDisabled={isSaving}
                onPress={() => setTimeout(() => onClose(), 10)}
              >
                {t("newActivityModal.cancel")}
              </Button>
              <Button
                size="sm"
                color="primary"
                className="bg-blue-600 text-white font-medium"
                isLoading={isSaving}
                isDisabled={isSaving || !selectedActivity}
                onPressStart={() => handleSave(onClose)}
              >
                {isEditMode
                  ? t("editActivityModal.saveChanges")
                  : t("newActivityModal.saveChanges")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ActivityRecordModal;
