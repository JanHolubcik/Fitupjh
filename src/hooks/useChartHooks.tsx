import {
  capitalizeFirstLetter,
  useIsSm,
} from "../app/[lng]/constants/FunctionsHelper";
import { ChartOptions, ChartData } from "chart.js";

type props = {
  labels: String[];
  dataValues: number[];
  recommendedValue: number;
  selectedMacro: string;
};

export const getMacroColor = (macro: string) => {
  const lower = macro.toLowerCase();
  if (lower.includes("calor")) return { bar: "#f97316", over: "#f43f5e" };
  if (lower.includes("protein")) return { bar: "#3b82f6", over: "#f43f5e" };
  if (lower.includes("carb")) return { bar: "#f59e0b", over: "#f43f5e" };
  if (lower.includes("fat")) return { bar: "#8b5cf6", over: "#f43f5e" };
  if (lower.includes("sugar")) return { bar: "#ec4899", over: "#f43f5e" };
  if (lower.includes("fiber")) return { bar: "#10b981", over: "#f43f5e" };

  return { bar: "#ec4899", over: "#f43f5e" };
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

  const data: ChartData<"bar" | "line", number[], String> = {
    labels: displayLabels,
    datasets: [
      {
        type: "line" as const,
        label: `${capitalizedMacro} intake`,
        data: displayDataValues,

        // 1. Dynamic Fill Color (Red above limit, Macro color below)
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea, scales } = chart;
          if (!chartArea) return theme.bar + "80"; // Fallback before render

          const yLimit = scales.y.getPixelForValue(recommendedValue);
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );

          const height = chartArea.bottom - chartArea.top;
          let limitStop = (yLimit - chartArea.top) / height;
          limitStop = Math.max(0, Math.min(1, limitStop)); // Keep between 0 and 1

          // Above the limit (Red)
          gradient.addColorStop(0, theme.over + "80");
          gradient.addColorStop(limitStop, theme.over + "80");

          // Below the limit (Macro Color)
          gradient.addColorStop(limitStop, theme.bar + "80");
          gradient.addColorStop(1, theme.bar + "1A"); // Fades out nicely at the bottom

          return gradient;
        },

        // 2. Dynamic Line Color (Matches the fill logic)
        borderColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea, scales } = chart;
          if (!chartArea) return theme.bar;

          const yLimit = scales.y.getPixelForValue(recommendedValue);
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );

          const height = chartArea.bottom - chartArea.top;
          let limitStop = (yLimit - chartArea.top) / height;
          limitStop = Math.max(0, Math.min(1, limitStop));

          gradient.addColorStop(0, theme.over);
          gradient.addColorStop(limitStop, theme.over);
          gradient.addColorStop(limitStop, theme.bar);
          gradient.addColorStop(1, theme.bar);

          return gradient;
        },

        // 3. Keep the dots colored appropriately based on their value
        pointBackgroundColor: displayDataValues.map((v) =>
          v > recommendedValue ? theme.over : theme.bar,
        ),
        pointBorderColor: displayDataValues.map((v) =>
          v > recommendedValue ? theme.over : theme.bar,
        ),

        fill: true,
        tension: 0.1, // Optional: slightly smooths the line
      },
      {
        type: "line" as const,
        label: "Recommended limit",
        data: displayLabels.map(() => recommendedValue),
        borderColor: "#64748b",
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderDash: [10, 10],
        tension: 0,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    // On mobile disable all pointer/touch events so the tooltip never appears
    events: isSmallScreen
      ? []
      : ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        enabled: !isSmallScreen,
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
