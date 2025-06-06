import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MobileSidebarSub from "../shared/SidebarSub";
import AthletePerformanceChart from "../shared/AthletePerformanceChart";
import User from "../shared/User";
import GroupMessages from "../shared/GroupMessages";
import Swal from "sweetalert2";
import PerformanceChart from "../shared/PerformanceChart";

const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const SportDetails = () => {
  const { id } = useParams(); // Extract the dynamic id from the URL
  const [activeTab, setActiveTab] = useState("dashboard"); // Default view is Dashboard
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // add athletes
  const handleAddAthelete = (sport_id) => {
    console.log(sport.athletes)
    // Generate the options dynamically
    const options = sport?.athletes
    .map(
      (athlete) =>
        `<option value="${athlete.id}">${athlete.name}</option>`
    )
    .join("");
    Swal.fire({
      title: "Add new Athlete",
      html: `
        <select id="athlete-select" class="swal2-input">
          <option value="" selected disabled>Select an athlete</option>
          ${options}
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Look up",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const selectedAthlete = document.getElementById("athlete-select").value;
        if (!selectedAthlete) {
          return Swal.showValidationMessage("Please select an athlete.");
        }
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/athlete/assign-sport`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
            body: JSON.stringify({
              athlete_id: selectedAthlete,
              sport_id: sport_id,
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
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Successfully added!`,
          // imageUrl: result.value.avatar_url
        });
      }
    });
    
  }
  useEffect(() => {
    const fetchSport = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("sport-science-token"));
        console.log("Token:", token); // Debugging
        if (!token || !token.token) return; // Ensure token is valid

        const response = await fetch(`${API_BASE_URL}/api/athlete/sport/${id}`, {
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

    fetchSport();
  }, []);

  return (
    <div className="flex overflow-hidden">
      <MobileSidebarSub setActiveTab={setActiveTab} /> {/* Main Content */}
      {activeTab === "dashboard" && (
        <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16">
          <div className="py-4 text-base tablet:text-2xl font-semibold text-gray-700 flex justify-between">
            <span>Welcome to the sport details!</span>
            {/* <button
            onClick={()=>handleAddAthelete(id)}
              type="button"
              className="text-xs tablet:text-sm bg-primary px-1 text-white"
            >
              + Athletes
            </button> */}
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
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
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="border border-primary p-2 flex items-center flex-col">
                  <h1 className="font-extrabold text-xl text-secondary">{sport?.sport?.athletes.length}</h1>
                  <span>Atheletes</span>
                </div>
                <div className="border border-primary p-2 flex items-center flex-col">
                  <h1 className="font-extrabold text-xl text-secondary">0</h1>
                  <span>Session's</span>
                </div>
                {/* <div className="border border-primary p-2 flex items-center flex-col">
                  <h1 className="font-extrabold text-xl text-secondary">0</h1>
                  <span className="break-words text-center max-w-[100px]">Recommendation</span>
                </div> */}
              </div>
            </div>
            <div className="shadow col-span-2 p-4">
              <h1>Athlete Performance category Chart</h1>
              <PerformanceChart sport_id={id}/>
            </div>
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
              <User group_id={sport?.sport?.group?.id}/>
            </div>
            {/* message */}
            <div className="shadow col-span-3 p-2">
              {/* <h1 className="text-gray-600">Group Messages</h1> */}
              <div className="">
                <GroupMessages group_id={sport?.sport?.group?.id}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportDetails;
