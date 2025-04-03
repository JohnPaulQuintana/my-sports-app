import React, { useEffect, useState } from "react";
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

const AthletePerformanceChart = ({ sport_id }) => {
  const [chartData, setChartData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(sport_id);

  // Fetch users with updated data
  const fetchChartData = async () => {
    try {
      if (!user || !user.token) return;

      const response = await fetch(
        `${API_BASE_URL}/api/linear/performance/chart/${sport_id}`,
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
      // Convert the API data to chart format
      const chartData = formatChartData(data);

      // Log the chart data for verification
      console.log(chartData);
      
      setChartData(chartData)
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

  // prepare data for chart format
  function formatChartData(apiData) {
    const athletes = [];
    const datasets = [];
  
    // Helper function to generate random colors
    function getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.7)`; // RGB with transparency
    }
  
    // Collect athlete names
    apiData.chart_data.forEach((sport) => {
      sport.performances.forEach((performance) => {
        if (!athletes.includes(performance.athlete.name)) {
          athletes.push(performance.athlete.name);
        }
      });
    });
  
    // Prepare the data for each sport
    apiData.chart_data.forEach((sport) => {
      const sportData = {
        label: sport.name,
        data: [],
        backgroundColor: getRandomColor(),
        borderColor: "rgba(0, 0, 0, 1)", // Black border for all bars
        borderWidth: 0,
      };
  
      athletes.forEach((athleteName) => {
        const performance = sport.performances.find(
          (p) => p.athlete.name === athleteName
        );
        sportData.data.push(performance ? parseFloat(performance.result) : 0);
      });
  
      datasets.push(sportData);
    });
  
    // Make sure data is never undefined
    return {
      labels: athletes.length > 0 ? athletes : ["No athletes available"],
      datasets: datasets.length > 0 ? datasets : [],
    };
  }
  

  // Call API when component loads or group_id changes
  useEffect(() => {
    fetchChartData();
  }, [sport_id]);

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

  console.log(data)
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
        <Bar data={chartData && chartData.labels ? chartData : { labels: [], datasets: [] }} options={options} />
      </div>
    </div>
  );
};

export default AthletePerformanceChart;
