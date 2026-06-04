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
  ChartOptions,
  ChartData,
  BarController,
  LineController,
} from "chart.js";
import { Dispatch, SetStateAction } from "react";
import { Chart as ReactChart } from "react-chartjs-2";
import { useIsSm } from "../constants/FunctionsHelper";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

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

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const getMacroColor = (macro: string) => {
  const lower = macro.toLowerCase();
  if (lower.includes("calor")) return { bar: "#f97316", over: "#f43f5e" };
  if (lower.includes("protein")) return { bar: "#10b981", over: "#f43f5e" };
  if (lower.includes("carb")) return { bar: "#c084fc", over: "#f43f5e" };
  if (lower.includes("fat")) return { bar: "#fb7185", over: "#e11d48" };
  return { bar: "#60a5fa", over: "#f43f5e" };
};

const getUnit = (macro: string) => {
  const lower = macro.toLowerCase();
  if (lower.includes("calor")) return "kcal";
  return "g";
};

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
  const capitalizedMacro = capitalizeFirstLetter(selectedMacro);
  const theme = getMacroColor(selectedMacro);
  const unit = getUnit(selectedMacro);

  const isSmallScreen = useIsSm();

  const displayLabels = isSmallScreen
    ? labels
    : labels.map((label) => label.slice(-3));
  const displayDataValues = dataValues;

  const hasValues = displayDataValues && displayDataValues.length > 0;
  const avg = hasValues
    ? Number(
        Math.round(
          displayDataValues.reduce((a, b) => a + b, 0) /
            displayDataValues.length,
        ).toFixed(2),
      )
    : 0;
  const peak = hasValues
    ? Number(Math.max(...displayDataValues).toFixed(2))
    : 0;
  const daysOver = hasValues
    ? displayDataValues.filter((v) => v > recommendedValue).length
    : 0;

  const data: ChartData<"bar" | "line", number[], string> = {
    labels: displayLabels, // Use the responsive filtered labels
    datasets: [
      {
        type: "line" as const,
        label: `${capitalizedMacro} intake`,
        data: displayDataValues, // Use the responsive filtered data
        backgroundColor: displayDataValues.map((v) =>
          v > recommendedValue ? theme.over + "b3" : theme.bar + "b3",
        ),
        hoverBackgroundColor: displayDataValues.map((v) =>
          v > recommendedValue ? theme.over : theme.bar,
        ),
        borderColor: theme.bar,
        fill: true,
      },
      {
        type: "line" as const,
        label: "Recommended limit",
        data: displayLabels.map(() => recommendedValue),
        borderColor: "#64748b",
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderDash: [5, 5],
        tension: 0,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f8fafc",
        bodyColor: "#94a3b8",
        borderColor: "rgba(51, 65, 85, 0.5)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: { weight: 500, size: 12 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (ctx) =>
            ` ${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(2)} ${unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "rgba(148, 163, 184, 0.08)" },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          maxTicksLimit: 5,
          callback: (v) => `${v} ${unit}`,
        },
      },
    },
  };

  return (
    <div className=" flex flex-col gap-3">
      <Card className="">
        <CardBody>
          <h1 className="pl-1 py-1  text-sm font-semibold ">
            {capitalizedMacro} intake day {displayDataValues.length} day
            {displayDataValues.length > 1 ? "s" : ""}{" "}
          </h1>
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
          <div className="text-xs mt-2 ">
            <p className=" ">{messageForSelectedMacro}</p>
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
    </div>
  );
};

export default Chart;
