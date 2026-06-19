"use client";

import {
  Button,
  ButtonGroup,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
} from "chart.js";
import { Dispatch, SetStateAction } from "react";
import { Chart as ReactChart } from "react-chartjs-2";

import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Markdown from "react-markdown";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { GenerativeAIOptions } from "@/lib/queriesOptions/GenerativeAIOptions";
import useChartsHooks from "../../hooks/useChartHooks";
import { capitalizeFirstLetter } from "../../app/[lng]/constants/FunctionsHelper";
import { MACRO_TAILWIND_THEME } from "../../app/[lng]/constants/MacrosHelper";
import { useT } from "next-i18next/client";
import { TFunction } from "i18next";
import { CardUniversal } from "@/components/common";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
);

const tableData = (
  displayDataValues: number[],
  avg: number,
  peak: number,
  daysOver: number,
  recommendedValue: number,
  unit: string,
  emptyDays: number,
  t: TFunction<"dashboard", undefined>,
) => {
  return [
    {
      label: `${displayDataValues.length}-${t("chart.dayAverage")}`,
      value: `${avg} ${unit}`,
      sub: `${t("chart.goal")}: ${recommendedValue} ${unit}`,
      subColor: "text-default-400",
    },
    {
      label: t("chart.weeklyPeak"),
      value: `${peak} ${unit}`,
      sub:
        peak > recommendedValue
          ? t("chart.aboveLimit")
          : t("chart.withinLimit"),
      subColor: peak > recommendedValue ? "text-danger" : "text-success",
    },
    {
      label: t("chart.daysOverLimit"),
      value: `${daysOver} / ${displayDataValues.length}`,
      sub: daysOver === 0 ? t("chart.allWithinGoal") : t("chart.daysExceeded"),
      subColor: daysOver > 0 ? "text-danger" : "text-success",
    },
    {
      label: t("chart.daysNotLogged"),
      value: emptyDays,
      sub: getStringForMissingDay(emptyDays, t),
      subColor: emptyDays > 0 ? "text-danger" : "text-success",
    },
  ];
};

const getStringForMissingDay = (
  emptyDays: number,
  t: TFunction<"dashboard", undefined>,
) => {
  if (emptyDays <= 0) {
    return t("chart.allDaysLogged");
  }

  switch (emptyDays) {
    case 1:
      return t("chart.dayMissing");
    case 2:
    case 3:
    case 4:
      return t("chart.day234Missing");
    default:
      return t("chart.daysMissing");
  }
};

type ChartProps = {
  labels: String[];
  dataValues: number[];
  recommendedValue: number;
  selectedMacro: string;
  macroDatasets: {
    protein: number[];
    fat: number[];
    calories: number[];
    sugar: number[];
    carbohydrates: number[];
    fiber: number[];
  };
  messageForSelectedMacro: string;
  setSelectedMacro: Dispatch<
    SetStateAction<
      "calories" | "protein" | "fat" | "sugar" | "carbohydrates" | "fiber"
    >
  >;
  emptyDays: number;
};

