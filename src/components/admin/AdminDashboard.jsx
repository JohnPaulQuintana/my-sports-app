import React from "react";
import MobileSidebar from "../shared/Sidebar";

const AdminDashboard = () => {
    return (
       <div className="flex">
        <MobileSidebar />
        {/* Main Content */}
        <div className="flex-1 ml-0 tablet:ml-[260px] p-4 mt-16 border">
                <div className="p-4">Welcome to admin dashboard!</div>
            </div>
       </div>
    )
}

export default AdminDashboard;