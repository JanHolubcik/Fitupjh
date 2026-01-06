"use client";
import { Button } from "@nextui-org/react";

import { useDisclosure } from "@nextui-org/react";

import { ModalFindFood } from "./components/ModalFindFood";

import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { FaPlusCircle } from "react-icons/fa";

const TimeFrame = () => {
  //when this state changes, we sent data to server
  const { savedFood, removeFromSavedFood } = useYourIntakeOperations();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button className="self-end" onPress={onOpen} isIconOnly>
        <FaPlusCircle />
      </Button>
      <ModalFindFood isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default TimeFrame;
