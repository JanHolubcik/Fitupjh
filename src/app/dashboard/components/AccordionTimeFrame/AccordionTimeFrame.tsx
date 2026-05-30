import { Image, Accordion, AccordionItem } from "@nextui-org/react";
import { FoodType, timeOfDay } from "@/types/Types";
import { TimeFrameSmallCard } from "../TimeFrameSmallCard/TimeFrameSmallCard";
import { useState } from "react";

type props = {
  savedFood: FoodType;
};

export const AccordionTimeFrame = ({ savedFood }: props) => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["1"]));
  console.log(selectedKeys);
  return (
    <Accordion
      variant="shadow"
      selectedKeys={selectedKeys}
      // according to heroui site this should work https://v2.heroui.com/docs/components/accordion#controlled
      // @ts-ignore
      onSelectionChange={(a) => setSelectedKeys(a)}
      className={"flex flex-col w-96 h-56 justify-between"}
    >
      {timeOfDay.map((key) => {
        const active = selectedKeys.has(key);

        return (
          <AccordionItem
            key={key}
            classNames={{
              base: "p-0 m-0 border-none shadow-none bg-transparent rounded-none",
              heading: "p-0 m-0",
              trigger:
                "p-0 m-0 min-h-0 after:hidden hover:bg-transparent focus:bg-transparent",
              content: "p-0 m-0",
              titleWrapper: "m-0 p-0",
            }}
            startContent={
              <div className="flex flex-row items-center gap-2 flex-1 text-left">
                <Image
                  className="pl-2"
                  alt="Info"
                  src="cloche.svg"
                  width={30}
                  height={50}
                />
                <div>
                  <p className="text-sm font-medium text-default-700">{key}</p>
                </div>
                {/* <Button
                variant="light"
                className="m-0 p-0 min-w-10"
                size="sm"
                onPress={onOpenChange}
              >
                <ArrowRightCircleIcon className="w-6 h-6 text-default-500" />
              </Button> */}
              </div>
            }
          >
            <TimeFrameSmallCard
              key={key}
              timeFrame={key}
              foodItems={savedFood[key]}
            />
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
