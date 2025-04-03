import React, { useState, useEffect } from "react";
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

const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const PerformanceChart = ({ sport_id }) => {
  const [chartData, setChartData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(sport_id);

  // Fetch users with updated data
  const fetchChartData = async () => {
    try {
      if (!user || !user.token) return;

      const response = await fetch(
        `${API_BASE_URL}/api/linear/performance/chart-athlete/${sport_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);
      const chartData2 = formatAthleteData(data, user.user.id);
      // Convert the API data to chart format
      // const chartData = formatChartData(data);

      // Log the chart data for verification
      console.log("data", chartData2);

      setChartData(chartData2);
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch data");
      }

      // setChartData(data.group_users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Call API when component loads or group_id changes
  useEffect(() => {
    fetchChartData();
  }, [sport_id]);


  function formatAthleteData(response, athleteId) {
    // Get the athlete's performance data from the response
    const athlete = response.chart_data[0].performances.find(p => p.athlete.id === athleteId).athlete;
    
    // Get categories (which are the 'name' properties from the chart_data)
    const categories = response.chart_data.map(category => category.name);

    // Map over the chart data to get the results for each category
    const performance = response.chart_data.map(category => {
        const catPerformance = category.performances.find(p => p.athlete.id === athleteId);
        return catPerformance ? parseFloat(catPerformance.result) : 0;
    });

    // Prepare the chart data in the specified format
    return {
        labels: categories, // Categories from API response
        datasets: [
            {
                label: athlete.name, // Athlete's name
                data: performance, // Performance data for the athlete
                backgroundColor: [
                    "rgba(34, 139, 34, 0.7)",
                    "rgba(50, 205, 50, 0.7)",
                    "rgba(144, 238, 144, 0.7)",
                    "rgba(34, 139, 34, 0.7)" // Add more if there are more categories
                ],
                borderColor: [
                    "rgba(34, 139, 34, 1)",
                    "rgba(50, 205, 50, 1)",
                    "rgba(144, 238, 144, 1)",
                    "rgba(34, 139, 34, 1)" // Add more if there are more categories
                ],
                borderWidth: 1,
            },
        ],
    };
}

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


  console.log(chartData)
  return (
    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto p-4">
      <div className="relative w-full h-[300px] sm:h-[400px]">
        <h2 className="text-xl font-bold">{user.user.name}</h2>
        <Bar data={chartData && chartData.labels ? chartData : { labels: [], datasets: [] }} options={options} />
      </div>
    </div>
  );
};

export default PerformanceChart;
