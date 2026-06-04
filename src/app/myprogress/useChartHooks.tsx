import { capitalizeFirstLetter, useIsSm } from "../constants/FunctionsHelper";
import { ChartOptions, ChartData } from "chart.js";
type props = {
  labels: string[];
  dataValues: number[];
  recommendedValue: number;
  selectedMacro: string;
};

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

export const useChartsHooks = ({
  labels,
  dataValues,
  recommendedValue,
  selectedMacro,
}: props) => {
  const isSmallScreen = useIsSm();
  const displayLabels = isSmallScreen
    ? labels
    : labels.map((label) => label.slice(-3));
  const displayDataValues = dataValues;
  const capitalizedMacro = capitalizeFirstLetter(selectedMacro);
  const theme = getMacroColor(selectedMacro);
  const unit = getUnit(selectedMacro);

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

  return {
    options,
    data,
    avg,
    peak,
    daysOver,
    displayDataValues,
    capitalizedMacro,
    theme,
    unit,
  };
};
