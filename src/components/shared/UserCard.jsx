import React from "react";
const API_BASE_URL =
  import.meta.env.VITE_FRONTEND_Image_URL || "http://127.0.0.1:8001";

const UserCard = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">{user.name}</h2>
        <span className="mt-2 inline-block px-2 rounded-full text-sm">
          Edit
        </span>
      </div>
      {user.image ? (
        <img
          src={`${API_BASE_URL}/${user.image}`}
          alt={user.name}
          className="w-full h-40 object-cover mt-2 rounded-lg"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 mt-2 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <div className="flex flex-col gap-1 py-2">
      <h2 className="text-base break-words">
        <span className="break-words">{user.email}</span>
      </h2>

        <h2 className="text-base">
          <span className="bg-primary p-1 rounded-md text-white text-xs uppercase">{user.role}</span>
        </h2>
      </div>
    </div>
  );
};

export default UserCard;
