import {
  Accordion,
  AccordionItem,
  CardBody,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";
import { useState } from "react";
import { useT } from "next-i18next/client";
import { CardUniversal } from "@/components/common";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ActivitiesOptions } from "@/lib/queriesOptions/ActivitiesOptions";
import useActivityOperations from "@/hooks/useActivityOperations";
import { usePathname } from "next/navigation";

import ActivityRecordModal, {
  ActivityRecord,
} from "@/components/NewActivityRecordModal/ActivityRecordModal";
import { FaBolt, FaPlusCircle, FaTimes } from "react-icons/fa";
import DynamicFaIcon from "@/components/DynamicFaIcon/DynamicFaIcon";

const AccordionActivity = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>("all");

  const [recordToEdit, setRecordToEdit] = useState<ActivityRecord | null>(null);

  const { t } = useT("dashboard");
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";

  const getLocalizedName = (act: {
    name: string;
    localizedNames?: any;
  }): string => {
    const map = act.localizedNames;
    if (!map) return act.name;
    // After JSON serialization from MongoDB, localizedNames is a plain object
    return (map as Record<string, string>)[currentLocale] || act.name;
  };

  const isKeyActive = (key: string) => {
    if (selectedKeys === "all") return true;
    return selectedKeys.has(key);
  };

  const { data } = useSuspenseQuery(ActivitiesOptions());
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { savedActivities, removeFromSavedActivity } = useActivityOperations();

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

  const handleEditClick = (savedItem: any) => {
    setRecordToEdit({
      _id: savedItem.id || savedItem._id, //
      activity: savedItem.activity,
      durationMinutes: savedItem.durationMinutes,
      caloriesBurned: savedItem.caloriesBurned,
    });
    onOpen();
  };

  const handleCreateNewClick = () => {
    setRecordToEdit(null);
    onOpen();
  };

  return (
    <CardUniversal
      id={"tour-activity"}
      className="w-full sm:max-w-2xl self-center"
    >
      <CardBody className="p-3 sm:p-5 max-w-2xl">
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
                {t("activity.dailyActivities")}
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
                <FaBolt color="white" width={20} height={20} />
              </div>
            }
          >
            <div className="flex flex-col p-2 bg-zinc-300 dark:bg-zinc-950 rounded-xl">
              <div className="flex flex-col rounded-xl">
                {savedActivities.map((savedItem, index) => {
                  const fullActivity = data?.find(
                    (a: any) =>
                      a._id === savedItem.activity ||
                      a.id === savedItem.activity,
                  );

                  if (!fullActivity) return null;

                  return (
                    <div
                      onClick={() => handleEditClick(savedItem)}
                      key={savedItem.id || index}
                      className="flex flex-row items-center first:rounded-t-xl last:rounded-b-xl justify-between gap-3 p-2 bg-zinc-200 dark:bg-zinc-900 border border-white/[0.02] hover:bg-white/[0.03] hover:border-white/5  transition-all duration-200 group hover:cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-300 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
                        <DynamicFaIcon name={fullActivity.icon} size={16} />
                      </div>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="font-bold text-xs sm:text-sm dark:text-zinc-200 capitalize whitespace-nowrap overflow-hidden text-ellipsis w-16 sm:w-36">
                            {getLocalizedName(fullActivity)}
                          </p>

                          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <span className="capitalize">
                              {t(
                                `activity.categories.${fullActivity.category}`,
                              )}
                            </span>
                            <span>&middot;</span>
                            <span>{savedItem.durationMinutes} min</span>
                            <span>&middot;</span>
                            <span>{savedItem.caloriesBurned} kcal</span>
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onPress={() => {
                          removeFromSavedActivity(savedItem.id);
                        }}
                        isIconOnly
                        radius="lg"
                        variant="light"
                        className="w-8 h-8 min-w-8 m-1 bg-red-750"
                      >
                        <FaTimes size={12} />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <Button
                onPress={handleCreateNewClick}
                isIconOnly
                variant="flat"
                className="w-8 h-8 min-w-8 self-center my-2 text-primary-300 light:bg-slate-300"
              >
                <FaPlusCircle size={16} />
              </Button>
            </div>
          </AccordionItem>
        </Accordion>

        <ActivityRecordModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          activities={data}
          existingRecord={recordToEdit}
        />
      </CardBody>
    </CardUniversal>
  );
};

export default AccordionActivity;

