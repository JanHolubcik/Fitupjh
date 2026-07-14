"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { Formik, Form } from "formik";

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

type FoodModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  selectedFood: FoodItem | null;
  onSubmit: (values: any, helpers: any) => Promise<void>;
  t: (key: string) => string;
};

export const FoodModal = ({
  isOpen,
  onOpenChange,
  onClose,
  selectedFood,
  onSubmit,
  t,
}: FoodModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center" size="md">
      <ModalContent>
        {(modalClose) => (
          <Formik
            initialValues={{
              name: selectedFood?.name || "",
              calories_per_100g: selectedFood?.calories_per_100g || 0,
              protein: selectedFood?.protein || 0,
              carbohydrates: selectedFood?.carbohydrates || 0,
              fat: selectedFood?.fat || 0,
              sugar: selectedFood?.sugar || 0,
              fiber: selectedFood?.fiber || 0,
              salt: selectedFood?.salt || 0,
              barcode: selectedFood?.QRcode || "",
              ProductWeight: selectedFood?.ProductWeight || 0,
              imgUrl: selectedFood?.imgUrl || "",
            }}
            validate={(values) => {
              const errors: Record<string, string> = {};
              if (!values.name.trim()) {
                errors.name = t("foodModal.nameRequired") || "Name is required";
              }
              if (Number(values.calories_per_100g) <= 0) {
                errors.calories_per_100g = t("foodModal.caloriesRequired") || "Calories must be > 0";
              }
              return errors;
            }}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
              <Form className="w-full">
                <ModalHeader className="flex flex-col gap-1">
                  {selectedFood ? t("foodModal.editTitle") : t("foodModal.createTitle")}
                </ModalHeader>
                <ModalBody className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
                  <Input
                    name="name"
                    label={t("foodModal.nameLabel")}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="faded"
                    isDisabled={isSubmitting}
                    isInvalid={touched.name && !!errors.name}
                    errorMessage={touched.name && errors.name}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="calories_per_100g"
                      label={t("foodModal.caloriesLabel")}
                      type="number"
                      value={String(values.calories_per_100g)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                      isInvalid={touched.calories_per_100g && !!errors.calories_per_100g}
                      errorMessage={touched.calories_per_100g && errors.calories_per_100g}
                    />
                    <Input
                      name="ProductWeight"
                      label={t("foodModal.weightLabel")}
                      type="number"
                      value={String(values.ProductWeight)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      name="protein"
                      label={t("foodModal.proteinLabel")}
                      type="number"
                      value={String(values.protein)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                    />
                    <Input
                      name="carbohydrates"
                      label={t("foodModal.carbsLabel")}
                      type="number"
                      value={String(values.carbohydrates)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                    />
                    <Input
                      name="fat"
                      label={t("foodModal.fatLabel")}
                      type="number"
                      value={String(values.fat)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      name="sugar"
                      label={t("foodModal.sugarLabel")}
                      type="number"
                      value={String(values.sugar)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                    />
                    <Input
                      name="fiber"
                      label={t("foodModal.fiberLabel")}
                      type="number"
                      value={String(values.fiber)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                    />
                    <Input
                      name="salt"
                      label={t("foodModal.saltLabel")}
                      type="number"
                      value={String(values.salt)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="faded"
                      isDisabled={isSubmitting}
                    />
                  </div>

                  <Input
                    name="barcode"
                    label={t("foodModal.barcodeLabel")}
                    value={values.barcode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="faded"
                    isDisabled={isSubmitting}
                  />

                  <Input
                    name="imgUrl"
                    label={t("foodModal.imgUrlLabel")}
                    value={values.imgUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="faded"
                    isDisabled={isSubmitting}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={modalClose} isDisabled={isSubmitting}>
                    {t("foodModal.cancel")}
                  </Button>
                  <Button color="primary" type="submit" className="font-bold" isLoading={isSubmitting}>
                    {t("foodModal.save")}
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        )}
      </ModalContent>
    </Modal>
  );
};
