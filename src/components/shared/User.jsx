import React, { useState, useEffect } from "react";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const User = ({ group_id }) => {
  const [groupUsers, setGroupUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("sport-science-token"));
        console.log("Token:", token); // Debugging
        if (!token || !token.token) return; // Ensure token is valid

        const response = await fetch(
          `${API_BASE_URL}/api/communication/groupusers/${group_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.token}`,
            },
          }
        );

        const data = await response.json();
        console.log("users:", data.group_users); // Debugging

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch total sports");
        }

        setGroupUsers(data.group_users);
        console.log("groupUsers: ",groupUsers)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupUsers();
  }, []);

  return (
    <div>
      {groupUsers?.map((group) =>
        group?.users?.map((user) => (
          <div
            key={user?.id}
            className="shadow p-2 flex items-center gap-2 mb-2"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={"/assets/profile/default-profile.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-sm text-primary">• Active</span>
              <h1>{user?.name}</h1>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default User;
