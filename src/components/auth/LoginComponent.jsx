import React, { useState } from "react";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showAlert } from "../swal/showAlert";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";
const VITE_FRONTEND_BASE_URL =
  import.meta.env.VITE_FRONTEND_BASE_URL || "http://localhost:5173/";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  //for forgot password
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        // alert('not ok')
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful:", data);
      localStorage.setItem("sport-science-token", JSON.stringify(data));
      // Handle successful login (e.g., store token, redirect user)
      window.location.href = `/${data.user.role}`;
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const reset_link = `${VITE_FRONTEND_BASE_URL}/reset-password`
      const response = await fetch(
        `${API_BASE_URL}/api/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email,reset_link }),
        }
      );

      if (response.ok) {
        // alert("Password reset link sent to your email");
        showAlert("Password Reset", "A reset link has been sent to your email.", "success");
        setIsForgotModalOpen(false);
        setEmail('')
      } else {
        // alert("Failed to send password reset link");
        showAlert("Password Reset Failed", "Failed to send reset link. Please try again.", "error");
        setEmail('')
      }
    } catch (error) {
      console.error("Password reset failed", error);
    }
  };

  return (
    <div className="login-container w-full h-screen flex items-center justify-center">
      <div className="login-card relative w-[90%] tablet:w-[30%] p-4 tablet:p-6 rounded-sm">
        <div className="absolute inset-0 bg-black opacity-50 rounded-sm z-0"></div>
        <div className="relative z-10">
          <div className="mb-5">
            <img src="/assets/logo/logo.png" alt="Logo" />
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 rounded bg-transparent border text-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 rounded bg-transparent border text-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="mb-5 text-end w-full">
              <a
                href="#"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-white hover:border-b-2"
              >
                Forgot password?
              </a>
            </div>
            <div className="bg-primary mb-5">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1 rounded-sm font-bold cursor-pointer p-2 text-white hover:bg-white hover:text-primary"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                Login Now
              </button>
            </div>
            <p className="text-xs text-slate-400 text-start font-semibold tracking-wider">
              Collaborative Sport Science with Athlete Performance Analysis
              using Linear Regression
            </p>
          </form>
        </div>
      </div>

      {/* Reset Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 p-2 flex justify-center items-center z-10">
          <div className="bg-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Forgot Password
            </h2>
            <p className="text-gray-600 mb-4">
              Enter your email to receive a password reset link.
            </p>
            <input
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4 bg-transparent text-primary"
              placeholder="Enter your email"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button onClick={handlePasswordReset} className="px-4 py-2 bg-primary text-white rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
