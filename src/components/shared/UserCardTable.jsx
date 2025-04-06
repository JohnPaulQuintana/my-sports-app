import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const UserCardTable = ({ group_id }) => {
  const [groupUsers, setGroupUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users with updated data
  const fetchGroupUsers = async () => {
    try {
      if (!user || !user.token) return;

      const response = await fetch(
        `${API_BASE_URL}/api/communication/groupusers/${group_id}`,
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
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch data");
      }

      setGroupUsers(data.group_users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Call API when component loads or group_id changes
  useEffect(() => {
    fetchGroupUsers();
  }, [group_id]);

  // Handle adding a score
  const handleCategoryClick = async (athlete_id, category_id, category_name) => {
    Swal.fire({
      title: `${category_name} Score`,
      html: `
        <div class="mb-4">
          <label for="sport-category-value" class="text-white mb-2 block">Score (1-5)</label>
          <input 
            type="range" 
            id="sport-category-value" 
            class="swal2-input" 
            min="1" 
            max="5" 
            step="1" 
            required
          />
          <span id="slider-value">3</span> <!-- Default value of 3 -->
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Add Score",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const inputScore = document.getElementById("sport-category-value").value;
        if (!inputScore) return Swal.showValidationMessage("Please enter a score.");
  
        try {
          const response = await fetch(`${API_BASE_URL}/api/performance/category/insert`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
            body: JSON.stringify({
              athlete_id,
              category_id,
              category_score: inputScore,
            }),
          });
  
          if (!response.ok) {
            return Swal.showValidationMessage(`Error: ${JSON.stringify(await response.json())}`);
          }
  
          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: "Successfully added!" });
        fetchGroupUsers(); // 🔄 Refresh data after success
      }
    });
  
    // Add an event listener to update the displayed value when the slider is moved
    const slider = document.getElementById("sport-category-value");
    const sliderValue = document.getElementById("slider-value");
  
    slider.addEventListener("input", () => {
      sliderValue.textContent = slider.value;
    });
  };
  

  // Handle editing a score
  const handleCategoryClickEdit = async (performance_id, result, category_name) => {
    Swal.fire({
      title: `${category_name} Score Edit`,
      html: `
        <div class="mb-4">
          <label for="sport-category-value-edit" class="text-white mb-2 block">Score (1-5)</label>
          <input 
            type="range" 
            value="${result}" 
            id="sport-category-value-edit" 
            class="swal2-input" 
            min="1" 
            max="5" 
            step="1" 
            required
          />
          <span id="slider-value">${result}</span>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Edit Score",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const inputScore = document.getElementById("sport-category-value-edit").value;
        if (!inputScore) return Swal.showValidationMessage("Please enter a score.");
  
        try {
          const response = await fetch(`${API_BASE_URL}/api/performance/category/edit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
            body: JSON.stringify({
              performance_id,
              result: inputScore,
            }),
          });
  
          if (!response.ok) {
            return Swal.showValidationMessage(`Error: ${JSON.stringify(await response.json())}`);
          }
  
          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: "Successfully updated!" });
        fetchGroupUsers(); // 🔄 Refresh data after success
      }
    });
  
    // Add an event listener to update the displayed value when the slider is moved
    const slider = document.getElementById("sport-category-value-edit");
    const sliderValue = document.getElementById("slider-value");
  
    slider.addEventListener("input", () => {
      sliderValue.textContent = slider.value;
    });
  };
  

  return (
    <div className="flex flex-col">
      {groupUsers?.map((group) =>
        group?.users?.filter((user) => user?.role !== "coach")?.map((user) => (
          <div key={user?.id} className="grid grid-cols-1 tablet:grid-cols-4">
            {/* User Profile */}
            <div className="shadow p-2 flex items-center gap-2 mb-2 bg-primary">
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src="/assets/profile/default-profile.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-sm text-white">• Active</span>
                <h1 className="text-white">{user?.name}</h1>
              </div>
            </div>

            {/* Sport Categories */}
            {group?.sport?.categories?.map((category) => {
              // Find the performance where the athlete_id matches the user.id
              const athletePerformance = category?.performances?.find(
                (performance) => performance?.athlete_id === user?.id
              );

              return (
                <div
                  key={category?.id}
                  className="shadow p-2 flex flex-col items-center justify-center gap-4 mb-2"
                >
                  <span
                    className={`font-extrabold ${
                      athletePerformance ? "text-primary" : "text-secondary"
                    } text-2xl`}
                  >
                    {/* Display the score for the athlete, or 0 if no performance exists */}
                    {athletePerformance ? Math.trunc(athletePerformance?.result) : 0}
                  </span>

                  {/* Buttons Section */}
                  <div className="flex items-center gap-2">
                    {/* "+ Agility" button */}
                    <button
                      onClick={() => !athletePerformance && handleCategoryClick(user?.id, category?.id, category?.name)}
                      className={`-mt-2 px-1 border ${
                        !athletePerformance
                          ? "cursor-pointer hover:text-blue-700 text-gray-600"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {category?.name || "Agility"}+
                    </button>

                    {/* "Edit Score" button */}
                    <span
                      onClick={() =>
                        athletePerformance &&
                        handleCategoryClickEdit(
                          athletePerformance?.id,
                          athletePerformance?.result,
                          category?.name
                        )
                      }
                      className={`-mt-2 px-1 border ${
                        athletePerformance
                          ? "cursor-pointer hover:text-blue-700 text-gray-600"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Edit Score
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default UserCardTable;
