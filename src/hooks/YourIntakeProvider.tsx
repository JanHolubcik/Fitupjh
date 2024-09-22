import { saveFood } from "@/lib/YourIntake/saveFoodToDatabase-db";
import { getSavedFood } from "@/lib/YourIntake/search-db";
import { foodType } from "@/types/foodTypes";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useLayoutEffect,
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
    timeOfDay: "breakfast" | "lunch" | "dinner",
    valueGrams: string
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

  useEffect(() => {
    const currentDate = new Date(2024, 11, 12);
    getSavedFood(currentDate).then((res) => {
      if (res.savedFood) {
        setSavedFood(res.savedFood);
      }
    });
  }, []);

  useEffect(() => {
    if (
      savedFood.breakfast.length > 0 ||
      savedFood.dinner.length > 0 ||
      savedFood.lunch.length > 0
    ) {
      // Send data to the database only if the foods array is not empty
      const sendDataToDB = async () => {
        try {
          saveFood(new Date(2024, 11, 12), savedFood);
        } catch (error) {
          console.error("Error sending data to the database:", error);
        }
      };

      sendDataToDB();
    }
  }, [savedFood, savedFood.breakfast, savedFood.dinner, savedFood.lunch]);

  const addToFood = (
    calculatedCalories: number,
    name: string,
    timeOfDay: "breakfast" | "lunch" | "dinner",
    valueGrams: string
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
