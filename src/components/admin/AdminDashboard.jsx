import React, { useState, useEffect } from "react";
import MobileSidebar from "../shared/Sidebar";
import Card from "../shared/Card";
import SportCard from "../shared/SportCard";
import ResponsiveTable from "../shared/ResponsiveTable";
import CreateSportModal from "../shared/CreateSportModal";
import Swal from "sweetalert2";
import UserAccountModal from "../shared/UserAccountModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

//get the total created Sports

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAccount, setIsModalOpenAccount] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // Default view is Dashboard
  const [summary, setTotalSummary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleOpenModalAccount = () => setIsModalOpenAccount(true);
  const handleCloseModalAccount = () => setIsModalOpenAccount(false);

  //   create users account
  const handleCreateUserAccount = async (newUser) => {
    try {
      const token = JSON.parse(localStorage.getItem("sport-science-token"));
      if (!token) return;

      const userFormData = new FormData();
      userFormData.append("name", newUser.name);
      userFormData.append("email", newUser.email);
      userFormData.append("role", newUser.role);
      userFormData.append("image", newUser.profileImage);

      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: userFormData,
      });

      if (response.ok) {
        const savedSport = await response.json();
        // setSports([...sports, savedSport]); // Update UI with API response
        // console.log('sports created successfully')
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User Account created successfully.",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Refresh the page
          }
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to create sport:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //   create sports
  const handleCreateSport = async (newSport) => {
    try {
      const token = JSON.parse(localStorage.getItem("sport-science-token"));
      if (!token) return;

      const formData = new FormData();
      formData.append("name", newSport.name);
      formData.append("descriptions", newSport.descriptions);
      formData.append("image", newSport.image);

      const response = await fetch(`${API_BASE_URL}/api/admin/sports`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const savedSport = await response.json();
        // setSports([...sports, savedSport]); // Update UI with API response
        // console.log('sports created successfully')
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Sport created successfully.",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Refresh the page
          }
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to create sport:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const user_column_table = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Created At", key: "created_at" },
  ];

  const sport_column_table = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Descriptions", key: "descriptions" },
    // { key: "image", label: "Image", render: (row) => (
    //     <img
    //       src={row.image}
    //       alt={row.name}
    //       className="w-16 h-16 object-cover rounded-md border"
    //     />
    //   )
    // },
    { label: "Status", key: "status" },
    { label: "Created At", key: "created_at" },
  ];

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
          <div className="text-2xl font-semibold text-gray-700">
            {/* <h2></h2> */}
            {/* Add Sports Management Content */}
            <div className="p-2 border">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-700 mb-4">
                  Sports Management
                </h1>
                <a
                  onClick={handleOpenModal}
                  className="text-sm rounded-sm p-1 bg-primary text-white hover:bg-green-600"
                  href="#"
                >
                  Create Sports
                </a>
              </div>
              <ResponsiveTable
                columns={sport_column_table}
                data={summary.sports_record}
                rowsPerPage={5}
                actions={(row) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="px-2 text-base text-white bg-primary rounded hover:bg-green-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="px-2 text-base text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {activeTab === "accounts" && (
          <div className="p-4 text-2xl font-semibold text-gray-700">
            <div className="p-2 border">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-700 mb-4">
                  User Account Management
                </h1>
                <a
                  onClick={handleOpenModalAccount}
                  className="text-sm rounded-sm p-1 bg-primary text-white hover:bg-green-600"
                  href="#"
                >
                  Create Account
                </a>
              </div>
              <ResponsiveTable
                columns={user_column_table}
                data={summary.sports_record}
                rowsPerPage={5}
                actions={(row) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="px-2 text-base text-white bg-primary rounded hover:bg-green-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="px-2 text-base text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </div>
      {/* Modal Component */}
      <CreateSportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateSport}
      />
      {/* User Account Modal */}
      <UserAccountModal
        isOpen={isModalOpenAccount}
        onClose={handleCloseModalAccount}
        onSubmit={handleCreateUserAccount}
      />
    </div>
  );
};

export default AdminDashboard;
