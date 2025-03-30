import React, { useState, useEffect } from "react";
const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";
//   const user = JSON.parse(localStorage.getItem("sport-science-token"));

const UserCardTable = ({ group_id }) => {
  const [groupUsers, setGroupUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        // const token = JSON.parse(localStorage.getItem("sport-science-token"));
        console.log("Token:", user); // Debugging
        if (!user || !user.token) return; // Ensure token is valid

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
        console.log("users:", data.group_users); // Debugging

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch total sports");
        }

        setGroupUsers(data.group_users);
        console.log("groupUsers: ", groupUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupUsers();
  }, []);

  return (
    <div className="flex flex-col">
      {groupUsers?.map((group) =>
        group?.users?.filter((user) => user?.role !== "coach")?.map((user) => (
          <div key={user?.id} className="grid grid-cols-1 tablet:grid-cols-4">
            {/* User Profile */}
            <div className="shadow p-2 flex items-center gap-2 mb-2 border">
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src="/assets/profile/default-profile.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-sm text-primary">• Active</span>
                <h1 className="text-gray-800">{user?.name}</h1>
              </div>
            </div>

            {/* Sport Categories */}
            {group?.sport?.categories?.map((category) => (
              <div
                key={category?.id}
                className="shadow p-2 flex flex-col items-center justify-center gap-2 mb-2 border"
              >
                <span className="font-extrabold text-primary text-2xl">100</span>
                <span className="-mt-2 text-gray-600 cursor-pointer border px-1 hover:text-blue-700">{category?.name || "Agility"}+</span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default UserCardTable;
