import React, { useState, useEffect } from "react";
import MobileSidebar from "../shared/Sidebar";
import Card from "../shared/Card";
import SportCard from "../shared/SportCard";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

//get the total created Sports

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // Default view is Dashboard
  const [summary, setTotalSummary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalSports = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("sport-science-token"));
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/admin/summary`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch total sports");
        }

        setTotalSummary(data); // Assuming API returns { "total_sports": 5 }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalSports();
  }, []);

  return (
    <div className="flex">
      <MobileSidebar setActiveTab={setActiveTab} /> {/* Pass function to Sidebar */}

      {/* Main Content */}
      <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16 border">
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
                Latest Sport's
              </h1>
              <div className="grid grid-cols-1 sphone:grid-cols-2 laptop:grid-cols-3 gap-2 p-2">
                {summary?.sports_record?.map((sport) => (
                  <SportCard key={sport.id} sport={sport} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "sports" && (
          <div className="p-4 text-2xl font-semibold text-gray-700">
            <h2>Sports Management</h2>
            {/* Add Sports Management Content */}
          </div>
        )}

        {activeTab === "accounts" && (
          <div className="p-4 text-2xl font-semibold text-gray-700">
            <h2>Account Management</h2>
            {/* Add Sports Management Content */}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
