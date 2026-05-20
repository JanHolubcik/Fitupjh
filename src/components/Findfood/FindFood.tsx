"use client";
import { Button } from "@nextui-org/react";

import { useDisclosure } from "@nextui-org/react";

import { ModalFindFood } from "./components/ModalFindFood";

import { FaPlusCircle } from "react-icons/fa";

const TimeFrame = () => {
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
