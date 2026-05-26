"use client";

import { Spinner, useDisclosure } from "@nextui-org/react";

import { useSession } from "next-auth/react";
import useLoadSavedFood from "@/hooks/useLoadSavedFood";
import { ModalFindFood } from "@/components/Findfood/components/ModalFindFood";
import NavigationYourIntake from "./components/NavigationYourIntake";
import { ModalBarcodeScan } from "@/components/Findfood/components/ModalBarcodeScan";
import { ModalCreateFood } from "@/components/Findfood/components/ModalCreateFood";

export default function Food() {
  const { data } = useSession();
  const { isFetched } = useLoadSavedFood(data?.user?.id);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isOpenNewFood,
    onOpen: onOpenNewFood,
    onOpenChange: onOpenChangeNewFood,
  } = useDisclosure();
  const {
    isOpen: QRisOpen,
    onOpen: QRonOpen,
    onOpenChange: QRonOpenChange,
    onClose: QRonClose,
  } = useDisclosure();

  const closeAllModals = () => {
    QRonClose();
    onClose();
    QRonClose();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-11">
      {isFetched && data?.user?.id ? (
        <NavigationYourIntake onOpen={onOpen} onOpenQR={QRonOpen} />
      ) : data?.user?.id ? (
        <Spinner className=" m-2 self-center" size="lg" />
      ) : (
        <h1>Register or login!</h1>
      )}
      <ModalFindFood
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      ></ModalFindFood>
      <ModalBarcodeScan
        isOpen={QRisOpen}
        onOpenChange={QRonOpenChange}
        onClose={QRonClose}
        onOpenNewFood={onOpenNewFood}
        onCloseAll={closeAllModals}
      ></ModalBarcodeScan>
      <ModalCreateFood
        isOpen={isOpenNewFood}
        onOpenChange={onOpenChangeNewFood}
        onCloseAll={closeAllModals}
      ></ModalCreateFood>
    </main>
  );
}
