import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Image,
} from "@nextui-org/react";
import React, { Dispatch, useEffect } from "react";
import { useState } from "react";

import { Food } from "@/types/Types";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useScanProduct } from "./useScanProduct";
import { FoodClass } from "@/models/Food";

type props = {
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  timeOfDay?: "breakfast" | "lunch" | "dinner";
  onClose?: () => void;
};

type timeOfDay = "breakfast" | "lunch" | "dinner";



export const ModalQRScan = (props: props) => {
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

useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      const isChromeMobile = /Chrome/i.test(ua) && /Android|iPhone|iPad/i.test(ua);

      if (isChromeMobile) {
        try {
          // Force redefine the property to bypass Chrome's write-protections
          Object.defineProperty(window, 'BarcodeDetector', {
            value: undefined,
            writable: true,
            configurable: true
          });
          console.log("Successfully tricked Chrome into using the software polyfill.");
        } catch (error) {
          console.error("Failed to intercept BarcodeDetector:", error);
        }
      }
    }
  }, []);
  
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
              </div>

              <div className="flex flex-col items-center text-center gap-3 bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl">
                <Image
                  className="object-contain animate-pulse-slow"
                  alt="Info Owl"
                  src="eplaining_owl.png"
                  width={120}
                  height={80}
                />

                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                    Position the barcode inside the frame
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                    We'll automatically fetch the macros. If the product isn't
                    found, you can add it manually.
                  </p>
                </div>
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
