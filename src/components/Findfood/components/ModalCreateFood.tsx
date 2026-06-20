import { getTimeOfDay } from "@/app/[lng]/constants/FunctionsHelper";
import { setNewFoodBarCode } from "@/features/DashboardSlice/DashboardSlice";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { RootState } from "@/store/store";
import { Food } from "@/types/Types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";

import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useT } from "next-i18next/client";
import { Formik, Form } from "formik";
import { useModalBackButton } from "@/hooks/useModalBackButton";
import { FaBarcode, FaUtensils, FaCamera } from "react-icons/fa";
import imageCompression from "browser-image-compression";
import { useMutation } from "@tanstack/react-query";
import { AddFoodOptions } from "@/lib/queriesOptions/AddFoodOptions";
import { showToast } from "@/utils/toast";

type props = {
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  onCloseAll?: () => void;
};

const ModalCreateFood = (props: props) => {
  useModalBackButton(!!props.isOpen, props.onOpenChange);
  const { addToFoodObject } = useYourIntakeOperations();
  const dispatch = useDispatch();
  const newFoodBarCode = useSelector(
    (state: RootState) => state.savedFood.newFoodBarCode,
  );

  const { t } = useT("dashboard");
  const addFoodMutation = useMutation(AddFoodOptions());

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClassNames = {
    inputWrapper:
      "font-semibold border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-zinc-500 dark:focus-within:!border-zinc-400",
    label: "text-zinc-500 dark:text-zinc-400",
  };

  return (
    <Modal
      placement="top"
      hideCloseButton
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      scrollBehavior="inside"
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
              let uploadedImgUrl = "";

              if (selectedFile) {
                try {
                  const compressedFile = await imageCompression(selectedFile, {
                    maxSizeMB: 0.2,
                    maxWidthOrHeight: 250,
                    useWebWorker: false,
                  });

                  const formData = new FormData();
                  formData.append("file", compressedFile);

                  const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });

                  const data = await response.json().catch(() => ({}));

                  if (data.data?.imageUrl) {
                    uploadedImgUrl = data.data.imageUrl;
                  }
                } catch (error) {
                  console.error("Upload failed", error);
                }
              }

              try {
                const newDbFood = await addFoodMutation.mutateAsync({
                  name: values.name,
                  calories_per_100g: Math.max(
                    1,
                    Number(values.calories_per_100g) || 0,
                  ),
                  protein: Math.max(0, Number(values.protein) || 0),
                  sugar: Math.max(0, Number(values.sugar) || 0),
                  fiber: Math.max(0, Number(values.fiber) || 0),
                  fat: Math.max(0, Number(values.fat) || 0),
                  carbohydrates: Math.max(0, Number(values.carbohydrates) || 0),
                  salt: Math.max(0, Number(values.salt) || 0),
                  barcode: values.barcode || undefined,
                  imgUrl: uploadedImgUrl || undefined,
                });

                // Parse values safely and use Math.max to guarantee no negative numbers
                const parsedFoodData: Food = {
                  id: Date.now(),
                  name: newDbFood.name,
                  calories: newDbFood.calories_per_100g,
                  amount: "100",
                  protein: newDbFood.protein,
                  sugar: newDbFood.sugar,
                  fiber: newDbFood.fiber,
                  fat: newDbFood.fat,
                  carbohydrates: newDbFood.carbohydrates,
                  salt: newDbFood.salt,
                  imgUrl: newDbFood.imgUrl,
                };

                dispatch(setNewFoodBarCode(""));
                addToFoodObject(parsedFoodData, getTimeOfDay());
                showToast.success(t("modalCreateFood.toastSuccess"));

                resetForm();
                setSelectedFile(null);
                setPreviewUrl(null);
                props.onOpenChange();
                if (props.onCloseAll) {
                  props.onCloseAll();
                }
              } catch (err: any) {
                console.error("Failed to add custom food to database", err);
                showToast.error(
                  err?.message || t("modalCreateFood.toastError"),
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, handleChange, handleBlur, isSubmitting }) => (
              <Form className="flex flex-col w-full h-full">
                <ModalHeader className="flex flex-col gap-1 font-semibold">
                  <h3 className="text-sm font-bold capitalize text-zinc-900 dark:text-zinc-200">
                    {t("modalCreateFood.title")}
                  </h3>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {t("modalCreateFood.subtitle")}
                  </p>
                </ModalHeader>

                <ModalBody className="py-3 gap-3 font-semibold">
                  {/* Name and Image upload Row */}
                  <div className="flex gap-3 items-center w-full">
                    <div
                      onClick={() =>
                        !isSubmitting && fileInputRef.current?.click()
                      }
                      className="w-14 h-14 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden shrink-0 bg-zinc-50 dark:bg-zinc-950/20 relative group transition-colors"
                      title={t("modalCreateFood.uploadImage") ?? "Upload Image"}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          className="w-full h-full object-cover"
                          alt="Food Preview"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
                          <FaCamera size={14} />
                          <span className="text-[8px] font-semibold mt-1 select-none">
                            Add pic
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Input
                        label={t("modalCreateFood.foodNameLabel")}
                        name="name"
                        type="text"
                        placeholder={t("modalCreateFood.foodNamePlaceholder")}
                        required
                        value={values.name ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        variant="bordered"
                        startContent={
                          <FaUtensils
                            className="text-zinc-400 mr-1.5 shrink-0"
                            size={14}
                          />
                        }
                        classNames={inputClassNames}
                      />
                    </div>
                  </div>

                  <Input
                    label={t("modalCreateFood.barcodeLabel")}
                    name="barcode"
                    type="number"
                    min={0}
                    placeholder={t("modalCreateFood.barcodePlaceholder")}
                    value={values.barcode?.toString() ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="bordered"
                    startContent={
                      <FaBarcode
                        className="text-zinc-400 mr-1.5 shrink-0"
                        size={14}
                      />
                    }
                    classNames={inputClassNames}
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
                    variant="bordered"
                    endContent={
                      <span className="text-zinc-500 text-sm">kcal</span>
                    }
                    classNames={{
                      inputWrapper:
                        "font-semibold border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-orange-500 dark:focus-within:!border-orange-500",
                      label: "text-zinc-500 dark:text-zinc-400",
                    }}
                  />

                  <div className="grid grid-cols-2 gap-3 mt-1">
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
                      variant="bordered"
                      endContent={
                        <span className="text-zinc-500 text-sm">g</span>
                      }
                      classNames={{
                        inputWrapper:
                          "font-semibold border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-blue-500 dark:focus-within:!border-blue-500",
                        label: "text-zinc-500 dark:text-zinc-400",
                      }}
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
                      variant="bordered"
                      endContent={
                        <span className="text-zinc-500 text-sm">g</span>
                      }
                      classNames={{
                        inputWrapper:
                          "font-semibold border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-amber-500 dark:focus-within:!border-amber-500",
                        label: "text-zinc-500 dark:text-zinc-400",
                      }}
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
                      variant="bordered"
                      endContent={
                        <span className="text-zinc-500 text-sm">g</span>
                      }
                      classNames={{
                        inputWrapper:
                          "font-semibold border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-violet-500 dark:focus-within:!border-violet-500",
                        label: "text-zinc-500 dark:text-zinc-400",
                      }}
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
                      variant="bordered"
                      endContent={
                        <span className="text-zinc-500 text-sm">g</span>
                      }
                      classNames={{
                        inputWrapper:
                          "font-semibold border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-pink-500 dark:focus-within:!border-pink-500",
                        label: "text-zinc-500 dark:text-zinc-400",
                      }}
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
                      variant="bordered"
                      endContent={
                        <span className="text-zinc-500 text-sm">g</span>
                      }
                      classNames={{
                        inputWrapper:
                          "font-semibold border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-emerald-500 dark:focus-within:!border-emerald-500",
                        label: "text-zinc-500 dark:text-zinc-400",
                      }}
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
                      variant="bordered"
                      endContent={
                        <span className="text-zinc-500 text-sm">g</span>
                      }
                      classNames={{
                        inputWrapper:
                          "font-semibold border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 focus-within:!border-slate-500 dark:focus-within:!border-slate-500",
                        label: "text-zinc-500 dark:text-zinc-400",
                      }}
                    />
                  </div>
                </ModalBody>

                <ModalFooter className="p-2">
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    isDisabled={isSubmitting}
                    onPress={() => onClose()}
                  >
                    {t("modalCreateFood.cancelBtn")}
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    className="bg-blue-600 text-white font-medium"
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}
                    type="submit"
                  >
                    {t("modalCreateFood.submitBtn")}
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

export default ModalCreateFood;
