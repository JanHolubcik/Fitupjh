"use client";

import { CalorieCard } from "./CalorieCard";

import useLoadSavedFood from "@/hooks/useLoadSavedFood";
import { useSession } from "next-auth/react";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";

import { AccordionTimeFrame } from "./AccordionTimeFrame/AccordionTimeFrame";

export const DashboardContent = () => {
  const { data } = useSession();
  const { isFetched } = useLoadSavedFood({
    userId: data?.user?.id,
    daysAgo: 7,
  });
  const { savedFood, removeFromSavedFood } = useYourIntakeOperations();

  return (
    <div>
      <div className="flex flex-row">
        <CalorieCard intakeToday={savedFood}></CalorieCard>
      </div>
      <AccordionTimeFrame savedFood={savedFood} />
    </div>
  );
};
