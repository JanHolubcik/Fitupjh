import { createContext, FC, MutableRefObject, useRef, useState } from "react";

export const YourIntakeContext = createContext<YourIntakeType | null>(null);

type YourIntakeType = {
  food: React.MutableRefObject<boolean>;
};

const YourIntakeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const food = useRef(false);

  return (
    <YourIntakeContext.Provider
      value={{
        food,
      }}
    >
      {children}
    </YourIntakeContext.Provider>
  );
};
export default YourIntakeProvider;
