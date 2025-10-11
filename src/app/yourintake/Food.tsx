"use client";
import TimeFrame from "@/components/TimeFrame/TimeFrame";
import { useYourIntakeContext } from "@/hooks/YourIntakeContext";

import {
  Button,
  CircularProgress,
  Input,
  Image,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaInfoCircle,
  FaSearch,
} from "react-icons/fa";
import { add, format, isSameDay } from "date-fns";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const recommendedCaloriesValue = useMemo(() => {
    if (data?.user?.weight && data?.user?.height) {
      return (
        (10 * data?.user?.weight + 6.25 * data?.user?.height - 5 * 25 + 5) * 1.2
      );
    } else {
      return 0;
    }
  }, [data?.user?.height, data?.user?.weight]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
                  caloriesSum() > recommendedCaloriesValue
                    ? "warning"
                    : "danger"
                }
                label={caloriesSum() + "/" + recommendedCaloriesValue + " Kcal"}
                maxValue={recommendedCaloriesValue}
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
            <Tooltip
              showArrow
              content={
                <div className="p-1 m-1 max-w-64">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain"
                      alt="Info"
                      src="eplaining_owl.png"
                      width={90}
                      height={90}
                    />
                  </div>

                  <div className="m-1 self-center ">
                    <h1 className="bold mb-2 font-bold  text-b">
                      Here lies your calorie tracker.
                    </h1>
                    <p>
                      Progress circle will show of how many % of your daily
                      intake did you take already.
                    </p>
                    <p className="ml-0 mt-2 ">
                      Use the left and right buttons to switch between dates.
                      You can also log any food you forgot to add earlier.
                    </p>
                    <p className="ml-0 mt-2 ">
                      Click the Find food button to log your food. It will
                      automatically log in lunch, dinner or supper. You can also
                      choose time frame you want to log the food.
                    </p>
                  </div>
                </div>
              }
            >
              <div className="m-0 gap-0 p-0  bg-transparent cursor-default">
                <FaInfoCircle className="ml-2"></FaInfoCircle>
              </div>
            </Tooltip>
          </div>

          <Button
            startContent={
              <FaSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            id="search"
            className="m-6 "
            onClick={onOpen}
          >
            Click to find food...
          </Button>

          <ProgressBars date={currentDate.current} />

          {timeFrames.map((key) => (
            <TimeFrame key={key} timeOfDay={key as timeOfDay} />
          ))}
        </div>
      ) : showSpinner ? (
        <Spinner className=" m-2 self-center" size="lg" />
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
