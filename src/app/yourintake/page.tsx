"use client";
import TimeFrame from "@/components/TimeFrame/TimeFrame";
import { useYourIntakeContext } from "@/hooks/YourIntakeContext";

import { Button, CircularProgress } from "@nextui-org/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendar,
  FaCalendarAlt,
} from "react-icons/fa";
import { add, format, isSameDay } from "date-fns";
import React, { useEffect, useRef } from "react";
import ProgressBars from "@/components/ProgressBars/ProgressBars";
import { useSession } from "next-auth/react";
const timeFrames = ["breakfast", "lunch", "dinner"];

type timeOfDay = "breakfast" | "lunch" | "dinner";
const timeOfDay = ["breakfast", "lunch", "dinner"];
export default function Food() {
  const { currentDate, setNewDateAndGetFood, savedFood } =
    useYourIntakeContext();
  const { data } = useSession();
  const sumCalories = savedFood.breakfast.reduce(
    (accumulator, { calories }) => accumulator + calories,
    0
  );
  const recommendedCalories = useRef<number>(0);
  const caloriesSum = () => {
    let calorieSUm = 0;
    timeOfDay.forEach((value) => {
      calorieSUm += savedFood[value as timeOfDay].reduce(
        (accumulator, { calories }) => accumulator + calories,
        0
      );
    });
    return calorieSUm;
  };

  useEffect(() => {
    const recomendedCalories = () => {
      if (data?.user?.weight && data?.user?.height) {
        recommendedCalories.current =
          (10 * data?.user?.weight + 6.25 * data?.user?.height - 5 * 25 + 5) *
          1.2;
      }

      recomendedCalories();
    };
  });
  const recomendedCalories = () => {
    if (data?.user?.weight && data?.user?.height) {
      return (
        (10 * data?.user?.weight + 6.25 * data?.user?.height - 5 * 25 + 5) * 1.2
      );
    }
    return 0;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-11">
      <div className="flex flex-col">
        <div className="flex flex-row justify-evenly">
          <div className="flex flex-row">
            <Button
              className="self-center"
              size="sm"
              onPress={() => {
                const date = add(currentDate.current, {
                  days: -1,
                });
                setNewDateAndGetFood(date);
              }}
              isIconOnly
            >
              <FaArrowLeft />
            </Button>
            <CircularProgress
              className="mr-4 ml-4"
              size="lg"
              value={recommendedCalories.current / sumCalories}
              color="warning"
              label="kcal"
              showValueLabel={true}
            />

            <Button
              size="sm"
              className="self-center"
              onPress={() => {
                const date = add(currentDate.current, {
                  days: +1,
                });
                setNewDateAndGetFood(date);
              }}
              isIconOnly
            >
              <FaArrowRight />
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center p-4">
          <FaCalendarAlt></FaCalendarAlt>
          <p className="text-sm ml-2">
            {format(currentDate.current, "dd.MMM, eeee")}
          </p>
        </div>
        <ProgressBars date={currentDate.current} />

        {timeFrames.map((key) => (
          <TimeFrame key={key} timeOfDay={key as timeOfDay} />
        ))}
      </div>
    </main>
  );
}
