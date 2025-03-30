import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = () => {
  // Static athlete data
  const athlete = {
    name: "John Doe",
    speed: 85,
    endurance: 90,
    accuracy: 80,
  };

  const data = {
    labels: ["Speed", "Endurance", "Accuracy"],
    datasets: [
      {
        label: athlete.name,
        data: [athlete.speed, athlete.endurance, athlete.accuracy],
        backgroundColor: [
          "rgba(34, 139, 34, 0.7)",
          "rgba(50, 205, 50, 0.7)",
          "rgba(144, 238, 144, 0.7)",
        ],
        borderColor: [
          "rgba(34, 139, 34, 1)",
          "rgba(50, 205, 50, 1)",
          "rgba(144, 238, 144, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to take full width
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto p-4">
      <div className="relative w-full h-[300px] sm:h-[400px]">
        <h2 className="text-xl font-bold">John Doe Performance</h2>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PerformanceChart;
