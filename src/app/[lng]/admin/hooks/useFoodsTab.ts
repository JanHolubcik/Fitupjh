"use client";

import { useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import { showToast } from "@/utils/toast";
import { ApiResponse } from "@/lib/api-response";

type FoodItem = {
  _id: string;
  name: string;
  protein: number;
  sugar: number;
  fat: number;
  carbohydrates: number;
  salt: number;
  calories_per_100g: number;
  fiber: number;
  QRcode?: string;
  imgUrl?: string;
  ProductWeight?: number;
};

export const useFoodsTab = (t: any) => {
  const { isOpen: isFoodOpen, onOpen: onFoodOpen, onOpenChange: onFoodOpenChange, onClose: onFoodClose } = useDisclosure();
  const { isOpen: isFoodDeleteOpen, onOpen: onFoodDeleteOpen, onOpenChange: onFoodDeleteOpenChange, onClose: onFoodDeleteClose } = useDisclosure();

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [foodSearch, setFoodSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [foodToDelete, setFoodToDelete] = useState<FoodItem | null>(null);
  const [foodDeleteLoading, setFoodDeleteLoading] = useState(false);
  const [foodPage, setFoodPage] = useState(1);
  const [foodTotalPages, setFoodTotalPages] = useState(1);

  const limit = 6;

  const fetchFoods = async () => {
    setFoodsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/food?query=${encodeURIComponent(foodSearch)}&page=${foodPage}&limit=${limit}`
      );
      if (!response.ok) throw new Error();
      const resData = (await response.json()) as ApiResponse<{ foods: FoodItem[]; total: number }>;
      if (resData.data) {
        setFoods(resData.data.foods || []);
        setFoodTotalPages(Math.ceil(resData.data.total / limit) || 1);
      }
    } catch (error) {
      console.error(error);
      showToast.error(t("toasts.fetchError"));
    } finally {
      setFoodsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchFoods, 300);
    return () => clearTimeout(timer);
  }, [foodSearch, foodPage, isFoodOpen]);

  const handleFoodSearchChange = (val: string) => {
    setFoodSearch(val);
    setFoodPage(1);
  };

  const handleFoodCreateClick = () => {
    setSelectedFood(null);
    onFoodOpen();
  };

  const handleFoodEditClick = (food: FoodItem) => {
    setSelectedFood(food);
    onFoodOpen();
  };

  const handleFoodDeleteClick = (food: FoodItem) => {
    setFoodToDelete(food);
    onFoodDeleteOpen();
  };

  const handleFoodSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    const isEdit = !!selectedFood;
    try {
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit ? { id: selectedFood._id, ...values } : values;
      const response = await fetch("/api/admin/food", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error();
      showToast.success(isEdit ? t("toasts.foodUpdateSuccess") : t("toasts.foodCreateSuccess"));
      onFoodClose();
      fetchFoods();
    } catch (error) {
      console.error(error);
      showToast.error(isEdit ? t("toasts.foodUpdateError") : t("toasts.foodCreateError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFoodDeleteSubmit = async () => {
    if (!foodToDelete) return;
    setFoodDeleteLoading(true);
    try {
      const response = await fetch(`/api/admin/food?id=${foodToDelete._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      showToast.success(t("toasts.foodDeleteSuccess"));
      onFoodDeleteClose();
      fetchFoods();
    } catch (error) {
      console.error(error);
      showToast.error(t("toasts.foodDeleteError"));
    } finally {
      setFoodDeleteLoading(false);
    }
  };

  return {
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
  };
};
