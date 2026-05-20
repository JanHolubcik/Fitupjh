"use client";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";

import { FaPlusCircle, FaTimes } from "react-icons/fa";
import { useDisclosure } from "@nextui-org/react";
import { ModalFindFood } from "../Findfood/components/ModalFindFood";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import ImageFromURL from "../ImageFromURL/ImageFromURL";

type Food = {
  timeOfDay: "breakfast" | "lunch" | "dinner";
};

const FindFood = (props: Food) => {
  const { savedFood, removeFromSavedFood } = useYourIntakeOperations();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card className="w-full max-w-[500px] p-1 mt-5 bg-zinc-900/40 border border-white/5 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between bg-zinc-900/80 p-3 rounded-t-xl border-b border-white/5">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white capitalize tracking-wide">
            {props.timeOfDay}
          </h1>
        </div>

        <Button
          onPress={onOpen}
          isIconOnly
          radius="full"
          variant="light"
          className="text-default-400 hover:text-white"
        >
          <FaPlusCircle size={20} />
        </Button>
      </CardHeader>

      <CardBody className="flex-col gap-1 p-2 sm:p-3">
        {savedFood[props.timeOfDay].length !== 0 ? (
          <div className="flex flex-col gap-1">
            {savedFood[props.timeOfDay].map((key) => (
              <div
                className="flex flex-row items-center gap-3 p-2 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] rounded-lg transition-colors justify-between"
                key={key.id}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 border-r border-white/5 pr-2">
                    <ImageFromURL macroName={key.name} url={key.imgUrl} />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center pr-1">
                    {/* 1. Set a smaller phone size, forced single line, and mandatory bottom spacing zone */}
                    <p className="font-semibold text-[11px] sm:text-sm text-white capitalize leading-tight truncate mb-1 block w-full max-w-full overflow-hidden">
                      {key.name}
                    </p>

                    <div className="flex flex-row items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-medium flex-wrap w-full">
                      <span className="text-success shrink-0">
                        P: {key.protein || 0}g
                      </span>
                      <span className="text-zinc-700">|</span>
                      <span className="text-warning shrink-0">
                        C: {key.carbohydrates || 0}g
                      </span>
                      <span className="text-zinc-700">|</span>
                      <span className="text-pink-500 shrink-0">
                        F: {key.fat || 0}g
                      </span>
                      <span className="text-zinc-700">|</span>
                      <span className="text-purple-400 shrink-0">
                        S: {key.sugar || 0}g
                      </span>

                      <span className="bg-primary/20 text-primary-400 px-1.5 py-0.5 rounded font-bold whitespace-nowrap shrink-0 text-[9px] sm:text-[10px]">
                        {key.calories} kcal
                      </span>
                      <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 text-[9px] sm:text-[10px]">
                        {key.amount}g
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center pl-1 flex-shrink-0">
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
