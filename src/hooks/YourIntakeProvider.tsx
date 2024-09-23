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
type timeOfDay= "breakfast" | "lunch" | "dinner";

type YourIntakeType = {
  currentDate: MutableRefObject<string>;
  savedFood: foodType;
  removeFromSavedFood: (id:number,timeOfDay:timeOfDay) => void,
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
  const currentDate = useRef(new Date().toJSON().slice(0, 10));
  const IDIncrement = useRef(0);
  const [savedFood, setSavedFood] = useState<foodType>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  useEffect(() => {
    
    getSavedFood(currentDate.current.toString()).then((res) => {
      if (res.savedFood) {
        setSavedFood(res.savedFood);
      }
    });
  }, [currentDate.current]);

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

  const removeFromSavedFood = (id: number,timeOfDay: timeOfDay) => {
    setSavedFood((prevState) => {
      // Clone the current meal array (breakfast/lunch/dinner)
      const updatedMeal = prevState[timeOfDay].filter(
        (foodItem) => foodItem.id !== id
      );

      // Return the new state with the updated meal
      return {
        ...prevState,
        [timeOfDay]: updatedMeal,
      };
    });
  };

  const addToFood = (
    calculatedCalories: number,
    name: string,
    timeOfDay: "breakfast" | "lunch" | "dinner",
    valueGrams: string
  ) => {
    setSavedFood((prevState) => {
      const newTimeOfTheDay = [
       ...prevState[timeOfDay],
        {
          id: IDIncrement.current,
          name: name,
          calories: calculatedCalories,
          amount: valueGrams,
        },
      ];

      return {
        ...prevState,
        [timeOfDay]: newTimeOfTheDay,
      };
    });
    ++IDIncrement.current;
  };

  return (
    <YourIntakeContext.Provider
      value={{
        currentDate,
        
        savedFood,
        removeFromSavedFood,
        addToFood,
      }}
    >
      {children}
    </YourIntakeContext.Provider>
  );
};
export default YourIntakeProvider;
