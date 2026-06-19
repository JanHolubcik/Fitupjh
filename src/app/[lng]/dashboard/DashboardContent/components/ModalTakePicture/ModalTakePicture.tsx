"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Spinner,
} from "@heroui/react";

import { WebCamera } from "@shivantra/react-web-camera";
import { useMutation } from "@tanstack/react-query";
import { FoodImageAIOptions } from "@/lib/queriesOptions/FoodImageAIOptions";
import { useT } from "next-i18next/client";

import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { getTimeOfDay } from "@/app/[lng]/constants/FunctionsHelper";
import { Food, TimeOfDay } from "@/types/Types";

/**
 * Converts a File object to a Base64 string
 * @param {File} file - The file object from an input element
 * @returns {Promise<string>} - A promise that resolves with the Base64 string
 */
const fileToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Read the file as a Data URL (Base64 string)
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

type props = {
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  timeOfDay?: TimeOfDay;
  onClose?: () => void;
  onOpenNewFood: () => void;
  onCloseAll: () => void;
};

const ModalTakePicture = ({
  isOpen,
  onOpenChange,
  timeOfDay,
  onCloseAll,
}: props) => {
  const cameraRef = useRef<any>(null);
  const { t } = useT("dashboard");

  const { addToFoodObject } = useYourIntakeOperations();

  const [image, setImage] = useState<any | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setIsSaving(false);
      isSavingRef.current = false;
      analyzeImageMutation.reset();
    }
  }, [isOpen]);

  const analyzeImageMutation = useMutation(FoodImageAIOptions());

  const handleCaptureAndAnalyze = async () => {
    if (cameraRef.current) {
      const file = await cameraRef.current.capture();
      const photoBase64 = await fileToBase64(file);
      if (!photoBase64) return;

      setImage(photoBase64);
      setResult(null);
      analyzeImageMutation.reset();

      try {
        const data = await analyzeImageMutation.mutateAsync(
          photoBase64 as string,
        );
        setResult(data);
      } catch (error) {
        console.error("Error sending image for analysis:", error);
      }
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    analyzeImageMutation.reset();
  };

  const handleAddFood = () => {
    if (!result || isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);

    const weight = result.ProductWeight || 100;

    const parsedFood: Food = {
      id: Date.now(),
      name: result.name || "AI Analyzed Food",
      amount: `${weight}`,
      calories: Math.round(result.calories_per_100g || result.calories || 0),
      fat: Number(result.fat || 0),
      protein: Number(result.protein || 0),
      sugar: Number(result.sugar || 0),
      carbohydrates: Number(result.carbohydrates || 0),
      fiber: Number(result.fiber || 0),
      salt: Number(result.salt || 0),
      imgUrl: result.imgUrl || image,
    };

    addToFoodObject(parsedFood, timeOfDay || getTimeOfDay());

    if (onCloseAll) {
      onCloseAll();
    }
  };

  return (
    <Modal
      placement="top"
      hideCloseButton
      size="3xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      classNames={{
        base: "max-sm:w-full max-sm:h-full max-sm:max-w-full max-sm:max-h-full max-sm:m-0 max-sm:rounded-none bg-white dark:bg-zinc-900",
        header: "border-b border-zinc-200 dark:border-zinc-800 pb-3 pt-4 px-6",
        body: "py-6 px-6 max-h-[70vh] overflow-y-auto",
        footer: "border-t border-zinc-200 dark:border-zinc-800 py-4 px-6",
      }}
      scrollBehavior="inside"
      motionProps={{
        variants: {
          enter: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1 },
        },
        transition: {
          enter: { duration: 0.15 },
          exit: { duration: 0 },
        },
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-200">
                {t("takePictureModal.takePictureTitle")}
              </h3>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {!image
                  ? t("takePictureModal.takePictureDesc")
                  : t("takePictureModal.reviewDesc")}
              </p>
            </ModalHeader>
            <ModalBody className="flex flex-col items-center gap-4">
              {!image ? (
                <>
                  <div className="relative w-full max-w-[340px] overflow-hidden rounded-2xl dark:border-zinc-800 bg-slate-950 shadow-inner flex items-center justify-center">
                    <WebCamera
                      ref={cameraRef}
                      style={{
                        width: "100%",
                        height: "auto",
                        padding: 0,
                      }}
                      videoStyle={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                      className="camera-container flex justify-center w-full"
                      videoClassName="camera-video"
                      captureMode="back"
                      getFileName={() => `next-photo-${Date.now()}.jpeg`}
                      onError={(err) => console.error(err)}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Captured"
                    className="rounded-xl shadow-md max-w-[340px] w-full border border-zinc-200 dark:border-zinc-800"
                  />

                  {analyzeImageMutation.isPending && (
                    <div className="flex flex-col items-center gap-3 my-4">
                      <Spinner size="lg" color="primary" />
                      <p className="font-semibold text-zinc-600 dark:text-zinc-300">
                        {t("takePictureModal.analyzing")}
                      </p>
                    </div>
                  )}

                  {analyzeImageMutation.isError && (
                    <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-xl w-full max-w-[340px] border border-red-200 dark:border-red-800 text-center text-sm font-semibold my-4">
                      {analyzeImageMutation.error?.message || "Failed to analyze image"}
                    </div>
                  )}


                  {result && (
                    <div className="bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-xl w-full max-w-[340px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <h3 className="font-bold text-lg mb-3 text-zinc-900 dark:text-zinc-100 capitalize">
                        {result.name || t("takePictureModal.analysisResult")}
                      </h3>
                      <ul className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400">
                        <li className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
                          <span className="font-semibold">
                            {t("takePictureModal.macros.calories")}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {result.calories_per_100g} kcal
                          </span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
                          <span className="font-semibold">
                            {t("takePictureModal.macros.protein")}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {result.protein}g
                          </span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
                          <span className="font-semibold">
                            {t("takePictureModal.macros.carbs")}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {result.carbohydrates}g
                          </span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
                          <span className="font-semibold">
                            {t("takePictureModal.macros.fat")}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {result.fat}g
                          </span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
                          <span className="font-semibold">
                            {t("takePictureModal.macros.sugar")}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {result.sugar}g
                          </span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-1">
                          <span className="font-semibold">
                            {t("takePictureModal.macros.fiber")}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {result.fiber}g
                          </span>
                        </li>
                        <li className="flex justify-between pb-1">
                          <span className="font-semibold">
                            {t("takePictureModal.macros.salt")}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {result.salt}g
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </ModalBody>

            <ModalFooter className="flex-col w-full items-center justify-center gap-2">
              {!image ? (
                <>
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full max-w-[340px] font-bold"
                    onPress={handleCaptureAndAnalyze}
                  >
                    {t("takePictureModal.captureAndAnalyze")}
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    size="lg"
                    className="w-full max-w-[340px] font-bold"
                    onPress={onCloseAll}
                  >
                    {t("takePictureModal.cancel")}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 w-full max-w-[340px]">
                  {result && (
                    <Button
                      color="success"
                      className="w-full text-white font-bold shadow-sm"
                      size="lg"
                      onPress={handleAddFood}
                    >
                      {t("takePictureModal.addToIntake")}
                    </Button>
                  )}

                  <div className="flex gap-2 w-full">
                    <Button
                      className="w-1/2 font-bold"
                      color="primary"
                      variant="flat"
                      onPress={handleReset}
                    >
                      {t("takePictureModal.takeAnother")}
                    </Button>
                    <Button
                      className="w-1/2 font-bold"
                      color="danger"
                      variant="flat"
                      onPress={onCloseAll}
                    >
                      {t("close")}
                    </Button>
                  </div>
                </div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalTakePicture;

