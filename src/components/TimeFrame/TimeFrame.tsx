"use client";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Tooltip,
  Image,
} from "@nextui-org/react";

import { FaPlusCircle, FaTimes } from "react-icons/fa";

import { useDisclosure } from "@nextui-org/react";

import { ModalTimeFrame } from "./components/ModalTimeFrame";
import { useYourIntakeContext } from "@/hooks/YourIntakeContext";

type Food = {
  timeOfDay: "breakfast" | "lunch" | "dinner";
};

const FindFood = (props: Food) => {
  //when this state changes, we sent data to server
  const { savedFood, removeFromSavedFood } = useYourIntakeContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card className="max-w-[500px] min-w-[400px] p-2 mt-5">
      <CardHeader className="flex flex-row items-center bg-zinc-900">
        <div className="flex-1 mr-2">
          <h1>{props.timeOfDay}</h1>
        </div>

        <Button className="self-end" onPress={onOpen} isIconOnly>
          <FaPlusCircle />
        </Button>
      </CardHeader>
      <CardBody className="flex-col">
        {savedFood[props.timeOfDay].length !== 0 && (
          <div>
            {savedFood[props.timeOfDay].map((key) => (
              <div
                className="flex flex-row items-center text-end min-h-[50px]"
                key={key.id}
              >
                {" "}
                <Tooltip
                  content={
                    <Image
                      alt="nextui logo"
                      height={100}
                      radius="sm"
                      src={
                        "https://www.themealdb.com/images/ingredients/" +
                        key.name +
                        ".png"
                      }
                      width={100}
                    />
                  }
                >
                  <p>{key.name}</p>
                </Tooltip>
                <div className="flex-1 mr-3">
                  <p className="text-base">{key.calories} Kcal</p>
                  <p className="text-sm">({key.amount} grams)</p>
                </div>
                <div className="flex self-center self-end">
                  <Button
                    size="sm"
                    onPress={() => {
                      removeFromSavedFood(key.id, props.timeOfDay);
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
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          timeOfDay={props.timeOfDay}
        ></ModalTimeFrame>
      </CardBody>
    </Card>
  );
};

export default FindFood;
