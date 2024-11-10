"use client";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Tooltip,
  Image,
} from "@nextui-org/react";
import { SetStateAction, useState } from "react";
import { FaPlusCircle, FaTimes } from "react-icons/fa";

import { useDisclosure } from "@nextui-org/react";

import { FlattenMaps, ObjectId, Types } from "mongoose";
import { FoodClass } from "@/models/Food";
import { ModalFindFood } from "./components/ModalFindFood";
import { useYourIntakeContext } from "@/hooks/YourIntakeContext";



const TimeFrame = () => {
  //when this state changes, we sent data to server
  const { savedFood, removeFromSavedFood } = useYourIntakeContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
 <>
        <Button className="self-end" onPress={onOpen} isIconOnly>
          <FaPlusCircle />
        </Button>
        <ModalFindFood
        isOpen={isOpen}
        onOpenChange={onOpenChange}        ></ModalFindFood>
</>
  );
};

export default TimeFrame;
