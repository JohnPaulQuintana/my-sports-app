import React from "react";
import { Routes, Route } from "react-router-dom";
import AthleteDashboard from "../components/athlete/AthleteDashboard";
import SportDetails from "../components/athlete/SportDetails";

const AthletePage = () => {
//   return <AthleteDashboard />
return (
    <Routes>
      {/* Default dashboard view */}
      <Route index element={<AthleteDashboard />} />

      {/* Route for sport details */}
      <Route path="sport/:id" element={<SportDetails />} />
    </Routes>
  );
//   <Routes>
//     {/* Default dashboard view */}
//     <Route index element={<AthleteDashboard />} />

//     {/* New route for sport details */}
//     {/* <Route path="sport/:id" element={<SportDetails />} /> */}
//   </Routes>;
};

export default AthletePage;
