import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { useT } from "next-i18next/client";
import { toast } from "react-toastify";
import { ActivityClass } from "@/lib/mongo/models/Activity";
import { useActivityOperations } from "@/hooks/useActivityOperations";

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

export const ActivityRecordModal = ({
  isOpen,
  onOpenChange,
  activities = [],
  userWeightKg = 70,
  onCloseAll,
  existingRecord = null,
}: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedActivityName, setSelectedActivityName] = useState<string>("");
  const [minutes, setMinutes] = useState<number>(30);

  // Added updateActivityRecord (ensure this exists in your hook!)
  const { addActivityRecord, updateActivity } = useActivityOperations();
  const { t } = useT("dashboard");

  const isEditMode = !!existingRecord;

  // Pre-fill state if editing, or reset if creating new
  useEffect(() => {
    if (isOpen) {
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
    if (!selectedActivity) {
      toast.error(
        t("newActivityModal.toastNoActivity"),
        { position: "bottom-left" },
      );
      return;
    }

    if (minutes < 1) {
      toast.error(
        t("newActivityModal.toastBadValue"),
        { position: "bottom-left" },
      );
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
      placement="center"
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
                  ? t(
                      "editActivityModal.subtitle",
                    )
                  : t(
                      "newActivityModal.subtitle",
                    )}
              </p>
            </ModalHeader>

            <ModalBody className="py-4 gap-4 font-semibold">
              <Select
                label={t("newActivityModal.categoryLabel")}
                placeholder="e.g., Cardio, Strength..."
                selectedKeys={selectedCategory ? [selectedCategory] : []}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedActivityName(""); // Reset specific activity when category changes
                }}
                variant="bordered"
                classNames={{
                  trigger: "border-zinc-300 dark:border-zinc-700",
                }}
              >
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label={t("newActivityModal.activityLabel")}
                placeholder="e.g., Running, Cycling..."
                isDisabled={!selectedCategory} // Locked until category is chosen
                selectedKeys={
                  selectedActivityName ? [selectedActivityName] : []
                }
                onChange={(e) => setSelectedActivityName(e.target.value)}
                variant="bordered"
                classNames={{
                  trigger: "border-zinc-300 dark:border-zinc-700",
                }}
              >
                {filteredActivities.map((act) => (
                  <SelectItem key={act.name} value={act.name}>
                    {act.name}
                  </SelectItem>
                ))}
              </Select>

              <Input
                type="number"
                label={t("newActivityModal.durationLabel")}
                placeholder="0"
                value={minutes === 0 ? "" : minutes.toString()}
                onChange={(e) =>
                  setMinutes(Math.max(0, parseInt(e.target.value) || 0))
                }
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
                onPress={() => setTimeout(() => onClose(), 10)}
              >
                {t("newActivityModal.cancel")}
              </Button>
              <Button
                size="sm"
                color="primary"
                className="bg-blue-600 text-white font-medium"
                isDisabled={!selectedActivity}
                onPress={() => handleSave(onClose)}
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
