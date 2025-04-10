import React, { useState, useEffect } from "react";
import MobileSidebar from "../shared/Sidebar";
import Card from "../shared/Card";
import SportCard from "../shared/SportCard";
import ResponsiveTable from "../shared/ResponsiveTable";
import CreateSportModal from "../shared/CreateSportModal";
import Swal from "sweetalert2";
import UserAccountModal from "../shared/UserAccountModal";
import UserCard from "../shared/UserCard";
import ProfileManagement from "../shared/ProfileManagement";
import EditSportModal from "../shared/EditSportModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

//get the total created Sports

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("sport-science-token"));
  const [selectedSport, setSelectedSport] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [isModalOpenAccount, setIsModalOpenAccount] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // Default view is Dashboard
  const [summary, setTotalSummary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermSp, setSearchTermSp] = useState("");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleOpenModalEdit = (sport) => {
    setSelectedSport(sport);// Store the selected sport's ID
    setIsModalOpenEdit(true);
  }
  const handleCloseModalEdit = () => setIsModalOpenEdit(false);

  const handleOpenModalAccount = () => setIsModalOpenAccount(true);
  const handleCloseModalAccount = () => setIsModalOpenAccount(false);

  //   create users account
  const handleCreateUserAccount = async (newUser) => {
    console.log(newUser);
    try {
      const tokens = JSON.parse(localStorage.getItem("sport-science-token"));
      if (!tokens) return;

      const userFormData = new FormData();
      userFormData.append("name", newUser.name);
      userFormData.append("email", newUser.email);
      userFormData.append("role", newUser.role);
      userFormData.append("image", newUser.profileImage);

      // ${API_BASE_URL_USER}
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "POST",
        headers: {
          // "Accept": "application/json",
          Authorization: `Bearer ${tokens.token}`,
        },
        body: userFormData,
        // credentials: 'include', // This is crucial!
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
      formData.append("coach_id",newSport.coach)

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

  //   edit sports
  const handleEditSport = async (editSport) => {
    console.log("form",selectedSport)
    try {
      const token_edit = JSON.parse(localStorage.getItem("sport-science-token"));
      if (!token_edit) return;

      const formData = new FormData();
      formData.append("sport_id", selectedSport.id);
      formData.append("name", editSport.name.trim() || selectedSport.name);
      formData.append("descriptions", editSport.descriptions.trim() || selectedSport.descriptions);
      formData.append("image", editSport.image);
      formData.append("coach_id",editSport.coach)

      const response = await fetch(`${API_BASE_URL}/api/admin/sports-edit`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token_edit.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const savedSportEdit = await response.json();
        // setSports([...sports, savedSport]); // Update UI with API response
        // console.log('sports created successfully')
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Sport updated successfully.",
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

  // Filter users based on search input
  const filteredUsers = summary?.user_record?.filter(
    (user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) // Adjust field as needed
  );
  // Filter users based on coach role
  const filteredUserCoach = summary?.user_record?.filter(
    (coach) => coach.role.toLowerCase() === "coach"
  );

  // console.log(filteredUserCoach)
  // Filter users based on search input
  const filteredSports = summary?.sports_record?.filter(
    (sport) => sport.name.toLowerCase().includes(searchTermSp.toLowerCase()) // Adjust field as needed
  );

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
                Latest Sport's
              </h1>
              <div className="grid grid-cols-1 sphone:grid-cols-2 laptop:grid-cols-3 gap-2 p-2">
                {summary?.sports_record?.map((sport) => (
                  <SportCard key={sport.id} sport={sport} handleOpenModalEdit={handleOpenModalEdit}/>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "sports" && (
          <div className="w-full">
            {/* <h2></h2> */}
            {/* Add Sports Management Content */}
            <div className="p-2 border overflow-hidden w-full">
              <div className="flex flex-col tablet:flex-row justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-700 mb-4">
                  Sports Management
                </h1>
                <div className="flex gap-2 items-center">
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTermSp}
                    onChange={(e) => setSearchTermSp(e.target.value)}
                    className="w-full px-3 py-1 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <a
                    onClick={handleOpenModal}
                    className="text-sm text-center rounded-sm p-1 bg-primary text-white hover:bg-green-600"
                    href="#"
                  >
                    Create
                  </a>
                </div>
                

              </div>
              {/* Sport Card */}
              <div className="grid grid-cols-1 sphone:grid-cols-2 laptop:grid-cols-3 gap-2 p-2">
                {filteredSports?.map((sport) => (
                  <>
                  <SportCard key={sport.id} sport={sport} handleOpenModalEdit={handleOpenModalEdit}/>
                  {/* <button type="button">dwadwad2</button> */}
                  </>
                ))}
              </div>
              {/* <div className="w-full overflow-x-auto">
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
              </div> */}
            </div>
          </div>
        )}

        {activeTab === "accounts" && (
          <div className="p-1 tablet:p-4 text-2xl font-semibold text-gray-700">
            <div className="p-2 border">
              <div className="flex flex-col tablet:flex-row justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-700 mb-4">
                  User Account Management
                </h1>
                <div className="flex gap-2 items-center">
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-1 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <a
                    onClick={handleOpenModalAccount}
                    className="text-sm text-center rounded-sm p-1 bg-primary text-white hover:bg-green-600"
                    href="#"
                  >
                    Create
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sphone:grid-cols-2 laptop:grid-cols-3 gap-2 p-2">
                {filteredUsers?.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
              {/* <ResponsiveTable
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
              /> */}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <ProfileManagement user={user}/>
        )}
      </div>
      {/* Modal Component for create sports*/}
      <CreateSportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateSport}
        availableCoach={filteredUserCoach}
      />
      {/* Modal Component for edit sports*/}
      <EditSportModal
        isOpen={isModalOpenEdit}
        onClose={handleCloseModalEdit}
        onSubmit={handleEditSport}
        availableCoach={filteredUserCoach}
        sport={selectedSport}
        API_BASE_URL={API_BASE_URL}
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
