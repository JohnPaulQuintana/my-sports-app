import React, { useState, useEffect } from "react";
import MobileSidebar from "../shared/Sidebar";
import ProfileManagement from "../shared/ProfileManagement";
import Card from "../shared/Card";
import SportCardCoach from "../shared/Coaches/SportCard";
import SportCardAthlete from "../shared/Athletes/SportCard";
import EventCalendar from "../athlete/EventScheduling";
const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const AthleteDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // Default view is Dashboard
  const [summary, setTotalSummary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("API Response:", data); // Debugging

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

    fetchSummary();
  }, []);

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

        {activeTab === "profile" && <ProfileManagement user={user} />}
      </div>
    </div>
  );
};

export default AthleteDashboard;
