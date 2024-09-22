import { foodType } from "@/types/foodTypes";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";

export const YourIntakeContext = createContext<YourIntakeType | null>(null);

type YourIntakeType = {
  IDIncrement: MutableRefObject<number>;
  savedFood: foodType;
  setSavedFood: Dispatch<SetStateAction<foodType>>;
  addToFood: (
    calculatedCalories: number,
    name: string,
    timeOfDay: "breakfast" | "lunch" | "dinner"
  ) => void;
};

const YourIntakeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const IDIncrement = useRef(0);
  const [savedFood, setSavedFood] = useState<foodType>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const addToFood = (
    calculatedCalories: number,
    name: string,
    timeOfDay: "breakfast" | "lunch" | "dinner"
  ) => {
    setSavedFood((prevState) => {
      debugger;
      const valueGrams = (
        document.getElementById(
          `${IDIncrement.current}inputGrams`
        ) as HTMLInputElement
      ).value;

      const newState = prevState;
      newState[timeOfDay] = [
        ...prevState[timeOfDay],
        {
          id: IDIncrement.current,
          name: name,
          calories: calculatedCalories,
          amount: valueGrams,
        },
      ];

      return newState;
    });
    ++IDIncrement.current;
  };

  return (
    <YourIntakeContext.Provider
      value={{
        IDIncrement,
        savedFood,
        setSavedFood,
        addToFood,
      }}
    >
      {children}
    </YourIntakeContext.Provider>
  );
};
export default YourIntakeProvider;
