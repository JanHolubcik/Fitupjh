import { createContext, Dispatch, FC, MutableRefObject, SetStateAction, useRef, useState } from "react";

export const YourIntakeContext = createContext<YourIntakeType | null>(null);

type YourIntakeType = {
  savedFood: foodType;
  setSavedFood: Dispatch<SetStateAction<foodType>>;
};

type foodType = {
  id: number;
  name: string;
  calories: number;
  amount: string;
}[];

const YourIntakeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const food = useRef(false);
  const [savedFood, setSavedFood] = useState<foodType>([]);
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
