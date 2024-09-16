"use client";
import TimeFrame from "@/components/TimeFrame/TimeFrame";
import { useYourIntakeContext } from "@/hooks/YourIntakeContext";
import { getFood } from "@/lib/food-db";
import { findInDatabase } from "@/lib/YourIntake/search-db";

const timeFrames = ["Breakfast", "Lunch", "Dinner", "Supper"];

export default function Food() {
  const { food } = useYourIntakeContext();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {food ? <p>Calories total today:</p> : <p>D</p>}
        {timeFrames.map((key) => (
          <TimeFrame
            key={key}
            timeOfDay={key}
            findInDatabase={findInDatabase}
          />
        ))}
      </div>
    </main>
  );
}
