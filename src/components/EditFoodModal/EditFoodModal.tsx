import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
} from "@nextui-org/react";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { Food } from "@/types/Types";
import { useT } from "next-i18next/client";
import {
  MACRO_TAILWIND_THEME,
  MacroArray,
} from "@/app/[lng]/constants/MacrosHelper";
import ImageFromURL from "../ImageFromURL/ImageFromURL";

interface EditFoodModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  food: Food | null; // Pass null if no food is selected yet
  timeOfDay: "breakfast" | "lunch" | "dinner";
}

export const EditFoodModal = ({
  isOpen,
  onOpenChange,
  food,
  timeOfDay,
}: EditFoodModalProps) => {
  const [grams, setGrams] = useState<number>(100);
  const { updateFood } = useYourIntakeOperations();
  const { t } = useT("dashboard");

  useEffect(() => {
    if (food) {
      const initialGrams = parseFloat(food.amount) || 100;
      setGrams(initialGrams);
    }
  }, [food, isOpen]);

  if (!food) return null;

  const initialGrams = parseFloat(food.amount) || 100;
  const ratio = grams / (initialGrams || 1);

  const handleSave = (onClose: () => void) => {
    const updatedFood: Food = {
      ...food,
      amount: `${grams}`,
      calories: Math.round(food.calories * ratio),
      protein: Number(food.protein * ratio),
      carbohydrates: Number(food.carbohydrates * ratio),
      fat: Number(food.fat * ratio),
      sugar: Number(food.sugar * ratio),
      fiber: Number(food.fiber * ratio),
      salt: Number(food.salt * ratio),
    };
    updateFood(updatedFood, timeOfDay);
    onClose();
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
                {t("editFoodModal.title", { name: food.name })}
              </h3>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {t("editFoodModal.subtitle")}
              </p>
            </ModalHeader>

            <ModalBody className="py-3 gap-2 font-semibold">
              <div className="flex justify-center w-full my-2">
                <div className="bg-zinc-100 w-full dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-200 dark:border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {t("editFoodModal.calories")}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-200">
                      {Math.round(food.calories * ratio)} kcal
                    </span>
                  </div>

                  <hr className="border-zinc-300 dark:border-zinc-800" />

                  <div className="flex flex-row gap-2 items-start w-full">
                    <div className="shrink-0 w-[120px] h-[120px]">
                      <ImageFromURL
                        url={food.imgUrl}
                        width={120}
                        height={120}
                        macroName={food.name}
                      />
                    </div>

                    <div className="flex-1 h-[120px] flex flex-col justify-between divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
                      {MacroArray.filter((macro) => macro !== "calories").map(
                        (macro) => {
                          const translationKey =
                            macro === "carbohydrates"
                              ? "carbsShort"
                              : `${macro}Short`;
                          const rawValue = food[macro as keyof Food] as number;
                          if (macro === "sugar" && !rawValue) return null;
                          const calculatedValue = (rawValue * ratio).toFixed(1);

                          return (
                            <div
                              key={macro}
                              className={`${MACRO_TAILWIND_THEME[macro].text} flex flex-row justify-between items-center flex-1`}
                            >
                              <span className="text-xs font-extrabold">
                                {t(`editFoodModal.${translationKey}`)}
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
                type="number"
                label={t("editFoodModal.amountLabel")}
                placeholder="0"
                value={grams === 0 ? "" : grams.toString()}
                onChange={(e) =>
                  setGrams(Math.max(0, parseFloat(e.target.value) || 0))
                }
                endContent={<span className="text-zinc-500 text-sm">g</span>}
                variant="bordered"
                autoFocus
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
                onPress={() => setTimeout(() => onClose(), 10)}
              >
                {t("editFoodModal.cancel")}
              </Button>
              <Button
                size="sm"
                color="primary"
                className="bg-blue-600 text-white font-medium"
                onPress={() => handleSave(onClose)}
              >
                {t("editFoodModal.saveChanges")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
