import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { Food } from "@/types/Types";
import { useT } from "next-i18next/client";

type props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  food: Food | undefined;
  timeOfDay: "breakfast" | "lunch" | "dinner";
};

export const NewFoodRecordModal = ({
  isOpen,
  onOpenChange,
  food,
  timeOfDay,
}: props) => {
  const [grams, setGrams] = useState<number>(100);
  const { addToFoodObject } = useYourIntakeOperations();
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
      protein: Number((food.protein * ratio).toFixed(1)),
      carbohydrates: Number((food.carbohydrates * ratio).toFixed(1)),
      fat: Number((food.fat * ratio).toFixed(1)),
      sugar: Number((food.sugar * ratio).toFixed(1)),
      fiber: Number((food.fiber * ratio).toFixed(1)),
      salt: Number((food.salt * ratio).toFixed(1)),
    };
    addToFoodObject(updatedFood, timeOfDay);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        base: "bg-zinc-900 border border-zinc-800 text-zinc-100 max-w-md mx-4",
        header: "border-b border-zinc-800 pb-3",
        footer: "border-t border-zinc-800 pt-3",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-lg font-bold capitalize text-zinc-200">
                {t("newFoodModal.title", { name: food.name })}
              </h3>
              <p className="text-xs font-normal text-zinc-400">
                {t("newFoodModal.subtitle")}
              </p>
            </ModalHeader>

            <ModalBody className="py-4 gap-4">
              <Input
                type="number"
                label={t("newFoodModal.amountLabel")}
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
                    "border-zinc-700 hover:border-zinc-500 focus-within:!border-zinc-400",
                  label: "text-zinc-400",
                }}
              />

              <div className="bg-zinc-950/50 p-3 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    {t("newFoodModal.calories")}
                  </span>
                  <span className="font-bold text-zinc-200">
                    {Math.round(food.calories * ratio)} kcal
                  </span>
                </div>

                <hr className="border-zinc-800" />

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <div className="text-success-400">
                    {t("newFoodModal.proteinShort")}:{" "}
                    <span className="text-zinc-300 font-medium">
                      {(food.protein * ratio).toFixed(1)}g
                    </span>
                  </div>
                  <div className="text-warning-400">
                    {t("newFoodModal.carbsShort")}:{" "}
                    <span className="text-zinc-300 font-medium">
                      {(food.carbohydrates * ratio).toFixed(1)}g
                    </span>
                  </div>
                  <div className="text-pink-400">
                    {t("newFoodModal.fatShort")}:{" "}
                    <span className="text-zinc-300 font-medium">
                      {(food.fat * ratio).toFixed(1)}g
                    </span>
                  </div>

                  <div className="text-purple-400">
                    {t("newFoodModal.sugarShort")}:{" "}
                    <span className="text-zinc-300 font-medium">
                      {(food.sugar * ratio).toFixed(1)}g
                    </span>
                  </div>
                  <div className="text-violet-400">
                    {t("newFoodModal.sugarShort")}:{" "}
                    <span className="text-zinc-300 font-medium">
                      {(food.fiber * ratio).toFixed(1)}g
                    </span>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                size="sm"
                variant="flat"
                className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                // FIX 1: Defer the close event to prevent click fall-through
                onPress={() => setTimeout(() => onClose(), 10)}
              >
                {t("newFoodModal.cancel")}
              </Button>
              <Button
                size="sm"
                color="primary"
                className="bg-blue-600 text-white font-medium"
                onPress={() => handleSave(onClose)}
              >
                {t("newFoodModal.saveChanges")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
