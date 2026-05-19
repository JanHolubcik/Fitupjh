import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Image,
  Spinner,
} from "@nextui-org/react";
import React, { Dispatch, useEffect } from "react";
import { useState } from "react";

import { Food } from "@/types/Types";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useScanProduct } from "./useScanProduct";
import { FoodClass } from "@/models/Food";
import { ChromeSafeScanner } from "@/components/ChromeSafeScanner/ChromeSafeScanner";

type props = {
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  timeOfDay?: "breakfast" | "lunch" | "dinner";
  onClose?: () => void;
};

type timeOfDay = "breakfast" | "lunch" | "dinner";

export const ModalBarcodeScan = (props: props) => {
  const { addToFoodObject } = useYourIntakeOperations();

  const { mutate: scanProduct, isPending, error, data } = useScanProduct();

  const getTimeOfDay = () => {
    const now = new Date();
    const hour = now.getHours();

    switch (true) {
      case hour >= 0 && hour < 8:
        return "breakfast";

      case hour >= 8 && hour < 16:
        return "lunch";

      case hour >= 16 && hour < 24:
        return "dinner";

      default:
        return "lunch";
    }
  };

  const handleScan = async (detectedCodes: any) => {
    if (!detectedCodes || detectedCodes.length === 0) return;
    if (isPending) return;

    const rawValue = detectedCodes[0]?.rawValue;
    console.log("Detected barcode(s):", detectedCodes);

    if (!rawValue) {
      console.warn("Detected barcode has no rawValue", detectedCodes);
      return;
    }

    try {
      await scanProduct(rawValue);
    } catch (error) {
      console.error("Failed to scan and parse product:", error);
    }
  };

  const handleScanChrome = async (detectedCode: any) => {
    if (!detectedCode) return;
    if (isPending) return;

    const rawValue = detectedCode;
    console.log("Detected barcode(s):", detectedCode);

    if (!rawValue) {
      console.warn("Detected barcode has no rawValue", detectedCode);
      return;
    }

    try {
      await scanProduct(rawValue);
    } catch (error) {
      console.error("Failed to scan and parse product:", error);
    }
  };

  const isChromeMobile =
    typeof navigator !== "undefined" &&
    /Chrome/i.test(navigator.userAgent) ;

  useEffect(() => {
    if (data) {
      if (!data) {
        console.error("Product not found");
        return;
      }
      const food = (data as FoodClass) || undefined;

      const weight = food.ProductWeight || 100;
      const multiplier = weight / 100;

      const parsedFood: Food = {
        id: Date.now(),
        name: food.name,
        amount: `${weight}`,
        calories: Math.round(food.calories_per_100g * multiplier),
        fat: Number((food.fat * multiplier).toFixed(1)),
        protein: Number((food.protein * multiplier).toFixed(1)),
        sugar: Number((food.sugar * multiplier).toFixed(1)),
        carbohydrates: Number((food.carbohydrates * multiplier).toFixed(1)),
        fiber: Number((food.fiber * multiplier).toFixed(1)),
        salt: Number((food.salt * multiplier).toFixed(1)),
        imgUrl: food.imgUrl,
      };

      addToFoodObject(parsedFood, props.timeOfDay || getTimeOfDay());
      props.onClose && props.onClose();
    }
  }, [data]);

  return (
    <Modal
      placement="top"
      hideCloseButton
      onOpenChange={props.onOpenChange}
      size="lg"
      scrollBehavior="inside"
      isOpen={props.isOpen}
      motionProps={{
        variants: {
          enter: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1 },
        },
        transition: {
          enter: { duration: 0.15 }, // animate when opening
          exit: { duration: 0 }, // instant close
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="gap-6 py-6 px-6">
              <div className="relative w-full aspect-square max-w-[340px] mx-auto overflow-hidden rounded-2xl dark:border-zinc-800 bg-slate-950 shadow-inner flex items-center justify-center">
                {isChromeMobile ? (
                  <ChromeSafeScanner
                    onScan={handleScanChrome}
                    onError={(e) => console.error("Scanner error:", e)}
                  />
                ) : (
                  <Scanner
                    onScan={handleScan}
                    components={{
                      onOff: true,
                      torch: true,
                      zoom: true,
                      finder: true,
                    }}
                    onError={(error) => console.error("Scanner error:", error)}
                    constraints={{
                      facingMode: "environment",
                      aspectRatio: 1,
                    }}
                    formats={["ean_13", "ean_8", "upc_a"]}
                    scanDelay={800}
                    retryDelay={250}
                  />
                )}
              </div>

              <div className="flex flex-col items-center text-center gap-3 bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl">
                <Image
                  className="object-contain animate-pulse-slow"
                  alt="Info Owl"
                  src="eplaining_owl.png"
                  width={120}
                  height={80}
                />
                {isPending ? (
                  <>
                    <Spinner />
                    <p>
                      We detected a barcode, please wait until your food is
                      loaded.
                    </p>
                  </>
                ) : (
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                      Position the barcode inside the frame
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                      We'll automatically fetch the macros. If the product isn't
                      found, you can add it manually.
                    </p>
                  </div>
                )}
              </div>

              <Button
                variant="solid"
                color="danger"
                onPress={onClose}
                className="w-full max-w-[340px] mx-auto font-medium"
              >
                Cancel Scanning
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
