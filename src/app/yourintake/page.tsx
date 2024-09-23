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
  const { currentDate } = useYourIntakeContext();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>
          <Button
            className="self-end"
            onPress={() => {
              currentDate.current = ((d) =>
                new Date(d.setDate(d.getDate() - 1)))(new Date())
                .toJSON()
                .slice(0, 10);
            }}
            isIconOnly
          >
            <FaArrowLeft />
          </Button>
          <p>Previous day</p>
          <Button className="self-end"     onPress={() => {
              currentDate.current = ((d) =>
                new Date(d.setDate(d.getDate() + 1)))(new Date())
                .toJSON()
                .slice(0, 10);
            }} isIconOnly>
            <FaArrowRight />
          </Button>
          <p>Next day</p>
        </div>
        <p>{currentDate.current}</p>
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
