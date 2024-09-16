"use client";
import { Card, CardHeader, CardBody, Button, Input } from "@nextui-org/react";
import { SetStateAction, useState } from "react";
import {
  FaCross,
  FaMinus,
  FaMinusCircle,
  FaPlusCircle,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { FlattenMaps, ObjectId, Types } from "mongoose";
import { FoodClass } from "@/models/Food";
import { ModalTimeFrame } from "./components/ModalTimeFrame";

type ReturnTypeFood =
  | (FlattenMaps<FoodClass> &
      Required<{
        _id: string | Types.ObjectId;
      }>)[]
  | undefined;

type Food = {
  timeOfDay: string;
  findInDatabase: (searchValue: string) => Promise<
    | {
        food: ReturnTypeFood;
        error?: undefined;
      }
    | {
        error: unknown;
        food?: undefined;
      }
  >;
};

type foodType = {
  id: number;
  name: string;
  calories: number;
  amount: string;
}[];

const TimeFrame = (props: Food) => {
  //when this state changes, we sent data to server
  const [savedFood, setSavedFood] = useState<foodType>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const removeFromSavedFood = (id: number) => {
    setSavedFood((prevState) => {
      const newState = prevState.filter((food) => {
        return food.id !== id;
      });

      return newState;
    });
  };

  const sumCalories = savedFood.reduce(
    (accumulator, { calories }) => accumulator + calories,
    0
  );
  return (
    <Card className="max-w-[500px] min-w-[400px] p-2 mt-5">
      <CardHeader className="flex flex-row items-center bg-zinc-900">
        <div className="flex-1 mr-2">
          <h1>{props.timeOfDay}</h1>
        </div>
        {savedFood.length !== 0 && (
          <p className="mr-1">{sumCalories + " Kcal"} </p>
        )}

        <Button className="self-end" onPress={onOpen} isIconOnly>
          <FaPlusCircle />
        </Button>
      </CardHeader>
      <CardBody className="flex-col">
        {savedFood.length !== 0 && (
          <div>
            {savedFood.map((key) => (
              <div
                className="flex flex-row items-center text-end min-h-[50px]"
                key={key.id}
              >
                <p>{key.name}</p>

                <div className="flex-1 mr-3">
                  <p className="text-base">{key.calories} Kcal</p>
                  <p className="text-sm">({key.amount} grams)</p>
                </div>
                <div className="flex self-center self-end">
                  <Button
                    size="sm"
                    onPress={() => {
                      removeFromSavedFood(key.id);
                    }}
                    isIconOnly
                  >
                    <FaTimes />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ModalTimeFrame
          findInDatabase={props.findInDatabase}
          setSavedFood={setSavedFood}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        ></ModalTimeFrame>
      </CardBody>
    </Card>
  );
};

export default TimeFrame;
