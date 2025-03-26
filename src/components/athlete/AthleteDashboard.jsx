import React, {useState} from "react";
import MobileSidebar from "../shared/Sidebar";
import ProfileManagement from "../shared/ProfileManagement";
const user = JSON.parse(localStorage.getItem("sport-science-token"));

const AthleteDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // Default view is Dashboard
  return (
    <div className="flex overflow-hidden">
          <MobileSidebar setActiveTab={setActiveTab} />{" "}
          {/* Pass function to Sidebar */}
          {/* Main Content */}
          <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16">
            {activeTab === "dashboard" && (
              <>
                <div className="p-4 text-2xl font-semibold text-gray-700">
                  Welcome to the athlete dashboard!
                </div>
              </>
            )}
    
    
    
            {activeTab === "profile" && (
              <ProfileManagement user={user}/>
            )}
          </div>
          
          
        </div>
  );
};

export default AthleteDashboard;