const ChartProgress = ({
  labels,
  dataValues,
  recommendedValue,
  selectedMacro,
  macroDatasets,
  setSelectedMacro,
  emptyDays,
}: ChartProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { t } = useT("dashboard");
  const {
    capitalizedMacro,
    displayDataValues,
    avg,
    peak,
    daysOver,
    unit,
    options,
    data,
  } = useChartsHooks({
    labels,
    dataValues,
    recommendedValue,
    selectedMacro,
  });

  const reduxSavedFood = useSelector(
    (state: RootState) => state.savedFood.month,
  );
  const {
    mutateAsync,
    data: dataResAI,
    isPending,
  } = useMutation(GenerativeAIOptions(reduxSavedFood));

  return (
    <div className="flex flex-col gap-3 shadow-md bg-transparent backdrop-blur-md self-center">
      <CardUniversal>
        <CardBody>
          <div className="flex flex-row w-full items-center justify-between gap-4">
            <div className="flex-1">
              <h1
                className={`text-base sm:text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  MACRO_TAILWIND_THEME[
                    selectedMacro as keyof typeof MACRO_TAILWIND_THEME
                  ].color
                }`}
              >
                {t(`macros.${selectedMacro}`, {
                  defaultValue: capitalizedMacro,
                })}{" "}
                {t("chart.intake")}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                {displayDataValues.length === 0
                  ? t("chart.daysTracked0")
                  : displayDataValues.length === 1
                    ? t("chart.daysTracked1")
                    : displayDataValues.length >= 2 &&
                        displayDataValues.length <= 4
                      ? t("chart.daysTracked234", {
                          count: displayDataValues.length,
                        })
                      : t("chart.daysTracked5plus", {
                          count: displayDataValues.length,
                        })}
              </p>
            </div>
            <div className="flex items-center gap-3  rounded-lg p-2.5">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-xs font-medium text-white">
                  {t("chart.getInsights")}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {t("chart.poweredByGemini")}
                </p>
              </div>
              <Button
                isIconOnly
                variant="light"
                className="w-10 h-10 min-w-10 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200"
                onPress={() => {
                  onOpen();
                  mutateAsync();
                }}
              >
                <Image
                  className="w-6 h-6 rounded-none"
                  src={"/gemini.svg"}
                  alt="Gemini"
                />
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-row py-2 flex-1 min-w-0">
              <ReactChart data={data} options={options} type="bar" />
            </div>

            <div className="sm:grid grid-cols-2 gap-1 flex-shrink-0 sm:visible hidden">
              {tableData(
                displayDataValues,
                avg,
                peak,
                daysOver,
                recommendedValue,
                unit,
                emptyDays,
                t,
              ).map(({ label, value, sub, subColor }) => (
                <div
                  key={label}
                  className="bg-content2 border border-divider rounded-xl p-2 "
                >
                  <p className="text-[10px] sm:text-xs text-default-400 mb-1 truncate">
                    {label}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-default-800">
                    {value}
                  </p>
                  <p className={`text-[10px] sm:text-xs ${subColor} truncate`}>
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex sm:flex-wrap flex-col  sm:items-center sm:items-left gap-4 text-xs text-default-400 py-2">
            <span className="flex items-center gap-1.5">
              <span className="w-4 border-t border-dashed border-default-400 flex-shrink-0" />
              {t("chart.recommendedLimit")}
            </span>
          </div>

          <ButtonGroup className="sm:grid grid-cols-2 sm:grid-cols-3 justify-center gap-2 w-full max-w-3xl sm:visible hidden">
            {Object.keys(macroDatasets).map((macro) => (
              <div key={macro} className="flex-1 ">
                <Button
                  color={macro === selectedMacro ? "primary" : "default"}
                  onPress={() =>
                    setSelectedMacro(macro as keyof typeof macroDatasets)
                  }
                  radius="md"
                  size="sm"
                  className="w-full text-xs"
                  variant="bordered"
                >
                  {t(`macros.${macro}`, {
                    defaultValue: capitalizeFirstLetter(macro),
                  })}
                </Button>
              </div>
            ))}
          </ButtonGroup>
          <div className="sm:hidden flex flex-col gap-2">
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="w-full justify-between text-sm"
                  endContent={<ChevronDownIcon className="w-4 h-4" />}
                >
                  <span className="font-semibold">
                    {t(`macros.${selectedMacro}`, {
                      defaultValue: capitalizeFirstLetter(selectedMacro),
                    })}
                  </span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label={t("chart.macroSelection")}
                className="w-48"
                selectedKeys={selectedMacro}
                selectionMode="single"
                onSelectionChange={(key) => {
                  setSelectedMacro(key.anchorKey as keyof typeof macroDatasets);
                }}
              >
                {Object.keys(macroDatasets).map((macro) => (
                  <DropdownItem key={macro} className="capitalize">
                    {t(`macros.${macro}`, {
                      defaultValue: capitalizeFirstLetter(macro),
                    })}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </CardUniversal>
      <CardUniversal className="block sm:hidden">
        <CardBody>
          <div className="grid grid-cols-2">
            {tableData(
              displayDataValues,
              avg,
              peak,
              daysOver,
              recommendedValue,
              unit,
              emptyDays,
              t,
            ).map(({ label, value, sub, subColor }) => (
              <div
                key={label}
                className="bg-content2 border border-divider rounded-xl p-2 sm:p-3"
              >
                <p className="text-[10px] sm:text-xs text-default-400 mb-1 truncate">
                  {label}
                </p>
                <p className="text-sm sm:text-base font-semibold text-default-800">
                  {value}
                </p>
                <p
                  className={`text-[10px] sm:text-xs mt-0.5 ${subColor} truncate`}
                >
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </CardUniversal>
      <Modal
        placement="top"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        backdrop="blur"
        closeButton={false}
        hideCloseButton
        classNames={{
          base: "bg-zinc-900/95 border border-white/5",
          header:
            "border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-transparent py-4",
          body: "py-6",
          closeButton: "text-zinc-400 hover:text-white hover:bg-white/5",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <Image
                    className="w-15 h-6 rounded-none"
                    src={"/gemini.svg"}
                    alt="Gemini"
                  />
                </div>
              </ModalHeader>
              <ModalBody className="max-h-[60vh] overflow-y-auto">
                {isPending ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Spinner color="primary" />
                      <p className="text-sm text-zinc-400">
                        {t("chart.generatingInsights")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Markdown
                    components={{
                      strong: ({ children }) => (
                        <strong className="text-blue-400 font-extrabold">
                          {children}
                        </strong>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 text-sm leading-relaxed text-zinc-200">
                          {children}
                        </p>
                      ),
                      li: ({ children }) => (
                        <li className="mb-2 text-sm leading-relaxed text-zinc-200 ml-5 m-2 list-disc">
                          {children}
                        </li>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-3 list-decimal ">{children}</ul>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-lg font-bold text-white mb-3 mt-2">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-base font-bold text-emerald-400 mb-2 mt-2">
                          {children}
                        </h2>
                      ),
                    }}
                  >
                    {dataResAI}
                  </Markdown>
                )}
              </ModalBody>
              <ModalFooter className="border-t border-white/5">
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  className="text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  {t("close")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChartProgress;
