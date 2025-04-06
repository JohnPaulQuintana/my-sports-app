import { useState, useEffect } from "react";
import { showLoader } from "../swal/showLoader";
import Swal from "sweetalert2";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

export default function MobileSidebar({ setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});

  // Fetch user on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("sport-science-token"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []); // Runs only once when the component mounts

  // Extract user role safely
  const getUserRole = () => {
    // console.log(user.user.role)
    return user?.user?.role || null; // Ensure role exists
  };

  const handleLogout = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("sport-science-token"));
      if (!token) return;

      showLoader("Logging you out...", "Please wait while we process.");
      const response = await fetch(
        `${API_BASE_URL}/api/${token.user?.role}/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      Swal.close();
      if (response.ok) {
        localStorage.removeItem("sport-science-token"); // Remove token from storage
        window.location.href = "/login"; // Redirect to login page
      }
    } catch (error) {
      Swal.close();
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-[9999999]">
        <div className="flex items-center gap-4 text-xl font-bold xsphone:ps-0">
          <span className="text-primary">Sport Science</span>
          {/* Toggle Button - Only on Mobile */}
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-gray-200 text-primary p-1 rounded tablet:hidden"
            >
              ☰
            </button>
          )}
        </div>
        <div className="flex flex-col tablet:flex-row gap-2 items-center">
          <div className="">
            <p className="text-sm">{user?.user?.name}</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            <img
              src={
                user?.user?.profile
                  ? `${API_BASE_URL}/storage/${user?.user?.profile}`
                  : "/assets/profile/default-profile.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed z-[9999] top-16 left-0 w-64 h-full bg-white shadow-lg transform tablet:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out tablet:block`}
      >
        <div className="p-4 border-b flex justify-between items-center tablet:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-600">
            &times;
          </button>
        </div>
        {getUserRole() === "admin" && (
          <nav className="p-4">
            <a
              onClick={() => setActiveTab("dashboard")}
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
            >
              Dashboard
            </a>
            <a
              onClick={() => setActiveTab("sports")}
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
            >
              Sports
            </a>
            <a
              onClick={() => setActiveTab("accounts")}
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
            >
              Accounts
            </a>
            <div className="w-full py-2  border-t-2">
              <span className="px-4 text-gray-400 text-sm">Manage Profile</span>
              <a
                onClick={() => setActiveTab("profile")}
                href="#"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
              >
                Profile
              </a>
            </div>
            <a
              href="#"
              onClick={handleLogout}
              className="block py-2 px-4 hover:bg-gray-200 rounded absolute bottom-20 text-red-500"
            >
              Logout
            </a>
          </nav>
        )}
        {getUserRole() === "athlete" && (
          <nav className="p-4">
            <a
              onClick={() => setActiveTab("dashboard")}
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
            >
              My Activity
            </a>
            <div className="w-full py-2  border-t-2">
              <span className="px-4 text-gray-400 text-sm">Manage Profile</span>
              <a
                onClick={() => setActiveTab("profile")}
                href="#"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
              >
                Profile
              </a>
            </div>
            <a
              href="#"
              onClick={handleLogout}
              className="block py-2 px-4 hover:bg-gray-200 rounded absolute bottom-20 text-red-500"
            >
              Logout
            </a>
          </nav>
        )}

        {getUserRole() === "coach" && (
          <nav className="p-4">
            <a
              onClick={() => setActiveTab("dashboard")}
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
            >
              Dashboard
            </a>
            <a
              onClick={() => setActiveTab("athletes")}
              href="#"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
            >
              Athletes Performance
            </a>
            <div className="w-full py-2  border-t-2">
              <span className="px-4 text-gray-400 text-sm">Manage Profile</span>
              <a
                onClick={() => setActiveTab("profile")}
                href="#"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
              >
                Profile
              </a>
            </div>
            <a
              href="#"
              onClick={handleLogout}
              className="block py-2 px-4 hover:bg-gray-200 rounded absolute bottom-20 text-red-500"
            >
              Logout
            </a>
          </nav>
        )}
      </div>
    </div>
  );
}
