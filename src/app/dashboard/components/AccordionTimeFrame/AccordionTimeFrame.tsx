import { Image, Accordion, AccordionItem } from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";
import { FoodType, timeOfDay } from "@/types/Types";
import { TimeFrameSmallCard } from "../TimeFrameSmallCard/TimeFrameSmallCard";
import { useState } from "react";

type props = {
  savedFood: FoodType;
};

export const AccordionTimeFrame = ({ savedFood }: props) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["breakfast"]),
  );

  const isKeyActive = (key: string) => {
    if (selectedKeys === "all") return true;
    return selectedKeys.has(key);
  };

  const itemClasses = {
    base: "py-1 w-full border-none mb-1 last:mb-0",
    title: "font-semibold text-sm text-default-800 capitalize tracking-tight",
    subtitle: "text-xs text-default-400 mt-0.5",
    trigger:
      "px-3 py-0 data-[hover=true]:bg-default-100 rounded-xl h-16 flex items-center transition-all duration-200",
    indicator:
      "text-medium text-default-400 data-[open=true]:text-primary transition-transform duration-200",
    content: "text-small px-3 pb-3 pt-1",
  };

  return (
    <Accordion
      variant="shadow"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      showDivider={false}
      itemClasses={itemClasses}
      className="p-2 flex flex-col gap-1 sm:w-full w-80 bg-content1 rounded-2xl border border-default-100 shadow-md"
    >
      {timeOfDay.map((key) => {
        const active = isKeyActive(key);
        const itemCount = savedFood[key as keyof FoodType]?.length || 0;

        return (
          <AccordionItem
            key={key}
            aria-label={key}
            title={
              <span
                className={
                  active ? "text-primary font-bold transition-colors" : ""
                }
              >
                {key}
              </span>
            }
            subtitle={
              <span className="text-default-400 font-normal">
                {itemCount} {itemCount === 1 ? "item" : "items"} logged today
              </span>
            }
            startContent={
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                  active
                    ? "bg-primary/10 text-primary shadow-sm scale-105"
                    : "bg-default-100 text-default-500"
                }`}
              >
                <Image
                  alt={`${key} icon`}
                  src="cloche.svg"
                  width={20}
                  height={20}
                  className={`object-contain transition-transform ${active ? "rotate-[6deg]" : ""}`}
                />
              </div>
            }
          >
            <TimeFrameSmallCard
              timeFrame={key}
              foodItems={savedFood[key as keyof FoodType]}
            />
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
