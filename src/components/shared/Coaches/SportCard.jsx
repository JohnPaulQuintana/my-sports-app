import React from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL =
  import.meta.env.VITE_FRONTEND_Image_URL || "http://127.0.0.1:8001";
  
const SportCardCoach = ({ sport }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/coach/sport/${sport.sport.id}`); // Navigate to sport details
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white border shadow-lg rounded-lg p-4 mt-4 cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">{sport.sport.name}</h2>
        <span
          className={`mt-2 inline-block px-2 rounded-full text-sm ${
            sport.sport.status === "active"
              ? "bg-primary text-white"
              : "bg-red-200 text-red-800"
          }`}
        >
          {sport.sport.status}
        </span>
      </div>
      {sport.sport.image ? (
        <img
          src={`${API_BASE_URL}/${sport.sport.image}`}
          alt={sport.sport.name}
          className="w-full h-40 object-cover mt-2 rounded-lg"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 mt-2 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <p className="text-gray-600">{sport.sport.descriptions}</p>
      <div className="bg-gray-100 p-2 flex gap-2 items-center">
        {/* <button type="button" className="bg-green-200 font-semibold p-1 w-[60px]" onClick={()=>handleOpenModalEdit(sport)}>Edit</button> */}
      </div>
    </div>
  );
};

export default SportCardCoach;
