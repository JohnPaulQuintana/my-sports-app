import React, {useState, useEffect} from "react";
// import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import MobileSidebar from "../shared/Sidebar";
import ProfileManagement from "../shared/ProfileManagement";
import Card from "../shared/Card";
import SportCard from "../shared/SportCard";
import SportCardCoach from "../shared/Coaches/SportCard";
const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const CoachDashboard = () => {
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
  
        const response = await fetch(`${API_BASE_URL}/api/coach/summary-coach`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        });
  
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
              Welcome to the admin dashboard!
            </div>

            {/* Dashboard Card */}
            <div className="mb-2">
              <Card summary={summary} />
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



        {activeTab === "profile" && (
          <ProfileManagement user={user}/>
        )}
      </div>
      
      
    </div>
  );
};

export default CoachDashboard;
