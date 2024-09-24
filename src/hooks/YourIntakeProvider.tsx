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
  currentDate: MutableRefObject<Date>;
  savedFood: foodType;
  setNewDateAndGetFood: (date: Date) => void;
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
  const currentDate = useRef(new Date());
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
          saveFood(currentDate.current.toJSON().slice(0, 10), savedFood);
        } catch (error) {
          console.error("Error sending data to the database:", error);
        }
      };
      sendDataToDB();
    }
  }, [savedFood, savedFood.breakfast, savedFood.dinner, savedFood.lunch]);

  const removeFromSavedFood = (id: number,timeOfDay: timeOfDay) => {
    
    setSavedFood((prevState) => {
      const updatedMeal = prevState[timeOfDay].filter(
        (foodItem) => foodItem.id !== id
      );
      return {
        ...prevState,
        [timeOfDay]: updatedMeal,
      };
    });
  };
  const setNewDateAndGetFood = (date: Date) =>{
    currentDate.current = date;
    getSavedFood(date.toJSON().slice(0, 10)).then((res) => {
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
