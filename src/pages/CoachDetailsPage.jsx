import React from "react";
import { useParams } from "react-router-dom";

const CoachDetailsPage = () => {
  const { id } = useParams(); // Extract the dynamic id from the URL

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Coach Details Page</h1>
      <p>Viewing details for Coach ID: {id}</p>
    </div>
  );
};

export default CoachDetailsPage;
