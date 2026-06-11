import ImageFromURL from "@/components/ImageFromURL/ImageFromURL";
import { Button, Input } from "@nextui-org/react";
import { FaPlusCircle } from "react-icons/fa";
import React from "react";
import { useT } from "next-i18next/client";

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
  grams: number;
  setCalculatedCalories: React.Dispatch<React.SetStateAction<number[]>>;
  setGrams: React.Dispatch<React.SetStateAction<number>>;
  AddFood: (
    id: number,
    key: macrosLocal,
    valueGrams: string,
    onClose: () => void,
  ) => void;
  onClose: () => void;
};

const AddFoodComponent = (props: props) => {
  const { t } = useT("dashboard");

  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between gap-1 p-3  rounded-xl my-2 bg-zinc-900/20 border border-white/5 backdrop-blur-sm hover:bg-zinc-800/20 hover:border-white/10 transition-all duration-200"
      key={props.macros.name}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
        <div className="flex-shrink-0 bg-zinc-950/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
          <ImageFromURL
            url={props.macros.imgUrl}
            macroName={props.macros.name}
          />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <p className="font-bold text-sm md:text-base text-zinc-100 capitalize leading-tight truncate">
            {props.macros.name}
          </p>
          <span className="text-[10px] text-zinc-500 font-medium mt-0.5 whitespace-nowrap">
            {props.macros.calories_per_100g} kcal / 100g
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 md:flex md:flex-row md:items-center md:gap-4 px-1 md:px-4 md:border-x border-white/5 py-1">
        <div className="flex flex-col md:items-center bg-zinc-900/40 md:bg-transparent p-2 md:p-0 rounded-lg border border-white/[0.02] md:border-none">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider md:mb-0.5">
            {t("addFood.proteinShort")}
          </span>
          <span className="text-success font-bold text-xs md:text-sm">
            {((props.macros.protein / 100) * props.grams).toFixed(1)}g
          </span>
        </div>

        <div className="flex flex-col md:items-center bg-zinc-900/40 md:bg-transparent p-2 md:p-0 rounded-lg border border-white/[0.02] md:border-none">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider md:mb-0.5">
            {t("addFood.carbsShort")}
          </span>
          <span className="text-warning font-bold text-xs md:text-sm">
            {((props.macros.carbohydrates / 100) * props.grams).toFixed(1)}g
          </span>
        </div>

        <div className="flex flex-col md:items-center bg-zinc-900/40 md:bg-transparent px-2 pt-2 md:p-0 rounded-lg border border-white/[0.02] md:border-none">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider md:mb-0.5">
            {t("addFood.fatShort")}
          </span>
          <span className="text-pink-500 font-bold text-xs md:text-sm">
            {((props.macros.fat / 100) * props.grams).toFixed(1)}g
          </span>
        </div>

        <div className="flex flex-col md:items-center bg-zinc-900/40 md:bg-transparent p-2 md:p-0 rounded-lg border border-white/[0.02] md:border-none">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider md:mb-0.5">
            {t("addFood.sugarShort")}
          </span>
          <span className="text-purple-400 font-bold text-xs md:text-sm">
            {(((props.macros.sugar || 0) / 100) * props.grams).toFixed(1)}g
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t border-white/5 md:border-none">
        <div className="w-[85px] md:w-20">
          <Input
            label={t("addFood.portion")}
            labelPlacement="outside"
            placeholder="100"
            size="sm"
            type="number"
            variant="bordered"
            defaultValue="100"
            min={0}
            max={999}
            classNames={{
              label:
                "text-[10px] text-zinc-400 font-semibold tracking-wide uppercase pb-1",
              inputWrapper:
                "h-9 border-white/10 group-data-[focus=true]:border-primary transition-colors bg-zinc-950/30",
              input: "text-center font-bold text-zinc-200 text-xs",
            }}
            onChange={(event) => {
              const grams = Number(event.target.value);
              props.setGrams(grams);
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

        <div className="w-[85px] md:w-20">
          <Input
            isReadOnly
            label={t("addFood.energy")}
            labelPlacement="outside"
            size="sm"
            variant="flat"
            classNames={{
              label:
                "text-[10px] text-primary-400 font-semibold tracking-wide uppercase pb-1",
              inputWrapper:
                "h-9 bg-primary-500/10 border border-primary-500/20",
              input: "text-center font-extrabold text-primary-400 text-xs",
            }}
            value={`${props.calculatedCalories?.[props.id]?.toFixed(0) || "0"} kcal`}
          />
        </div>

        <Button
          onPress={() =>
            props.AddFood(
              props.id,
              props.macros,
              props.grams.toString(),
              props.onClose,
            )
          }
          isIconOnly
          radius="full"
          variant="light"
          className="w-9 h-9 min-w-9 ml-1 text-[#00FFAA] hover:bg-[#00FFAA]/10 hover:scale-105 transition-all duration-200 self-end"
        >
          <FaPlusCircle size={22} />
        </Button>
      </div>
    </div>
  );
};

export default AddFoodComponent;
