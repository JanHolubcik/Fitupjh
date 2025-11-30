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
} from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({
  labels,
  dataValues,
  recommendedValue,
}: {
  labels: string[];
  dataValues: number[];
  recommendedValue: number;
}) => {
  const data: ChartData<"bar" | "line", number[], string> = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Protein Intake (g)",
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
        text: "Daily Protein Intake",
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
      className="min-h-96"
      data={data}
      options={options}
      type={"bar"}
    />
  );
};

export default Chart;
