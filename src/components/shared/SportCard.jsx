import React from "react";
const API_BASE_URL =
  import.meta.env.VITE_FRONTEND_Image_URL || "http://127.0.0.1:8001";
  
const SportCard = ({ sport }) => {
  return (
    <div className="bg-white border shadow-lg rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">{sport.name}</h2>
        <span
          className={`mt-2 inline-block px-2 rounded-full text-sm ${
            sport.status === "active"
              ? "bg-primary text-white"
              : "bg-red-200 text-red-800"
          }`}
        >
          {sport.status}
        </span>
      </div>
      {sport.image ? (
        <img
          src={`${API_BASE_URL}/${sport.image}`}
          alt={sport.name}
          className="w-full h-40 object-cover mt-2 rounded-lg"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 mt-2 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <p className="text-gray-600">{sport.descriptions}</p>
    </div>
  );
};

export default SportCard;
