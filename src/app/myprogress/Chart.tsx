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
  ChartDataset,
  BarController,
  LineController,
} from "chart.js";
import { Bar, Chart as ReactChart } from "react-chartjs-2";

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
  Legend
);

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Chart = ({
  labels,
  dataValues,
  recommendedValue,
  selectedMacro,
}: {
  labels: string[];
  dataValues: number[];
  recommendedValue: number;
  selectedMacro: string;
}) => {
  const capitalizedMacro = capitalizeFirstLetter(selectedMacro);
  const data: ChartData<"bar" | "line", number[], string> = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: `${capitalizedMacro} Intake `,
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        type: "line" as const,
        label: "Recommended",
        data: labels.map(() => recommendedValue),
        borderColor: "rgba(255, 99, 132, 0.8)",
        borderWidth: 2,
        pointRadius: 0,
        borderDash: [5, 5],
      },
    ],
  };
  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: `Daily ${capitalizedMacro} intake: `,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <ReactChart
      className="min-h-[400px]"
      data={data}
      options={options}
      type={"bar"}
    />
  );
};

export default Chart;
