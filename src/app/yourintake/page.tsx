"use client";
import TimeFrame from "@/components/TimeFrame/TimeFrame";
import { useYourIntakeContext } from "@/hooks/YourIntakeContext";
import { findInDatabase } from "@/lib/YourIntake/search-db";
import { Button } from "@nextui-org/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { add, format, isSameDay } from "date-fns";
import React from "react";
const timeFrames = ["breakfast", "lunch", "dinner"];

type timeOfDay = "breakfast" | "lunch" | "dinner";
export default function Food() {
  const { currentDate, setNewDateAndGetFood } = useYourIntakeContext();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-11">
      <div className="flex flex-col">
        <p className="self-center mb-5">
          {format(currentDate.current, "dd.MMM.yyyy, eeee")}
        </p>
        <div className="flex flex-row justify-evenly">
          <div className="flex flex-row">
            <Button
              size="sm"
              className="self-end"
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
            <p className="self-center ml-2">Previous day</p>
          </div>
          <div className="flex flex-row text-center">
            {!isSameDay(currentDate.current, new Date()) && (
              <>
                <p className="self-center mr-2">Next day</p>
                <Button
                  size="sm"
                  className="self-end"
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
              </>
            )}
          </div>
        </div>

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
