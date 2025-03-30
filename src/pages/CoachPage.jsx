import React from "react";
import { Routes, Route } from "react-router-dom";
import CoachDashboard from "../components/coach/CoachDashboard";
import SportDetails from "../components/coach/SportDetails";

const CoachPage = () => {
    // return <CoachDashboard />
    return (
        <Routes>
            {/* Default dashboard view */}
            <Route index element={<CoachDashboard />} />

            {/* New route for sport details */}
            <Route path="sport/:id" element={<SportDetails />} />
        </Routes>
    )
}

export default CoachPage;