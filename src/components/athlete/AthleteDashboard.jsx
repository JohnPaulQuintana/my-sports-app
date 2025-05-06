import React, { useState, useEffect } from "react";
import MobileSidebar from "../shared/Sidebar";
import ProfileManagement from "../shared/ProfileManagement";
import Card from "../shared/Card";
import SportCardCoach from "../shared/Coaches/SportCard";
import SportCardAthlete from "../shared/Athletes/SportCard";
import EventCalendar from "../athlete/EventScheduling";
import AnalysisChart from "../shared/AnalysisChart";
const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const AthleteDashboard = () => {
  const activeSideBar = localStorage.getItem('active-session') || 'dashboard'
  const [activeTab, setActiveTab] = useState(activeSideBar); // Default view is Dashboard
  const [summary, setTotalSummary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredAnalysis, setFilteredAnalysis] = useState({}); // State for filtered data
  const [start_date, setStartDate] = useState("2025-01-01");
  const [end_date, setEndDate] = useState("2025-04-30");

  const fetchAnalysisAthletes = async (sport_id, s_date, e_date) => {
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
        `${API_BASE_URL}/api/performance/analysis/${sport_id}?start_month=${s_date}&end_month=${e_date}`,
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

      // setAnalysis(data);
      setFilteredAnalysis(data); // Set initial filtered data as the full dataset
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

   

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("sport-science-token"));
        console.log("Token:", token); // Debugging
        if (!token || !token.token) return; // Ensure token is valid

        const response = await fetch(
          `${API_BASE_URL}/api/athlete/summary-athlete`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Summary:", data); // Debugging

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch total sports");
        }
        fetchAnalysisAthletes(data.assign_sports[0]?.sport_id, start_date, end_date)
        setTotalSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    // fetchAnalysisAthletes(start_date, end_date);
  }, [start_date, end_date]);

  return (
    <div className="flex overflow-hidden">
      <MobileSidebar setActiveTab={setActiveTab} />{" "}
      {/* Pass function to Sidebar */}
      {/* Main Content */}
      <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16">
        {activeTab === "dashboard" && (
          <>
            <div className="p-4 text-2xl font-semibold text-gray-700">
              Welcome to the athlete dashboard!
            </div>

            {/* Dashboard Card */}
            <div className="mb-2">
              <Card user={user} summary={summary} />
            </div>

            {/* Sport Card */}
            <div className="border">
              <h1 className="mt-10 ps-6 text-2xl font-semibold text-gray-700">
                My Sport's
              </h1>
              <div className="grid grid-cols-1 sphone:grid-cols-2 laptop:grid-cols-3 gap-2 p-2">
                {summary?.assign_sports?.map((sport) => (
                  // <SportCard key={sport.id} sport={sport} handleOpenModalEdit={}/>
                  <SportCardAthlete key={sport.id} sport={sport} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "announcement" && (
          <>
            <div className="text-2xl font-semibold text-gray-700 mb-6">
              Announcement & Events
            </div>
            <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
              {/* Event form... */}
              {/* <div>
                  display the other heres
              </div> */}
              {/* EventCalendar */}
              <div className="col-span-3">
                <EventCalendar assigned={summary} />
              </div>
            </div>
          </>
        )}

        {activeTab === "performance" && (
          <>
            <div className="text-2xl font-semibold text-gray-700">
              Welcome to the overall performance dashboard!
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

              
            </div>

            <AnalysisChart data={filteredAnalysis} />
          </>
        )}

        {activeTab === "profile" && <ProfileManagement user={user} />}
      </div>
    </div>
  );
};

export default AthleteDashboard;
