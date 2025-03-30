import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AthletePerformanceChart = () => {
  const data = {
    labels: ["Athlete A", "Athlete B", "Athlete C", "Athlete D"],
    datasets: [
      {
        label: "Speed",
        data: [80, 95, 70, 85],
        backgroundColor: "rgba(34, 139, 34, 0.7)", // Forest Green
        borderColor: "rgba(34, 139, 34, 1)",
        borderWidth: 1,
      },
      {
        label: "Endurance",
        data: [85, 80, 90, 75],
        backgroundColor: "rgba(50, 205, 50, 0.7)", // Lime Green
        borderColor: "rgba(50, 205, 50, 1)",
        borderWidth: 1,
      },
      {
        label: "Accuracy",
        data: [90, 85, 80, 95],
        backgroundColor: "rgba(144, 238, 144, 0.7)", // Light Green
        borderColor: "rgba(144, 238, 144, 1)",
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
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto p-4">
      <div className="relative w-full h-[300px] sm:h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default AthletePerformanceChart;
