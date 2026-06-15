import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ButtonGroup,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";
import { ModalBarcodeScan } from "./ModalBarcodeScan";

import { useT } from "next-i18next/client";
import { ModalTakePicture } from "@/app/[lng]/dashboard/DashboardContent/components/ModalTakePicture/ModalTakePicture";

type props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;

  timeOfDay: "breakfast" | "lunch" | "dinner";
};

export const ModalScanFood = ({ isOpen, onOpenChange, timeOfDay }: props) => {
  const { t } = useT("dashboard");
  const { onClose } = useDisclosure();
  const {
    isOpen: isOpenBarCode,
    onOpen: onOpenBarCode,
    onOpenChange: onOpenChangeBarCode,
    onClose: onCloseBarCode,
  } = useDisclosure();
  const {
    isOpen: isOpenNewFood,
    onOpen: onOpenNewFood,
    onOpenChange: onOpenChangeNewFood,
    onClose: onCloseNewFood,
  } = useDisclosure();
  const {
    isOpen: isOpenAI,
    onOpen: onOpenAI,
    onOpenChange: onOpenChangeAI,
  } = useDisclosure();

  const closeAllModals = () => {
    onCloseBarCode();
    onOpenChangeAI();
    onCloseNewFood();
    onClose();
  };
  const isAnyChildOpen = isOpenBarCode || isOpenAI || isOpenNewFood;
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        placement="center"
        backdrop="blur"
        isDismissable={!isAnyChildOpen}
        isKeyboardDismissDisabled={isAnyChildOpen}
        classNames={{
          base: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 max-w-md font-semibold",
          header:
            "border-b border-zinc-200 dark:border-zinc-800 pb-2 font-semibold",
          footer:
            "border-t border-zinc-200 dark:border-zinc-800 pt-2 font-semibold",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-semibold">
                <h3 className="text-lg font-bold capitalize text-zinc-900 dark:text-zinc-200">
                  {t("modalScanFood.title")}
                </h3>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {t("modalScanFood.subtitle")}
                </p>
              </ModalHeader>
              <ModalBody className="font-semibold">
                <div className="w-full p-3 bg-warning-200 dark:bg-warning-900/20 rounded-lg">
                  <p className="text-xs font-semibold leading-relaxed text-warning-800 dark:text-warning-500">
                    <span className="font-bold">
                      {t("modalScanFood.disclaimerTitle")}
                    </span>{" "}
                    {t("modalScanFood.disclaimerText")}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="flex-col px-6 py-4 border-t border-zinc-100 dark:border-zinc-800">
                <ButtonGroup
                  className="w-full shadow-sm"
                  color="primary"
                  size="lg"
                >
                  <Button className="w-1/2 font-bold" onPress={onOpenBarCode}>
                    {t("modalScanFood.scanBarcodeBtn")}
                  </Button>
                  <Button onPress={onOpenChangeAI} className="w-1/2  font-bold">
                    {t("modalScanFood.useAIBtn")}
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ModalBarcodeScan
        onOpenChange={onOpenChangeBarCode}
        isOpen={isOpenBarCode}
        onOpenNewFood={onOpenNewFood}
        onClose={onCloseBarCode}
        onCloseAll={closeAllModals}
      />
      <ModalTakePicture
        onOpenChange={onOpenChangeAI}
        isOpen={isOpenAI}
        onOpenNewFood={onOpenNewFood}
        onClose={onCloseBarCode}
        onCloseAll={closeAllModals}
      />
    </>
  );
};
