import { Image, Accordion, AccordionItem, CardBody } from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";
import { useState } from "react";
import { useT } from "next-i18next/client";
import { CardUniversal } from "@/components/common";

// You will need to create an equivalent to TimeFrameSmallCard for activities
import { ActivitySmallCard } from "../ActivitySmallCard/ActivitySmallCard";

type Props = {
  savedActivities: LoggedActivity[];
};

export const AccordionActivity = ({ savedActivities = [] }: Props) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>("all");
  const { t } = useT("dashboard");

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
    content: "text-small font-bold pt-1",
  };

  const active = isKeyActive("daily-activities");
  const itemCount = savedActivities.length;

  return (
    <CardUniversal
      id={"tour-activities"}
      className="w-80 sm:w-full self-center"
    >
      <CardBody className="max-w-2xl">
        <Accordion
          variant="light"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          showDivider={false}
          itemClasses={itemClasses}
        >
          <AccordionItem
            key="daily-activities"
            aria-label="Daily Activities"
            title={
              <span
                className={
                  active
                    ? "text-primary font-bold transition-colors"
                    : "font-bold"
                }
              >
                {/* Add this translation key to your i18n JSON files */}
                {t("activity.dailyActivities", "Daily Activities")}
              </span>
            }
            subtitle={
              <span className="text-default-400 font-bold">
                {itemCount === 0
                  ? t("accordion.itemsLogged0")
                  : itemCount === 1
                    ? t("accordion.itemsLogged1")
                    : itemCount >= 2 && itemCount <= 4
                      ? t("accordion.itemsLogged234", { count: itemCount })
                      : t("accordion.itemsLogged5plus", {
                          count: itemCount,
                        })}
              </span>
            }
            startContent={
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                  active
                    ? "bg-primary-400 dark:bg-primary/10 text-primary shadow-sm scale-105"
                    : "bg-primary-100 dark:bg-default-100 text-default-500"
                }`}
              >
                <Image
                  alt="Activity icon"
                  src="../flame.svg" // Changed from cloche.svg to something active like a flame or dumbbell
                  width={20}
                  height={20}
                  className={`object-contain transition-transform ${
                    active ? "rotate-[6deg] scale-110" : ""
                  }`}
                />
              </div>
            }
          ></AccordionItem>
        </Accordion>
      </CardBody>
    </CardUniversal>
  );
};
