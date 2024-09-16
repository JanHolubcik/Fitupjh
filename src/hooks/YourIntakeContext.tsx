import { useContext } from "react";
import { YourIntakeContext } from "./YourIntakeProvider";

export const useYourIntakeContext = () => {
  const context = useContext(YourIntakeContext);

  if (!context) {
    throw new Error("useContext must be used inside the Provider");
  }

  return context;
};
