import TimeFrame from "@/components/TimeFrame";
import { Button } from "@nextui-org/react";
import Image from "next/image";

const timeFrames = ["Breakfast", "Lunch", "Dinner", "Supper"];

export default function Food() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {timeFrames.map((key) => (
          <TimeFrame key={key} timeOfDay={key} />
        ))}
      </div>
    </main>
  );
}
