"use client";

import React from "react";
import { useT } from "next-i18next/client";
import {
  Input,
  Button,
  CardBody,
  Spinner,
  Chip,
  Pagination,
} from "@heroui/react";
import { CardUniversal } from "@/components/common";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaBarcode,
} from "react-icons/fa";
import { useFoodsTab } from "../hooks/useFoodsTab";
import { FoodModal } from "./modals/FoodModal";
import { DeleteConfirmationModal } from "./modals/DeleteConfirmationModal";
import ModalCreateFood from "@/components/Findfood/components/ModalCreateFood";

type FoodsTabProps = {
  lng: string;
};

export const FoodsTab = ({ lng }: FoodsTabProps) => {
  const { t } = useT("admin");
  const {
    isFoodOpen,
    onFoodOpenChange,
    onFoodClose,
    isFoodDeleteOpen,
    onFoodDeleteOpenChange,
    onFoodDeleteClose,
    foods,
    foodsLoading,
    foodSearch,
    selectedFood,
    foodToDelete,
    foodDeleteLoading,
    foodPage,
    setFoodPage,
    foodTotalPages,
    handleFoodSearchChange,
    handleFoodCreateClick,
    handleFoodEditClick,
    handleFoodDeleteClick,
    handleFoodSubmit,
    handleFoodDeleteSubmit,
  } = useFoodsTab(t);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          value={foodSearch}
          onChange={(e) => handleFoodSearchChange(e.target.value)}
          placeholder={t("searchFoodPlaceholder")}
          variant="faded"
          startContent={<FaSearch className="text-default-400" />}
          isClearable
          onClear={() => handleFoodSearchChange("")}
          className="max-w-md w-full"
        />
        <Button
          color="primary"
          onPress={handleFoodCreateClick}
          startContent={<FaPlus />}
          className="font-bold shrink-0 w-full sm:w-auto"
        >
          {t("createFoodBtn")}
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {foodsLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Spinner size="lg" />
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-16 text-default-400 text-sm">
            {t("noFoodsFound")}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foods.map((food) => (
                <CardUniversal key={food._id} className="transition-all duration-200">
                  <CardBody className="p-5 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-extrabold text-base text-foreground truncate max-w-[180px]">
                          {food.name}
                        </h3>
                        <Chip
                          size="sm"
                          variant="flat"
                          color="primary"
                          className="font-bold text-[10px] tracking-wide"
                        >
                          {food.calories_per_100g} kcal/100g
                        </Chip>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-zinc-200/50 dark:border-white/5 text-[11px] text-default-500">
                        <div className="flex flex-col">
                          <span className="text-default-400">Carbs</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">{food.carbohydrates}g</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-default-400">Protein</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">{food.protein}g</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-default-400">Fat</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">{food.fat}g</span>
                        </div>
                        <div className="flex flex-col mt-1">
                          <span className="text-default-400">Sugar</span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">{food.sugar}g</span>
                        </div>
                        <div className="flex flex-col mt-1">
                          <span className="text-default-400">Fiber</span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">{food.fiber || 0}g</span>
                        </div>
                        <div className="flex flex-col mt-1">
                          <span className="text-default-400">Salt</span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">{food.salt}g</span>
                        </div>
                      </div>

                      {food.QRcode && (
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-default-400">
                          <FaBarcode className="shrink-0" />
                          <span className="truncate">{food.QRcode}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 w-full">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="font-bold flex-1"
                        startContent={<FaEdit />}
                        onPress={() => handleFoodEditClick(food)}
                      >
                        {t("table.edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="font-bold flex-1"
                        startContent={<FaTrash />}
                        onPress={() => handleFoodDeleteClick(food)}
                      >
                        {t("table.delete")}
                      </Button>
                    </div>
                  </CardBody>
                </CardUniversal>
              ))}
            </div>

            {foodTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  total={foodTotalPages}
                  page={foodPage}
                  onChange={(newPage) => setFoodPage(newPage)}
                  color="primary"
                  variant="flat"
                />
              </div>
            )}
          </>
        )}
      </div>

      {selectedFood ? (
        <FoodModal
          isOpen={isFoodOpen}
          onOpenChange={onFoodOpenChange}
          onClose={onFoodClose}
          selectedFood={selectedFood}
          onSubmit={handleFoodSubmit}
          t={t}
        />
      ) : (
        <ModalCreateFood
          isOpen={isFoodOpen}
          onOpenChange={onFoodOpenChange}
          onCloseAll={onFoodClose}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isFoodDeleteOpen}
        onOpenChange={onFoodDeleteOpenChange}
        title={t("deleteFoodModal.title")}
        confirmText={t("deleteFoodModal.confirmText", { name: foodToDelete?.name })}
        cancelBtnText={t("deleteFoodModal.cancelBtn")}
        confirmBtnText={t("deleteFoodModal.confirmBtn")}
        isLoading={foodDeleteLoading}
        onConfirm={handleFoodDeleteSubmit}
        onClose={onFoodDeleteClose}
      />
    </div>
  );
};
