import { food, macros, ReturnTypeFood } from "@/types/Types";
import { Button, Image, Input } from "@nextui-org/react";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

type props = {
  id: number;
  macros: {
    name: string;
    calories_per_100g: number;
    fat: number;
    protein: number;
    sugar: number;
    carbohydrates: number;
    fiber: number;
    salt: number;
  };
  calculatedCalories: number[];
  setCalculatedCalories: React.Dispatch<React.SetStateAction<number[]>>;
  AddFood: (
    id: number,
    key: {
      name: string;
      calories_per_100g: number;
      fat: number;
      protein: number;
      sugar: number;
      carbohydrates: number;
      fiber: number;
      salt: number;
    },
    valueGrams: string,
    onClose: () => void,
  ) => void;
  onClose: () => void;
};

const AddFoodComponent = (props: props) => {
  const [Grams, setGrams] = useState(100);
  return (
    <div
      className="flex flex-row items-center gap-4 sm:gap-6 p-4 bg-transparent border-b border-divider/50"
      key={props.macros.name}
    >
      {/* Left: Image & Name (Fixed) */}
      <div className="flex items-center gap-4 min-w-[140px] sm:min-w-[180px]">
        <Image
          alt={props.macros.name}
          height={40}
          radius="md"
          fallbackSrc={`foodPlaceholder.png`}
          src={`https://www.themealdb.com/images/ingredients/${props.macros.name}.png`}
          width={40}
          className="object-contain"
        />
        <p className="font-bold text-small sm:text-medium text-white capitalize leading-tight">
          {props.macros.name}
        </p>
      </div>

      {/* Middle: Macros Stacked Vertically */}
      <div className="flex flex-col justify-center gap-1.5 flex-1 border-x border-divider/20 px-4">
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
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-default-500 font-bold uppercase w-8">
            Fat
          </span>
          <span className="text-pink-500 font-semibold text-xs">
            {((props.macros.fat / 100) * Grams).toFixed(2)}g
          </span>
        </div>
      </div>

      {/* Right: Inputs & Action (Fixed) */}
      <div className="flex items-end gap-3 shrink-0">
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
          onPress={() => props.AddFood(props.id, props.macros, Grams.toString(), props.onClose)}
          isIconOnly
        
          variant="light"
          className="w-9 h-9 min-w-9"
        >
          <FaPlusCircle size={24} />
        </Button>
      </div>
    </div>
  );
};

export default AddFoodComponent;
