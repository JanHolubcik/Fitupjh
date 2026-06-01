"use client";

import { Button, ButtonGroup } from "@nextui-org/react";
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
}: ChartProps) => {
  const capitalizedMacro = capitalizeFirstLetter(selectedMacro);
  const theme = getMacroColor(selectedMacro);
  const unit = getUnit(selectedMacro);

  const hasValues = dataValues && dataValues.length > 0;
  const avg = hasValues
    ? Number(
        Math.round(
          dataValues.reduce((a, b) => a + b, 0) / dataValues.length,
        ).toFixed(2),
      )
    : 0;
  const peak = hasValues ? Number(Math.max(...dataValues).toFixed(2)) : 0;
  const daysOver = hasValues
    ? dataValues.filter((v) => v > recommendedValue).length
    : 0;

  const data: ChartData<"bar" | "line", number[], string> = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: `${capitalizedMacro} intake`,
        data: dataValues,
        backgroundColor: dataValues.map((v) =>
          v > recommendedValue ? theme.over + "b3" : theme.bar + "b3",
        ),
        hoverBackgroundColor: dataValues.map((v) =>
          v > recommendedValue ? theme.over : theme.bar,
        ),
        borderColor: theme.bar,

        fill: true,
        //borderRadius: 6,
        //borderSkipped: false,
        //barPercentage: 0.55,
        //categoryPercentage: 0.7,
      },
      {
        type: "line" as const,
        label: "Recommended limit",
        data: labels.map(() => recommendedValue),
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
    <div className="w-full bg-content1 rounded-2xl border border-divider shadow-md p-5 space-y-4 text-foreground">
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: `${dataValues.length}-day average`,
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
            value: `${daysOver} / ${dataValues.length}`,
            sub: daysOver === 0 ? "All within goal" : "Days exceeded",
            subColor: daysOver > 0 ? "text-danger" : "text-success",
          },
          {
            label: "Days not logged",
            value: emptyDays,
            sub: emptyDays > 0 ? "All days logged" : "Days missing",
            subColor: emptyDays > 0 ? "text-danger" : "text-success",
          },
        ].map(({ label, value, sub, subColor }) => (
          <div
            key={label}
            className="bg-content2 border border-divider rounded-xl p-3"
          >
            <p className="text-xs text-default-400 mb-1">{label}</p>
            <p className="text-base font-semibold text-default-800">{value}</p>
            <p className={`text-xs mt-0.5 ${subColor}`}>{sub}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-default-400 pt-1">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: theme.bar }}
          />
          {capitalizedMacro} intake
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-danger" />
          Over limit
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 border-t border-dashed border-default-400" />
          Recommended limit
        </span>
      </div>
      <div className="relative h-64 w-full">
        <ReactChart data={data} options={options} type="bar" />
      </div>
      <ButtonGroup className="flex flex-wrap justify-center gap-2 w-full max-w-3xl">
        {Object.keys(macroDatasets).map((macro) => (
          <div
            key={macro}
            className="flex-1 sm:flex-none sm:basis-1/3 md:basis-1/4"
          >
            <Button
              color={macro === selectedMacro ? "primary" : "default"}
              onPress={() =>
                setSelectedMacro(macro as keyof typeof macroDatasets)
              }
              radius="md"
              className="w-full"
              variant="bordered"
            >
              {capitalizeFirstLetter(macro)}
            </Button>
          </div>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default Chart;
