"use client";

import {
  Button,
  ButtonGroup,
  Card,
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
import { useChartsHooks } from "./useChartHooks";
import { capitalizeFirstLetter } from "../constants/FunctionsHelper";

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
) => {
  return [
    {
      label: `${displayDataValues.length}-day average`,
      value: `${avg} ${unit}`,
      sub: `Goal: ${recommendedValue} ${unit}`,
      subColor: "text-default-400",
    },
    {
      label: "Weekly peak",
      value: `${peak} ${unit}`,
      sub: peak > recommendedValue ? "Above limit" : "Within limit",
      subColor: peak > recommendedValue ? "text-danger" : "text-success",
    },
    {
      label: "Days over limit",
      value: `${daysOver} / ${displayDataValues.length}`,
      sub: daysOver === 0 ? "All within goal" : "Days exceeded",
      subColor: daysOver > 0 ? "text-danger" : "text-success",
    },
    {
      label: "Days not logged",
      value: emptyDays,
      sub: emptyDays <= 0 ? "All days logged" : "Days missing",
      subColor: emptyDays > 0 ? "text-danger" : "text-success",
    },
  ];
};

type ChartProps = {
  labels: string[];
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

const Chart = ({
  labels,
  dataValues,
  recommendedValue,
  selectedMacro,
  macroDatasets,
  setSelectedMacro,
  emptyDays,
  messageForSelectedMacro,
}: ChartProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
    <div className=" flex flex-col gap-3">
      <Card className="">
        <CardBody>
          <div className="flex flex-row w-full items-baseline justify-between">
            <h1 className="pl-1 py-1  text-sm font-semibold ">
              {capitalizedMacro} intake day {displayDataValues.length} day
              {displayDataValues.length > 1 ? "s" : ""}{" "}
            </h1>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-default-400 ">
                Ask gemini about your intake
              </p>
              <Button
                isIconOnly
                variant="flat"
                className="w-15 h-10 my-2"
                onPress={() => {
                  onOpen();
                  mutateAsync();
                }}
              >
                <Image
                  onClick={() => {}}
                  className="w-10 h-10 m-2 rounded-none"
                  src={"/gemini.svg"}
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
              Recommended limit
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
                  {capitalizeFirstLetter(macro)}
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
                    {capitalizeFirstLetter(selectedMacro)}
                  </span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Macro selection"
                className="w-48"
                selectedKeys={selectedMacro}
                selectionMode="single"
                onSelectionChange={(key) => {
                  setSelectedMacro(key.anchorKey as keyof typeof macroDatasets);
                }}
              >
                {Object.keys(macroDatasets).map((macro) => (
                  <DropdownItem key={macro} className="capitalize">
                    {capitalizeFirstLetter(macro)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>
      <Card className="block sm:hidden">
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
      </Card>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        backdrop="blur"
        closeButton={false}
        hideCloseButton
        classNames={{
          base: "bg-zinc-900/95 border border-white/5",
          header:
            "border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent py-4",
          body: "py-6",
          closeButton: "text-zinc-400 hover:text-white hover:bg-white/5",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✨</span>
                  <span className="text-lg font-bold text-white">
                    Insights from Gemini
                  </span>
                </div>
              </ModalHeader>
              <ModalBody className="max-h-[60vh] overflow-y-auto">
                {isPending ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                      <p className="text-sm text-zinc-400">
                        Generating insights...
                      </p>
                    </div>
                  </div>
                ) : (
                  <Markdown
                    components={{
                      strong: ({ children }) => (
                        <strong className="text-emerald-400 font-bold">
                          {children}
                        </strong>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 text-sm leading-relaxed text-zinc-200">
                          {children}
                        </p>
                      ),
                      li: ({ children }) => (
                        <li className="mb-2 text-sm leading-relaxed text-zinc-200 ml-5">
                          {children}
                        </li>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-3 list-disc">{children}</ul>
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
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Chart;
