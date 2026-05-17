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

import { ModalFindFood } from "../Findfood/components/ModalFindFood";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";

type Food = {
  timeOfDay: "breakfast" | "lunch" | "dinner";
};

const FindFood = (props: Food) => {
  //when this state changes, we sent data to server
  const { savedFood, removeFromSavedFood } = useYourIntakeOperations();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card className="w-full max-w-[500px] min-w-[320px] sm:min-w-[400px] p-1 mt-5 bg-zinc-900/40 border border-white/5 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between bg-zinc-900/80 p-3 rounded-t-xl border-b border-white/5">
        <div>
          <h1 className="text-lg font-bold text-white capitalize tracking-wide">
            {props.timeOfDay}
          </h1>
        </div>

        <Button
          onPress={onOpen}
          isIconOnly
          radius="full"
          variant="light"
          className="bg-none ca"
        >
          <FaPlusCircle size={20} />
        </Button>
      </CardHeader>

      <CardBody className="flex-col gap-1 p-3">
        {savedFood[props.timeOfDay].length !== 0 ? (
          <div className="flex flex-col">
            {savedFood[props.timeOfDay].map((key) => (
              <div
                className="flex flex-row items-center gap-3 p-2 min-h-[65px] border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] rounded-lg transition-colors"
                key={key.id}
              >
                <div className="flex-shrink-0">
                  <Image
                    alt={key.name}
                    height={42}
                    width={42}
                    radius="md"
                    src={`https://www.themealdb.com/images/ingredients/${key.name}.png`}
                    className="object-contain bg-zinc-955 p-0.5"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <p className="font-semibold text-sm sm:text-base text-white truncate capitalize leading-tight">
                    {key.name}
                  </p>

                  <div className="flex flex-row items-center gap-1.5 text-[11px] font-medium mt-0.5 flex-wrap">
                    <span className="text-success">P: {key.protein || 0}g</span>
                    <span className="text-zinc-700">|</span>
                    <span className="text-warning">
                      C: {key.carbohydrates || 0}g
                    </span>
                    <span className="text-zinc-700">|</span>
                    <span className="text-pink-500">F: {key.fat || 0}g</span>
                    <span className="text-zinc-700">|</span>
                    <span className="text-purple-400">
                      S: {key.sugar || 0}g
                    </span>
                  </div>
                </div>

                <div className="text-end shrink-0">
                  <p className="text-sm sm:text-base font-bold text-primary-400">
                    {key.calories}{" "}
                    <span className="text-xs font-normal text-default-400">
                      kcal
                    </span>
                  </p>
                  <p className="text-xs text-default-400">{key.amount}g</p>
                </div>

                <div className="flex items-center justify-center pl-1">
                  <Button
                    size="sm"
                    onPress={() => removeFromSavedFood(key.id, props.timeOfDay)}
                    isIconOnly
                    radius="md"
                    variant="light"
                    className="w-8 h-8 min-w-8 text-default-400 hover:text-danger hover:bg-danger/10 transition-all"
                  >
                    <FaTimes size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-xs text-default-400">
              No food logged for this meal segment
            </p>
          </div>
        )}

        <ModalFindFood
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          timeOfDay={props.timeOfDay}
        />
      </CardBody>
    </Card>
  );
};

export default FindFood;
