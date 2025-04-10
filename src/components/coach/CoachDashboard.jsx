import React, { useState, useEffect } from "react";
// import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import MobileSidebar from "../shared/Sidebar";
import ProfileManagement from "../shared/ProfileManagement";
import Card from "../shared/Card";
import SportCard from "../shared/SportCard";
import SportCardCoach from "../shared/Coaches/SportCard";
import AnalysisChart from "../shared/AnalysisChart";
import EventCalendar from "./EventScheduling";
const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const CoachDashboard = () => {
  const [start_date, setStartDate] = useState("2025-01-01");
  const [end_date, setEndDate] = useState("2025-04-30");
  const [selectedAthlete, setSelectedAthlete] = useState(""); // For the selected athlete

  const [activeTab, setActiveTab] = useState("dashboard"); // Default view is Dashboard
  const [summary, setTotalSummary] = useState(0);
  const [analysis, setAnalysis] = useState({});
  const [filteredAnalysis, setFilteredAnalysis] = useState({}); // State for filtered data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalysisAthletes = async (s_date, e_date) => {
    try {
      const token = JSON.parse(localStorage.getItem("sport-science-token"));
      console.log("Token:", token); // Debugging
      if (!token || !token.token) return; // Ensure token is valid
      console.log("ito", s_date, e_date);
      if (!s_date || !e_date) {
        console.log("empty dates");
        s_date = "2025-01";
        e_date = "2025-04";
      } else {
        s_date = s_date.slice(0, 7);
        e_date = e_date.slice(0, 7);
      }
      const response = await fetch(
        `${API_BASE_URL}/api/performance/analysis/1?start_month=${s_date}&end_month=${e_date}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Analysis Response:", data); // Debugging

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch analysis");
      }

      setAnalysis(data);
      setFilteredAnalysis(data); // Set initial filtered data as the full dataset
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("sport-science-token"));
      console.log("Token:", token); // Debugging
      if (!token || !token.token) return; // Ensure token is valid

      const response = await fetch(`${API_BASE_URL}/api/coach/summary-coach`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      });

      const data = await response.json();
      console.log("API Response2:", data); // Debugging

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch total sports");
      }

      setTotalSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAthleteSelectChange = (e) => {
    setSelectedAthlete(e.target.value);
  };

  // Filter the athletes by selected name
  useEffect(() => {
    if (selectedAthlete === "") {
      setFilteredAnalysis(analysis); // Show all data when no filter is selected
    } else {
      const filtered = analysis.analysis.filter(
        (item) => item.athlete === selectedAthlete
      );
      console.log(filtered);
      setFilteredAnalysis({
        periods: analysis.periods,
        analysis: filtered,
      });
    }
  }, [selectedAthlete, analysis]);

  useEffect(() => {
    fetchSummary();
    fetchAnalysisAthletes(start_date, end_date);
  }, []);

  useEffect(() => {
    if (start_date && end_date) {
      console.log("ginagawa");
      fetchAnalysisAthletes(start_date, end_date);
    }
  }, [start_date, end_date]);

  const performanceData = {
    // {
    status: "success",
    periods: {
      current: "April 2025",
      previous: "January 2025",
    },
    analysis: [
      {
        athlete_id: 3,
        athlete: "Athlete Account",
        sport: "Volleyball",
        performance: {
          Agility: {
            current_period: {
              total: "77.00",
              attempts: 2,
              average: 38.5,
              raw_data: ["73.00", "4.00"],
            },
            previous_period: {
              total: "4.00",
              attempts: 1,
              average: 4,
              raw_data: ["4.00"],
            },
            improvement_percentage: 200,
            improvement_absolute: 34.5,
          },
          Endurance: {
            current_period: {
              total: "67.00",
              attempts: 1,
              average: 67,
              raw_data: ["67.00"],
            },
            previous_period: {
              total: "3.00",
              attempts: 1,
              average: 3,
              raw_data: ["3.00"],
            },
            improvement_percentage: 200,
            improvement_absolute: 64,
          },
          Strength: {
            current_period: {
              total: "88.00",
              attempts: 1,
              average: 88,
              raw_data: ["88.00"],
            },
            previous_period: {
              total: "3.00",
              attempts: 1,
              average: 3,
              raw_data: ["3.00"],
            },
            improvement_percentage: 200,
            improvement_absolute: 85,
          },
          Test2: {
            current_period: {
              total: "1.00",
              attempts: 1,
              average: 1,
              raw_data: ["1.00"],
            },
            previous_period: {
              total: "2.00",
              attempts: 1,
              average: 2,
              raw_data: ["2.00"],
            },
            improvement_percentage: -50,
            improvement_absolute: -1,
          },
        },
      },
      {
        athlete_id: 10,
        athlete: "Collin Treutel",
        sport: "Volleyball",
        performance: {
          Agility: {
            current_period: {
              total: "67.00",
              attempts: 1,
              average: 67,
              raw_data: ["67.00"],
            },
            previous_period: {
              total: "0.00",
              attempts: 0,
              average: 0,
              raw_data: [],
            },
            improvement_percentage: 0,
            improvement_absolute: 67,
          },
          Endurance: {
            current_period: {
              total: "66.00",
              attempts: 1,
              average: 66,
              raw_data: ["66.00"],
            },
            previous_period: {
              total: "0.00",
              attempts: 0,
              average: 0,
              raw_data: [],
            },
            improvement_percentage: 0,
            improvement_absolute: 66,
          },
          Strength: {
            current_period: {
              total: "87.00",
              attempts: 1,
              average: 87,
              raw_data: ["87.00"],
            },
            previous_period: {
              total: "0.00",
              attempts: 0,
              average: 0,
              raw_data: [],
            },
            improvement_percentage: 0,
            improvement_absolute: 87,
          },
        },
      },
      {
        athlete_id: 14,
        athlete: "Lisa Hansen",
        sport: "Volleyball",
        performance: {
          Agility: {
            current_period: {
              total: "78.00",
              attempts: 1,
              average: 78,
              raw_data: ["78.00"],
            },
            previous_period: {
              total: "0.00",
              attempts: 0,
              average: 0,
              raw_data: [],
            },
            improvement_percentage: 0,
            improvement_absolute: 78,
          },
          Endurance: {
            current_period: {
              total: "88.00",
              attempts: 1,
              average: 88,
              raw_data: ["88.00"],
            },
            previous_period: {
              total: "0.00",
              attempts: 0,
              average: 0,
              raw_data: [],
            },
            improvement_percentage: 0,
            improvement_absolute: 88,
          },
          Strength: {
            current_period: {
              total: "77.00",
              attempts: 1,
              average: 77,
              raw_data: ["77.00"],
            },
            previous_period: {
              total: "0.00",
              attempts: 0,
              average: 0,
              raw_data: [],
            },
            improvement_percentage: 0,
            improvement_absolute: 77,
          },
        },
      },
      {
        athlete_id: 4,
        athlete: "Sidney Feil",
        sport: "Volleyball",
        performance: {
          Agility: {
            current_period: {
              total: "68.00",
              attempts: 1,
              average: 68,
              raw_data: ["68.00"],
            },
            previous_period: {
              total: "0.00",
              attempts: 0,
              average: 0,
              raw_data: [],
            },
            improvement_percentage: 0,
            improvement_absolute: 68,
          },
          Endurance: {
            current_period: {
              total: "88.00",
              attempts: 1,
              average: 88,
              raw_data: ["88.00"],
            },
            previous_period: {
              total: "0.00",
              attempts: 0,
              average: 0,
              raw_data: [],
            },
            improvement_percentage: 0,
            improvement_absolute: 88,
          },
          Strength: {
            current_period: {
              total: "87.00",
              attempts: 1,
              average: 87,
              raw_data: ["87.00"],
            },
            previous_period: {
              total: "0.00",
              attempts: 0,
              average: 0,
              raw_data: [],
            },
            improvement_percentage: 0,
            improvement_absolute: 87,
          },
        },
      },
    ],
    // }
  };

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value; // Format: YYYY-MM-DD
    // const yearMonthStart = selectedStartDate.slice(0, 7); // Extracts the year and month: YYYY-MM
    const yearMonthStart = selectedStartDate; // Extracts the year and month: YYYY-MM
    setStartDate(yearMonthStart);
  };
  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value; // Format: YYYY-MM-DD
    // const yearMonthEnd = selectedEndDate.slice(0, 7); // Extracts the year and month: YYYY-MM
    const yearMonthEnd = selectedEndDate; // Extracts the year and month: YYYY-MM
    setEndDate(yearMonthEnd);
  };

  return (
    <div className="flex overflow-hidden">
      <MobileSidebar setActiveTab={setActiveTab} />{" "}
      {/* Pass function to Sidebar */}
      {/* Main Content */}
      <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16">
        {activeTab === "dashboard" && (
          <>
            <div className="p-4 text-2xl font-semibold text-gray-700">
              Welcome to the admin dashboard!
            </div>

            {/* Dashboard Card */}
            <div className="mb-2">
              <Card user={user} summary={summary} />
            </div>

            {/* Sport Card */}
            <div className="border">
              <h1 className="mt-10 ps-6 text-2xl font-semibold text-gray-700">
                Assigned Sport's
              </h1>
              <div className="grid grid-cols-1 sphone:grid-cols-2 laptop:grid-cols-3 gap-2 p-2">
                {summary?.assign_sports?.map((sport) => (
                  // <SportCard key={sport.id} sport={sport} handleOpenModalEdit={}/>
                  <SportCardCoach key={sport.id} sport={sport} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "events" && (
          <>
            <div className="text-2xl font-semibold text-gray-700 mb-6">
              Manage Training Sessions & Events
            </div>
            <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
              {/* Event form... */}
              {/* <div>
                  display the other heres
              </div> */}
              {/* EventCalendar */}
              <div className="col-span-3">
                <EventCalendar assigned={summary}/>
              </div>
            </div>
          </>
        )}

        {activeTab === "athletes" && (
          <>
            <div className="text-2xl font-semibold text-gray-700">
              Welcome to the athletes dashboard!
            </div>

            <div className="flex flex-col tablet:flex-row gap-2">
              <div className="flex flex-col gap-2 w-full tablet:w-[20%]">
                <label htmlFor="start_date">Starting Date</label>
                <input
                  type="date"
                  name=""
                  id=""
                  value={start_date}
                  className="border p-1 rounded-sm"
                  onChange={handleStartDateChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-full tablet:w-[20%]">
                <label htmlFor="start_date">End Date (current month)</label>
                <input
                  type="date"
                  name=""
                  id=""
                  value={end_date}
                  className="border p-1"
                  onChange={handleEndDateChange}
                />
              </div>

              <div className="flex flex-col gap-2 w-full tablet:w-[20%]">
                <label htmlFor="athlete_select">Select Athlete</label>
                <select
                  id="athlete_select"
                  value={selectedAthlete}
                  className="border p-1"
                  onChange={handleAthleteSelectChange}
                >
                  <option value="">Select an athlete</option>
                  {analysis?.analysis?.map((item) => (
                    <option key={item.id} value={item.athlete}>
                      {item.athlete}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <AnalysisChart data={filteredAnalysis} />
          </>
        )}

        {activeTab === "profile" && <ProfileManagement user={user} />}
      </div>
    </div>
  );
};

export default CoachDashboard;
