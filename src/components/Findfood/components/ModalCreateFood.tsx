import { getTimeOfDay } from "@/app/[lng]/constants/FunctionsHelper";
import { setNewFoodBarCode } from "@/features/savedFoodslice/yourIntakeSlice";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { RootState } from "@/store/store";
import { Food } from "@/types/Types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@nextui-org/react";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useT } from "next-i18next/client";
import { Formik, Form } from "formik";

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

  const { t } = useT("dashboard");

  return (
    <Modal
      placement="top"
      hideCloseButton
      size="lg"
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <Formik
            enableReinitialize
            initialValues={{
              barcode: newFoodBarCode ?? "",
              name: "",
              calories_per_100g: "",
              protein: "",
              sugar: "",
              fiber: "",
              fat: "",
              carbohydrates: "",
              salt: "",
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              // Parse values safely and use Math.max to guarantee no negative numbers
              const parsedFoodData: Food = {
                id: Date.now(),
                name: values.name,
                calories: Math.max(0, Number(values.calories_per_100g) || 0),
                amount: "100",
                protein: Math.max(0, Number(values.protein) || 0),
                sugar: Math.max(0, Number(values.sugar) || 0),
                fiber: Math.max(0, Number(values.fiber) || 0),
                fat: Math.max(0, Number(values.fat) || 0),
                carbohydrates: Math.max(0, Number(values.carbohydrates) || 0),
                salt: Math.max(0, Number(values.salt) || 0),
              };

              const res = fetch("/api/food", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
                credentials: "include",
              }).finally(() => {
                dispatch(setNewFoodBarCode(""));
                addToFoodObject(parsedFoodData, getTimeOfDay());
                setSubmitting(false);
                resetForm();
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
                  theme: "dark",
                },
              );

              props.onOpenChange();
              if (props.onCloseAll) {
                props.onCloseAll();
              }
            }}
          >
            {({ values, handleChange, handleBlur, isSubmitting }) => (
              <Form className="flex flex-col w-full h-full">
                <ModalHeader className="flex flex-col gap-1">
                  {t("modalCreateFood.title", "Add Custom Food")}
                </ModalHeader>

                <ModalBody className="pb-6">
                  <div className="flex flex-col gap-4">
                    <Input
                      label={t("modalCreateFood.barcodeLabel")}
                      name="barcode"
                      type="number"
                      min={0}
                      placeholder={t("modalCreateFood.barcodePlaceholder")}
                      value={values.barcode?.toString() ?? ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <Input
                      label={t("modalCreateFood.foodNameLabel")}
                      name="name"
                      type="text"
                      placeholder={t("modalCreateFood.foodNamePlaceholder")}
                      required
                      value={values.name ?? ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <Input
                      label={t("modalCreateFood.caloriesLabel")}
                      name="calories_per_100g"
                      type="number"
                      min={1}
                      placeholder={t("modalCreateFood.caloriesPlaceholder")}
                      required
                      value={values.calories_per_100g?.toString() ?? ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Input
                        label={t("modalCreateFood.proteinLabel")}
                        name="protein"
                        type="number"
                        min={0}
                        placeholder={t("modalCreateFood.proteinPlaceholder")}
                        required
                        value={values.protein?.toString() ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Input
                        label={t("modalCreateFood.sugarLabel")}
                        name="sugar"
                        type="number"
                        min={0}
                        placeholder={t("modalCreateFood.sugarPlaceholder")}
                        required
                        value={values.sugar?.toString() ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Input
                        label={t("modalCreateFood.fiberLabel")}
                        name="fiber"
                        type="number"
                        min={0}
                        placeholder={t("modalCreateFood.fiberPlaceholder")}
                        required
                        value={values.fiber?.toString() ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Input
                        label={t("modalCreateFood.fatLabel")}
                        name="fat"
                        type="number"
                        min={0}
                        placeholder={t("modalCreateFood.fatPlaceholder")}
                        required
                        value={values.fat?.toString() ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Input
                        label={t("modalCreateFood.carbsLabel")}
                        name="carbohydrates"
                        type="number"
                        min={0}
                        placeholder={t("modalCreateFood.carbsPlaceholder")}
                        required
                        value={values.carbohydrates?.toString() ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Input
                        label={t("modalCreateFood.saltLabel")}
                        name="salt"
                        type="number"
                        min={0}
                        placeholder={t("modalCreateFood.saltPlaceholder")}
                        required
                        value={values.salt?.toString() ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        color="success"
                        className="flex-1"
                        type="submit"
                        isLoading={isSubmitting}
                      >
                        {t("modalCreateFood.submitBtn")}
                      </Button>
                      <Button
                        onPress={() => {
                          if (props.onCloseAll) props.onCloseAll();
                          onClose();
                        }}
                        color="danger"
                        variant="flat"
                        className="flex-1"
                      >
                        {t("modalCreateFood.cancelBtn")}
                      </Button>
                    </div>
                  </div>
                </ModalBody>
              </Form>
            )}
          </Formik>
        )}
      </ModalContent>
    </Modal>
  );
};
