import { saveFood } from "@/lib/YourIntake/saveFoodToDatabase-db";
import { getSavedFood } from "@/lib/YourIntake/search-db";
import { foodType } from "@/types/foodTypes";
import {format} from "date-fns";

import {
  createContext,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";

export const YourIntakeContext = createContext<YourIntakeType | null>(null);
type timeOfDay= "breakfast" | "lunch" | "dinner";

type YourIntakeType = {
  currentDate: MutableRefObject<Date>;
  savedFood: foodType;
  setNewDateAndGetFood: (date: Date) => void;
  removeFromSavedFood: (id:number,timeOfDay:timeOfDay) => void,
  addToFood: (
    id:number,
    calculatedCalories: number,
    name: string,
    timeOfDay: "breakfast" | "lunch" | "dinner",
    valueGrams: string
  ) => void;
};



const YourIntakeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentDate = useRef(new Date());
  const isLast = useRef(false);
  const [savedFood, setSavedFood] = useState<foodType>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  useEffect(() => {
    getSavedFood(format(currentDate.current, "dd.MMM.yyyy")).then((res) => {
      if (res.savedFood) {
        setSavedFood(res.savedFood);
      }
    });
  }, []);

  useEffect(() => {
    if (
      savedFood.breakfast.length > 0 ||
      savedFood.dinner.length > 0 ||
      savedFood.lunch.length > 0 ||
      isLast.current
    ) {
      // Send data to the database only if the foods array is not empty
      const sendDataToDB = async () => {
        try {
          saveFood(format(currentDate.current, "dd.MMM.yyyy"), savedFood);
          

        } catch (error) {
          console.error("Error sending data to the database:", error);
        }
      };
      sendDataToDB();
      isLast.current=false;
    }
  }, [savedFood, savedFood.breakfast, savedFood.dinner, savedFood.lunch]);

  const removeFromSavedFood = (id: number,timeOfDay: timeOfDay) => {
    setSavedFood((prevState) => {
      const updatedMeal = prevState[timeOfDay].filter(
        (foodItem) => foodItem.id !== id
      );
      if (
        updatedMeal.length === 0
      ){
        isLast.current = true;
      }
      return {
        ...prevState,
        [timeOfDay]: updatedMeal,
      };
    });
  };

  const setNewDateAndGetFood = (date: Date) =>{
    currentDate.current = date;
    getSavedFood(format(currentDate.current, "dd.MMM.yyyy")).then((res) => {
      if (res.savedFood) {
        setSavedFood(res.savedFood);
      }else {
        setSavedFood({
          breakfast: [],
          lunch: [],
          dinner: [],
        })
      }
    });
  }

  const addToFood = (
    id:number,
    calculatedCalories: number,
    name: string,
    timeOfDay: "breakfast" | "lunch" | "dinner",
    valueGrams: string
  ) => {
    setSavedFood((prevState) => {
      const newTimeOfTheDay = [
       ...prevState[timeOfDay],
        {
          id: id,
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
  };

  return (
    <YourIntakeContext.Provider
      value={{
        currentDate,
        savedFood,
        setNewDateAndGetFood,
        removeFromSavedFood,
        addToFood,
      }}
    >
      {children}
    </YourIntakeContext.Provider>
  );
};
export default YourIntakeProvider;
