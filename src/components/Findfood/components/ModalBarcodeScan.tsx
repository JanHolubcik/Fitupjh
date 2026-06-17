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
import React, { Dispatch, useEffect, useState } from "react";

import { Food } from "@/types/Types";
import {
  IScannerError,
  Scanner,
  prepareZXingModule,
} from "@yudiel/react-qr-scanner";
import { useScanProduct } from "./useScanProduct";
import { FoodClass } from "@/lib/mongo/models/Food";
import { useDispatch } from "react-redux";
import { setNewFoodBarCode } from "@/features/savedFoodslice/yourIntakeSlice";
import { getTimeOfDay } from "@/app/[lng]/constants/FunctionsHelper";
import { useT } from "next-i18next/client";
import { ModalCreateFood } from "./ModalCreateFood";
import { NewFoodRecordModal } from "@/components/NewFoodRecordModal/NewFoodRecordModal";

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
  t: any,
) => {
  switch (error.kind) {
    case "permission-denied":
      setError(
        t("modalBarcodeScan.cameraDenied", "Camera permission was denied."),
      );
      break;
    case "no-camera":
      setError(
        t("modalBarcodeScan.noCamera", "No camera was found on this device."),
      );
      break;
    case "in-use":
      setError(
        t(
          "modalBarcodeScan.cameraInUse",
          "Camera is already in use by another application.",
        ),
      );
      break;
    case "unsupported":
      setError(
        t(
          "modalBarcodeScan.cameraUnsupported",
          "This browser does not support camera access.",
        ),
      );
      break;
    default:
      setError(
        t(
          "modalBarcodeScan.cameraError",
          "An error occurred while accessing the camera: ",
        ) + error.message,
      );
  }
};

export const ModalBarcodeScan = (props: props) => {
  const dispatch = useDispatch();
  const [selectedFood, setSelectedFood] = useState<Food>();
  const [isErrorScan, setISErrorScan] = useState("");
  const { t } = useT("dashboard");

  prepareZXingModule({ fireImmediately: true });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpenNewRecord, onOpenChange: onOpenChangeNewRecord } =
    useDisclosure();

  const { mutate: scanProduct, isPending, data } = useScanProduct(onOpen);

  const {
    isOpen: isOpenNewFood,
    onOpen: onOpenNewFood,
    onOpenChange: onOpenChangeNewFood,
  } = useDisclosure();

  const handleYes = () => {
    onOpenChange();
    onOpenNewFood();
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
      const originalName = data.originalName;
      const food = (data as FoodClass) || undefined;

      const weight = food.ProductWeight || 100;
      const multiplier = weight / 100;

      const parsedFood: Food = {
        id: Date.now(),
        amount: `${weight}`,
        ...food,
        calories: Math.round(food.calories_per_100g * multiplier),
        fat: Number(food.fat * multiplier),
        protein: Number(food.protein * multiplier),
        sugar: Number(food.sugar * multiplier),
        carbohydrates: Number(food.carbohydrates * multiplier),
        fiber: Number(food.fiber * multiplier),
        salt: Number(food.salt * multiplier),
        originalName: originalName,
      };
      setSelectedFood(parsedFood);
      onOpenChangeNewRecord();
    }
  }, [data]);

  return (
    <>
      <Modal
        placement="top"
        hideCloseButton
        onOpenChange={props.onOpenChange}
        size="lg"
        isOpen={props.isOpen}
        isDismissable={!isOpen}
        isKeyboardDismissDisabled={isOpen}
        classNames={{
          base: "max-sm:w-full max-sm:h-full max-sm:max-w-full max-sm:max-h-full max-sm:m-0 max-sm:rounded-none bg-white dark:bg-zinc-900",
          header:
            "border-b border-zinc-200 dark:border-zinc-800 pb-3 pt-4 px-6",
          body: "py-6 px-6",
          footer: "border-t border-zinc-200 dark:border-zinc-800 py-4 px-6",
        }}
        scrollBehavior="inside"
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
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-200">
                  {t("modalBarcodeScan.title", "Scan Barcode")}
                </h3>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {t(
                    "modalBarcodeScan.subtitle",
                    "Align the barcode within the frame to fetch nutrition macros.",
                  )}
                </p>
              </ModalHeader>

              <ModalBody className="flex flex-col items-center gap-6">
                <div className="relative w-full aspect-square max-w-[340px] overflow-hidden rounded-2xl dark:border-zinc-800 bg-slate-950 shadow-inner flex items-center justify-center">
                  <Scanner
                    onScan={handleScan}
                    components={{
                      onOff: true,
                      torch: true,
                      zoom: true,
                      finder: true,
                    }}
                    onError={(error: IScannerError) =>
                      onError(error, setISErrorScan, t)
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

                <div className="flex flex-col items-center text-center gap-3 w-full max-w-[340px] bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl">
                  <Image
                    className="object-contain animate-pulse-slow"
                    alt="Info Owl"
                    src="../eplaining_owl.png"
                    width={120}
                    height={80}
                  />
                  {isPending ? (
                    <>
                      <p className="text-sm font-medium">
                        {t(
                          "modalBarcodeScan.detectedWait",
                          "We detected a barcode, please wait until your food is loaded.",
                        )}
                      </p>
                      <Spinner />
                    </>
                  ) : (
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                        {t(
                          "modalBarcodeScan.autoFetch",
                          "We'll automatically fetch the macros. If the product isn't found, you can add it manually.",
                        )}
                      </h4>
                      {isChromeMobile && (
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
                          <strong>
                            {t(
                              "modalBarcodeScan.chromeUsers",
                              "For Chrome users:",
                            )}
                          </strong>{" "}
                          {t(
                            "modalBarcodeScan.chromeBug",
                            "Try pressing the zoom buttons while scanning if you have trouble with detection. Chrome's built-in scanner can be buggy, but zooming usually helps.",
                          )}
                        </p>
                      )}
                    </div>
                  )}
                  {isErrorScan && (
                    <p className="text-xs font-medium text-danger-500 mt-2">
                      {isErrorScan}
                    </p>
                  )}
                </div>
              </ModalBody>

              <ModalFooter className="flex justify-center w-full">
                <Button
                  variant="solid"
                  color="danger"
                  size="lg"
                  onPress={props.onClose}
                  className="w-full max-w-[340px] font-bold"
                >
                  {t("modalBarcodeScan.cancelBtn", "Cancel Scanning")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("modalBarcodeScan.addNewFood", "Add new food")}
              </ModalHeader>
              <ModalBody>
                <p>
                  {t(
                    "modalBarcodeScan.notFoundPrompt",
                    "The barcode you scanned was not found. Would you like to add it manually?",
                  )}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("modalBarcodeScan.cancel", "Cancel")}
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleYes();
                  }}
                >
                  {t("modalBarcodeScan.yes", "Yes")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ModalCreateFood
        isOpen={isOpenNewFood}
        onOpenChange={onOpenChangeNewFood}
        onCloseAll={props.onCloseAll}
      />
      <NewFoodRecordModal
        isOpen={isOpenNewRecord}
        onOpenChange={onOpenChangeNewRecord}
        food={selectedFood}
        timeOfDay={props.timeOfDay ?? getTimeOfDay()}
        onCloseAll={props.onCloseAll}
      />
    </>
  );
};
