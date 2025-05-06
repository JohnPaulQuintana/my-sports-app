import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MobileSidebarSub from "../shared/SidebarSub";
import AthletePerformanceChart from "../shared/AthletePerformanceChart";
import User from "../shared/User";
import GroupMessages from "../shared/GroupMessages";
import Swal from "sweetalert2";
import Category from "../shared/Category";
import UserCardPerformance from "../shared/UserCardTable";
import UserCardTable from "../shared/UserCardTable";

const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const SportDetails = () => {
  const { id } = useParams(); // Extract the dynamic id from the URL
  const activeSideBar = localStorage.getItem('active-session') || 'dashboard'
  console.log(activeSideBar)
  const [activeTab, setActiveTab] = useState(activeSideBar); // Default view is Dashboard
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // add performance category
  const handleAddPerformanceCategory = (sport_id) => {
    Swal.fire({
      title: "Add performance category",
      html: `
        <div class="mb-4">
          <label for="category-select" class="mb-2 block">
            Select or Add a Sport Category
          </label>
          <select id="category-select" class="w-full border p-2 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="" disabled selected>Select an existing category</option>
            ${sport?.categories
              .map(
                (category) =>
                  `<option value="${category.category}">${category.category}</option>`
              )
              .join("")}
            <option value="new">Add New Category</option>
          </select>
        </div>
    
        <div class="mb-4" id="new-category-div" style="display: none;">
          <label for="sport-category" class="mb-2 block">
            New Sport Category
          </label>
          <input
            type="text"
            value=""
            id="sport-category"
            class="w-full border p-2 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
    
        <div class="mb-4">
          <label for="description" class="mb-2 block">
            Description
          </label>
          <textarea
            id="description"
            class="w-full border p-2 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            rows="4"
          ></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Add Category",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const categorySelect = document.getElementById("category-select").value;
        const inputName =
          categorySelect === "new"
            ? document.getElementById("sport-category").value
            : categorySelect;
        const inputDescription = document.getElementById("description").value;

        // Validation
        if (!inputName) {
          return Swal.showValidationMessage(
            "Please select or enter a category."
          );
        }

        if (!inputDescription) {
          return Swal.showValidationMessage("Please enter a description.");
        }

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/performance/category/create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                sport_id: sport_id,
                name: inputName,
                description: inputDescription,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            const errorMessages = Object.values(errorData.errors)
              .flat()
              .join(", "); // Combine all error messages

            return Swal.showValidationMessage(`Error: ${errorMessages}`);
          }

          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Successfully added!",
          text: "The performance category has been added.",
        });
      }
    });

    // Event listener to toggle the new category input visibility
    document
      .getElementById("category-select")
      .addEventListener("change", (e) => {
        const newCategoryDiv = document.getElementById("new-category-div");
        if (e.target.value === "new") {
          newCategoryDiv.style.display = "block";
        } else {
          newCategoryDiv.style.display = "none";
        }
      });
  };
  // add athletes
  const handleAddAthelete = (sport_id) => {
    console.log(sport.athletes);
    // Generate the options dynamically
    const options = sport?.athletes
      .map(
        (athlete) => `<option value="${athlete.id}">${athlete.name}</option>`
      )
      .join("");
    Swal.fire({
      title: "Add new Athlete",
      html: `
        <select id="athlete-select" class="swal2-input w-full">
          <option value="" selected disabled>Select an athlete</option>
          ${options}
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Add Athlete",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const selectedAthlete = document.getElementById("athlete-select").value;
        if (!selectedAthlete) {
          return Swal.showValidationMessage("Please select an athlete.");
        }

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/coach/assign-sport`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                athlete_id: selectedAthlete,
                sport_id: sport_id,
              }),
            }
          );

          if (!response.ok) {
            return Swal.showValidationMessage(
              `Error: ${JSON.stringify(await response.json())}`
            );
          }

          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetchSport();
        Swal.fire({
          title: `Successfully added!`,
          // imageUrl: result.value.avatar_url
        });

        window.location.reload();
      }
    });
  };

  const fetchSport = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("sport-science-token"));
      // console.log("Token:", token); // Debugging
      if (!token || !token.token) return; // Ensure token is valid

      const response = await fetch(`${API_BASE_URL}/api/coach/sport/${id}`, {
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

      setSport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSport();
  }, []);

  return (
    <div className="flex overflow-hidden">
      <MobileSidebarSub setActiveTab={setActiveTab} /> {/* Main Content */}
      {activeTab === "dashboard" && (
        <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16">
          <div className="py-4 text-base tablet:text-2xl font-semibold text-gray-700 flex flex-col tablet:flex-row justify-between">
            <span>Welcome to the sport details!</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddPerformanceCategory(id)}
                type="button"
                className="text-xs tablet:text-sm bg-primary px-1 text-white"
              >
                + Category
              </button>
              <button
                onClick={() => handleAddAthelete(id)}
                type="button"
                className="text-xs tablet:text-sm bg-primary px-1 text-white"
              >
                + Athletes
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-2">
            <div className="shadow flex flex-col gap-2">
              <img
                className="w-full h-[250px]"
                src={`${API_BASE_URL}/storage/${sport?.sport.image}`}
                alt=""
                srcset=""
              />
              <h1 className="text-white uppercase font-bold p-2 bg-primary">
                <span>{sport?.sport.name}</span>
              </h1>
              {/* <p>Description: <span>{sport?.sport.descriptions}</span></p> */}
              <div className="grid grid-cols-3 p-2 gap-2">
                <div className="border border-primary p-2 flex items-center flex-col">
                  <h1 className="font-extrabold text-xl text-secondary">
                    {sport?.sport?.athletes.length > 0
                      ? sport?.sport?.athletes.length - 1
                      : 0}
                  </h1>
                  <span>Atheletes</span>
                </div>
                <div className="border border-primary p-2 flex items-center flex-col">
                  <h1 className="font-extrabold text-xl text-secondary">0</h1>
                  <span>Activities</span>
                </div>
                <div className="border border-primary p-2 flex items-center flex-col">
                  <h1 className="font-extrabold text-xl text-secondary">0</h1>
                  <span>Messages</span>
                </div>
              </div>
            </div>
            <div className="shadow col-span-2 p-2">
              <h1>Athlete Performance Chart</h1>
              <AthletePerformanceChart sport_id={id} />
            </div>
          </div>
        </div>
      )}
      {activeTab === "athletes" && (
        <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16">
          <div className="py-4 text-2xl font-semibold text-gray-700 flex justify-between">
            <span>Welcome to the athletes performance!</span>
          </div>
        </div>
      )}
      {/* Category */}
      {activeTab === "category" && (
        <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16">
          <div className="py-4 text-2xl font-semibold text-gray-700 flex justify-between">
            <span>Welcome to the category dashboard!</span>
          </div>

          <div className="mb-4">
            <Category sport_id={id} />
          </div>

          <div className="border shadow p-2">
            {/* <User group_id={sport?.sport?.group?.id} /> */}
            <h1 className="font-bold">Performance Result Today</h1>
            <p className="text-gray-500">
              Click the card to add performance for each atheletes
            </p>
            {/* <p className="text-red-500">NOTE: Adding performance is not completed, table is already done</p> */}
            <UserCardTable group_id={sport?.sport?.group?.id} />
          </div>
        </div>
      )}
      {/* group chats section */}
      {activeTab === "groupchat" && (
        <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16">
          <div className="py-4 text-2xl font-semibold text-gray-700 flex justify-between">
            <span>Welcome to the sport communication!</span>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-4 gap-2">
            {/* users card */}
            <div className="shadow order-2 flex flex-col gap-2 p-2">
              <h1 className="text-gray-600">Members - 20</h1>
              <User group_id={sport?.sport?.group?.id} />
            </div>
            {/* message */}
            <div className="shadow col-span-3 p-2">
              {/* <h1 className="text-gray-600">Group Messages</h1> */}
              <div className="">
                <GroupMessages group_id={sport?.sport?.group?.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportDetails;
