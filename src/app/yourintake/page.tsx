"use client";
import TimeFrame from "@/components/TimeFrame/TimeFrame";
import { useYourIntakeContext } from "@/hooks/YourIntakeContext";
import { getFood } from "@/lib/food-db";
import { findInDatabase } from "@/lib/YourIntake/search-db";
import { Button } from "@nextui-org/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const timeFrames = ["breakfast", "lunch", "dinner"];

type timeOfDay = "breakfast" | "lunch" | "dinner";
export default function Food() {
  const { currentDate, setNewDateAndGetFood } = useYourIntakeContext();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div className="flex flex-row">
          <div className="flex flex-row">
            <Button
              className="self-end"
              onPress={() => {
                const date = new Date(
                  new Date().setDate(currentDate.current.getDate() - 1)
                );

                setNewDateAndGetFood(date);
              }}
              isIconOnly
            >
              <FaArrowLeft />
            </Button>
            <p>Previous day</p>
          </div>
          <div className="flex flex-row text-center">
            <p>Next day</p>
            <Button
              className="self-end"
              onPress={() => {
                const date = new Date(
                  new Date().setDate(currentDate.current.getDate() + 1)
                );
                setNewDateAndGetFood(date);
              }}
              isIconOnly
            >
              <FaArrowRight />
            </Button>
          </div>
        </div>
        <p>{currentDate.current.toJSON().slice(0, 10)}</p>
        <p>Calories total today:</p>
        {timeFrames.map((key) => (
          <TimeFrame
            key={key}
            timeOfDay={key as timeOfDay}
            findInDatabase={findInDatabase}
          />
        ))}
      </div>
    </main>
  );
}
