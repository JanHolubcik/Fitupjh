import { createContext, Dispatch, SetStateAction, useState } from "react";

export const YourIntakeContext = createContext<YourIntakeType | null>(null);

type YourIntakeType = {
  savedFood: foodType;
  setSavedFood: Dispatch<SetStateAction<foodType>>;
};

type foodType = {
  breakfast: food;
  lunch:food;
  dinner:food;
}

type food = {
  id: number;
  name: string;
  calories: number;
  amount: string;
}[];

const YourIntakeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const [savedFood, setSavedFood] = useState<foodType>({
    breakfast: [],
    lunch: [],
    dinner: []
});

  return (
    <YourIntakeContext.Provider
      value={{
        savedFood,
        setSavedFood
      }}
    >
      {children}
    </YourIntakeContext.Provider>
  );
};
export default YourIntakeProvider;
