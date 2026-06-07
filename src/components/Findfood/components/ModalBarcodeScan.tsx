import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Image,
  Spinner,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import React, { Dispatch, useEffect } from "react";
import { useState } from "react";

import { Food } from "@/types/Types";
import {
  IScannerError,
  Scanner,
  prepareZXingModule,
} from "@yudiel/react-qr-scanner";
import { useScanProduct } from "./useScanProduct";
import { FoodClass } from "@/models/Food";
import { useDispatch } from "react-redux";
import { setNewFoodBarCode } from "@/features/savedFoodslice/yourIntakeSlice";
import { getTimeOfDay } from "@/app/[lng]/constants/FunctionsHelper";

type props = {
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  timeOfDay?: "breakfast" | "lunch" | "dinner";
  onClose?: () => void;
  onOpenNewFood: () => void;
  onCloseAll: () => void;
};

const onError = (
  error: IScannerError,
  setError: Dispatch<React.SetStateAction<string>>,
) => {
  switch (error.kind) {
    case "permission-denied":
      setError("Camera permission was denied.");
      break;
    case "no-camera":
      setError("No camera was found on this device.");
      break;
    case "in-use":
      setError("Camera is already in use by another application.");
      break;
    case "unsupported":
      setError("This browser does not support camera access.");
      break;
    default:
      setError(
        "An error occurred while accessing the camera: " + error.message,
      );
  }
};
export const ModalBarcodeScan = (props: props) => {
  const dispatch = useDispatch();
  const [isErrorScan, setISErrorScan] = useState("");

  prepareZXingModule({ fireImmediately: true });

  const { addToFoodObject } = useYourIntakeOperations();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { mutate: scanProduct, isPending, data } = useScanProduct(onOpen);

  const handleYes = () => {
    onOpenChange();
    props.onOpenNewFood();
  };

  const handleScan = async (detectedCodes: any) => {
    if (!detectedCodes || detectedCodes.length === 0) return;
    if (isPending) return;

    const rawValue = detectedCodes[0]?.rawValue;
    if (!rawValue) return;

    dispatch(setNewFoodBarCode(rawValue));

    await scanProduct(rawValue);
  };

  const ua = navigator.userAgent;
  const isChromeMobile = /Chrome/i.test(ua) && /Android|iPhone|iPad/i.test(ua);

  useEffect(() => {
    if (data) {
      if (!data.name) {
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
      props.onCloseAll && props.onCloseAll();
    }
  }, [data]);

  return (
    <>
      <Modal
        placement="top"
        hideCloseButton
        onOpenChange={props.onOpenChange}
        size="lg"
        classNames={{
          base: "max-sm:w-full max-sm:h-full max-sm:max-w-full max-sm:max-h-full max-sm:m-0 max-sm:rounded-none",
        }}
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
                    onError={(error: IScannerError) =>
                      onError(error, setISErrorScan)
                    }
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
                  {isPending ? (
                    <>
                      <p>
                        We detected a barcode, please wait until your food is
                        loaded.
                      </p>
                      <Spinner />
                    </>
                  ) : (
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                        Position the barcode inside the frame
                      </h4>
                      {isChromeMobile && (
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          For chrome users: try to press zoom buttons while
                          scanning if you have trouble with detection. Chrome's
                          built-in scanner is very buggy, but this usually
                          helps.
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                        We'll automatically fetch the macros. If the product
                        isn't found, you can add it manually.
                      </p>
                    </div>
                  )}
                  {isErrorScan && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {isErrorScan}
                    </p>
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add new food
              </ModalHeader>
              <ModalBody>
                <p>
                  The barcode you scanned was not found. Would you like to add
                  it manually?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleYes();
                  }}
                >
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
