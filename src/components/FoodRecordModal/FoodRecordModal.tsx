import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { useModalBackButton } from "@/hooks/useModalBackButton";
import { Food, TimeOfDay } from "@/types/Types";
import { useT } from "next-i18next/client";
import {
  MACRO_TAILWIND_THEME,
  MacroArray,
} from "@/app/[lng]/constants/MacrosHelper";
import ImageFromURL from "../ImageFromURL/ImageFromURL";
import { showToast } from "@/utils/toast";

type FoodRecordModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  food: Food | null | undefined;
  timeOfDay: TimeOfDay;
  mode: "edit" | "new";
  onCloseAll?: () => void;
};

const FoodRecordModal = ({
  isOpen,
  onOpenChange,
  food,
  timeOfDay,
  mode,
  onCloseAll,
}: FoodRecordModalProps) => {
  useModalBackButton(isOpen, () => onOpenChange(false));
  const [grams, setGrams] = useState<number>(100);
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateFood, addToFoodObject } = useYourIntakeOperations();
  const { t } = useT("dashboard");

  useEffect(() => {
    if (isOpen) {
      setIsSaving(false);
      isSavingRef.current = false;
      if (food) {
        const initialGrams = parseFloat(food.amount) || 100;
        setGrams(initialGrams);
      }
    }
  }, [food, isOpen]);

  if (!food) return null;

  const foodComponent = { ...food };
  const initialGrams = parseFloat(food.amount) || 100;
  const ratio = grams / (initialGrams || 1);

  const tBase = mode === "edit" ? "editFoodModal" : "newFoodModal";

  const handleSave = (onClose: () => void) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);
    inputRef.current?.blur();

    if (grams < 1) {
      showToast.error(t("modalCreateFood.toastBadValue"));
      return;
    }

    if (mode === "edit") {
      updateFood(food, grams, timeOfDay);
      onClose();
    } else {
      const updatedFood: Food = {
        ...food,
        amount: `${grams}`,
        calories: Math.round(food.calories),
        protein: Number(food.protein),
        carbohydrates: Number(food.carbohydrates),
        fat: Number(food.fat),
        sugar: Number(food.sugar),
        fiber: Number(food.fiber),
        salt: Number(food.salt),
        originalName: food.originalName,
      };
      addToFoodObject(updatedFood, timeOfDay);
      onClose();
      if (onCloseAll) {
        onCloseAll();
      }
    }
  };

  return (
    <Modal
      placement="top"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 max-w-md font-semibold mx-4",
        header: "border-b border-zinc-200 dark:border-zinc-800 pb-2 font-semibold",
        footer: "border-t border-zinc-200 dark:border-zinc-800 pt-2 font-semibold",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-semibold">
              <h3 className="text-sm font-bold capitalize text-zinc-900 dark:text-zinc-200">
                {t(`${tBase}.title`, { name: food.name })}
              </h3>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {t(`${tBase}.subtitle`)}
              </p>
            </ModalHeader>

            <ModalBody className="py-3 gap-2 font-semibold">
              <div className="flex justify-center w-full my-2">
                <div className="bg-zinc-100 w-full dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-200 dark:border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {t(`${tBase}.calories`)}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-200">
                      {Math.round(foodComponent.calories * ratio)} kcal
                    </span>
                  </div>

                  <hr className="border-zinc-300 dark:border-zinc-800" />

                  <div className="flex flex-row gap-2 items-start w-full">
                    <div className="shrink-0 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px]">
                      <ImageFromURL
                        url={foodComponent.imgUrl}
                        width={90}
                        height={90}
                        macroName={
                          foodComponent.originalName
                            ? foodComponent.originalName
                            : food.name
                        }
                      />
                    </div>

                    <div className="flex-1 h-[90px] sm:h-[120px] flex flex-col justify-between divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
                      {MacroArray.filter((macro) => macro !== "calories").map(
                        (macro) => {
                          const translationKey =
                            macro === "carbohydrates"
                              ? "carbsShort"
                              : `${macro}Short`;
                          const rawValue = foodComponent[
                            macro as keyof Food
                          ] as number;
                          if (rawValue === undefined || rawValue === null) return null;
                          const calculatedValue = (rawValue * ratio).toFixed(1);

                          return (
                            <div
                              key={macro}
                              className={`${MACRO_TAILWIND_THEME[macro].text} flex flex-row justify-between items-center flex-1`}
                            >
                              <span className="text-xs font-extrabold">
                                {t(`${tBase}.${translationKey}`)}
                              </span>
                              <span className="text-zinc-600 dark:text-zinc-300 font-bold text-xs">
                                {calculatedValue}g
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Input
                ref={inputRef}
                type="number"
                label={t(`${tBase}.amountLabel`)}
                placeholder="0"
                value={grams === 0 ? "" : grams.toString()}
                onChange={(e) =>
                  setGrams(Math.max(0, parseFloat(e.target.value) || 0))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave(onClose);
                  }
                }}
                endContent={<span className="text-zinc-500 text-sm">g</span>}
                variant="bordered"
                autoFocus
                min={1}
                classNames={{
                  inputWrapper:
                    "font-semibold border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-zinc-500 dark:focus-within:!border-zinc-400",
                  label: "text-zinc-500 dark:text-zinc-400",
                }}
              />
            </ModalBody>

            <ModalFooter className="p-2">
              <Button
                size="sm"
                variant="flat"
                className="bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                isDisabled={isSaving}
                onPress={() => setTimeout(() => onClose(), 10)}
              >
                {t(`${tBase}.cancel`)}
              </Button>
              <Button
                size="sm"
                color="primary"
                className="bg-blue-600 text-white font-medium"
                isLoading={isSaving}
                isDisabled={isSaving}
                onPressStart={() => handleSave(onClose)}
              >
                {t(`${tBase}.saveChanges`)}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FoodRecordModal;
