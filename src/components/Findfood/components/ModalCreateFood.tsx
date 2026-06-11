import { getTimeOfDay } from "@/app/[lng]/constants/FunctionsHelper";
import { setNewFoodBarCode } from "@/features/savedFoodslice/yourIntakeSlice";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { RootState } from "@/store/store";
import { Food } from "@/types/Types";
import {
  Modal,
  ModalContent,
  ModalBody,
  Input,
  Button,
} from "@nextui-org/react";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useT } from "next-i18next/client";

type props = {
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  onCloseAll?: () => void;
};

export const ModalCreateFood = (props: props) => {
  const { addToFoodObject } = useYourIntakeOperations();
  const dispatch = useDispatch();
  const newFoodBarCode = useSelector(
    (state: RootState) => state.savedFood.newFoodBarCode,
  );

  // 1. Initialize translation hook with a dedicated namespace
  const { t } = useT("dashboard");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const parsedFoodData: Food = {
      id: Date.now(),
      name: formData.get("name") as string,
      calories: Number(formData.get("calories_per_100g")),
      amount: "100g",
      protein: Number(formData.get("protein")),
      sugar: Number(formData.get("sugar")),
      fiber: Number(formData.get("fiber")),
      fat: Number(formData.get("fat")),
      carbohydrates: Number(formData.get("carbohydrates")),
      salt: Number(formData.get("salt")),
    };
    const res = fetch("/api/food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }).finally(() => {
      dispatch(setNewFoodBarCode(""));
      addToFoodObject(parsedFoodData, getTimeOfDay());
    });

    toast.promise(
      res,
      {
        pending: t("modalCreateFood.toastPending"),
        success: t("modalCreateFood.toastSuccess"),
        error: t("modalCreateFood.toastError"),
      },
      {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      },
    );
    props.onOpenChange();
    props.onCloseAll && props.onCloseAll();
  };

  return (
    <Modal
      placement="top"
      hideCloseButton
      size="lg"
      isOpen={props.isOpen}
      onOpenChange={() => {
        props.onOpenChange();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <p className="m-1 ml-2">
                    {t("modalCreateFood.barcodeLabel")}
                  </p>
                  <Input
                    name="barcode"
                    classNames={{
                      inputWrapper:
                        "transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/50",
                      input: "text-white",
                      label: "text-white",
                    }}
                    type="text"
                    placeholder={t("modalCreateFood.barcodePlaceholder")}
                    value={newFoodBarCode}
                  />
                </div>
                <div>
                  <p className="m-1 ml-2">
                    {t("modalCreateFood.foodNameLabel")}
                  </p>
                  <Input
                    name="name"
                    classNames={{
                      inputWrapper:
                        "transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/50",
                      input: "text-white",
                      label: "text-white",
                    }}
                    type="text"
                    placeholder={t("modalCreateFood.foodNamePlaceholder")}
                    required
                  />
                </div>
                <div>
                  <p className="m-1 ml-2">
                    {t("modalCreateFood.caloriesLabel")}
                  </p>
                  <Input
                    name="calories_per_100g"
                    classNames={{
                      inputWrapper:
                        "transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/50",
                      input: "text-white",
                      label: "text-white",
                    }}
                    type="number"
                    placeholder={t("modalCreateFood.caloriesPlaceholder")}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="m-1 ml-2">
                      {t("modalCreateFood.proteinLabel")}
                    </p>
                    <Input
                      name="protein"
                      type="number"
                      placeholder={t("modalCreateFood.proteinPlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">
                      {t("modalCreateFood.sugarLabel")}
                    </p>
                    <Input
                      name="sugar"
                      type="number"
                      placeholder={t("modalCreateFood.sugarPlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">
                      {t("modalCreateFood.fiberLabel")}
                    </p>
                    <Input
                      name="fiber"
                      type="number"
                      placeholder={t("modalCreateFood.fiberPlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">{t("modalCreateFood.fatLabel")}</p>
                    <Input
                      name="fat"
                      type="number"
                      placeholder={t("modalCreateFood.fatPlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">
                      {t("modalCreateFood.carbsLabel")}
                    </p>
                    <Input
                      name="carbohydrates"
                      type="number"
                      placeholder={t("modalCreateFood.carbsPlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">{t("modalCreateFood.saltLabel")}</p>
                    <Input
                      name="salt"
                      type="number"
                      placeholder={t("modalCreateFood.saltPlaceholder")}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    color="success"
                    className="font-bold flex-1"
                    type="submit"
                  >
                    {t("submitBtn")}
                  </Button>
                  <Button
                    onPress={() => {
                      props.onCloseAll && props.onCloseAll();
                      onClose();
                    }}
                    color="danger"
                    className="font-bold flex-1"
                  >
                    {t("cancelBtn")}
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
