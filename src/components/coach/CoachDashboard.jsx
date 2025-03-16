import React from "react";
import MobileSidebar from "../shared/Sidebar";

const CoachDashboard = () => {
  return (
    <div className="flex">
      <MobileSidebar />
      {/* Main Content */}
      <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16 border">
        <div className="p-4">Welcome to coach dashboard!</div>
      </div>
    </div>
  );
};

export default CoachDashboard;
