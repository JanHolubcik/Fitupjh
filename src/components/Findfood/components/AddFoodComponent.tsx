import ImageFromURL from "@/components/ImageFromURL/ImageFromURL";

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import React from "react";
type macrosLocal = {
  name: string;
  calories_per_100g: number;
  fat: number;
  protein: number;
  sugar: number;
  carbohydrates: number;
  fiber: number;
  salt: number;
  imgUrl: string;
};

type props = {
  id: number;
  macros: macrosLocal;
  calculatedCalories: number[];
  setCalculatedCalories: React.Dispatch<React.SetStateAction<number[]>>;
  AddFood: (
    id: number,
    key: macrosLocal,
    valueGrams: string,
    onClose: () => void,
  ) => void;
  onClose: () => void;
};

const AddFoodComponent = (props: props) => {
  const [Grams, setGrams] = useState(100);
  return (
    <div
      className="flex flex-row items-stretch gap-4 sm:gap-6 p-4 bg-transparent border-b border-divider/50"
      key={props.macros.name}
    >
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 min-w-[60px] sm:min-w-[180px]">
        <ImageFromURL url={props.macros.imgUrl} macroName={props.macros.name} />
        <p className="font-bold text-small sm:text-medium text-white capitalize leading-tight text-center sm:text-left">
          +{props.macros.name}
        </p>
      </div>

      <div className="flex flex-col justify-center gap-1 flex-1 border-x border-divider/20 px-4 self-stretch">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-default-500 font-bold uppercase w-8">
            Prot
          </span>
          <span className="text-success font-semibold text-xs">
            {((props.macros.protein / 100) * Grams).toFixed(2)}g
          </span>
        </div>
        <div className="flex items-center gap-2 border-y border-divider/10 py-0.5">
          <span className="text-[9px] text-default-500 font-bold uppercase w-8">
            Carb
          </span>
          <span className="text-warning font-semibold text-xs">
            {((props.macros.carbohydrates / 100) * Grams).toFixed(2)}g
          </span>
        </div>
        <div className="flex items-center gap-2 border-b border-divider/10 pb-0.5">
          <span className="text-[9px] text-default-500 font-bold uppercase w-8">
            Fat
          </span>
          <span className="text-pink-500 font-semibold text-xs">
            {((props.macros.fat / 100) * Grams).toFixed(2)}g
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-default-500 font-bold uppercase w-8">
            Sug
          </span>
          <span className="text-purple-400 font-semibold text-xs">
            {(((props.macros.sugar || 0) / 100) * Grams).toFixed(2)}g
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="w-16 sm:w-20">
          <Input
            label="Grams"
            labelPlacement="outside"
            placeholder="100"
            size="sm"
            type="number"
            variant="bordered"
            defaultValue="100"
            min={0}
            max={999}
            classNames={{
              label: "text-[10px] text-default-400 font-medium pb-1",
              inputWrapper: "h-9 border-default-200",
              input: "text-center",
            }}
            onChange={(event) => {
              const grams = Number(event.target.value);
              setGrams(grams);
              props.setCalculatedCalories((prevState) => {
                const newState = [...prevState];
                if (event.target.value !== "") {
                  newState[props.id] =
                    (grams / 100) * props.macros.calories_per_100g;
                }
                return newState;
              });
            }}
          />
        </div>

        <div className="w-16 sm:w-20">
          <Input
            isReadOnly
            label="kcal"
            labelPlacement="outside"
            size="sm"
            variant="flat"
            classNames={{
              label: "text-[10px] text-primary-400 font-medium pb-1",
              inputWrapper: "h-9 bg-primary-900/20",
              input: "text-center text-primary-400",
            }}
            value={props.calculatedCalories?.[props.id]?.toFixed(0) || "0"}
          />
        </div>
        <Button
          className="mt-5"
          onPress={() =>
            props.AddFood(
              props.id,
              props.macros,
              Grams.toString(),
              props.onClose,
            )
          }
          isIconOnly
          radius="full"
          variant="light"
        >
          <FaPlusCircle size={24} />
        </Button>
      </div>
    </div>
  );
};

export default AddFoodComponent;
