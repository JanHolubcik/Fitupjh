"use client";
import TimeFrame from "@/components/TimeFrame/TimeFrame";
import { useYourIntakeContext } from "@/hooks/YourIntakeContext";

import {
  Button,
  CircularProgress,
  Input,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";
import { add, format, isSameDay } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import ProgressBars from "@/components/ProgressBars/ProgressBars";
import { useSession } from "next-auth/react";
import { label } from "framer-motion/client";
import { ModalFindFood } from "@/components/Findfood/components/ModalFindFood";
const timeFrames = ["breakfast", "lunch", "dinner"];

type timeOfDay = "breakfast" | "lunch" | "dinner";
const timeOfDay = ["breakfast", "lunch", "dinner"];
export default function Food() {
  const { currentDate, setNewDateAndGetFood, savedFood } =
    useYourIntakeContext();

  const { data } = useSession();
  const recommendedCalories = useRef<number>(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showSpinner, setShowSpinner] = useState(true); // Spinner state

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
      } else {
        recommendedCalories.current = 0;
      }
    };
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 500);
    recomendedCalories();
    return () => clearTimeout(timer);
  }, [data?.user?.height, data?.user?.weight]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-11">
      {!showSpinner && data?.user?.id ? (
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
                classNames={{
                  svg: "w-24 h-24 drop-shadow-md mr-4 ml-4",
                  indicator: "stroke-white",
                  track: "stroke-white/10",
                  value: "text-md font-semibold text-white",
                  label: "text-xs",
                }}
                size="lg"
                value={caloriesSum()}
                color={
                  caloriesSum() > recommendedCalories.current
                    ? "warning"
                    : "danger"
                }
                label={
                  caloriesSum() + "/" + recommendedCalories.current + " Kcal"
                }
                maxValue={recommendedCalories.current}
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

          <Input
            id="search"
            onClick={onOpen}
            isClearable
            radius="lg"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              mainWrapper: "m-4",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Click to find food..."
            startContent={
              <FaSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
          />

          <ProgressBars date={currentDate.current} />

          {timeFrames.map((key) => (
            <TimeFrame key={key} timeOfDay={key as timeOfDay} />
          ))}
        </div>
      ) : showSpinner ? (
        <Spinner size="lg" />
      ) : (
        <h1>Register or login!</h1>
      )}
      <ModalFindFood
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      ></ModalFindFood>
    </main>
  );
}
