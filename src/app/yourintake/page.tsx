"use client";
import TimeFrame from "@/components/TimeFrame/TimeFrame";
import { useYourIntakeContext } from "@/hooks/YourIntakeContext";
import { getFood } from "@/lib/food-db";
import { findInDatabase } from "@/lib/YourIntake/search-db";

const timeFrames = ["breakfast", "lunch", "dinner"];

type timeOfDay = 'breakfast' | 'lunch' | 'dinner';
export default function Food() {
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
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
