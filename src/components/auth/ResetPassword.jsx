import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useSearchParams } from "react-router-dom";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showAlert } from "../swal/showAlert";
import { showLoader } from "../swal/showLoader";
// import axios from "axios";

let API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_FORGOT || "http://127.0.0.1:8001";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setMessage("Invalid or expired reset link.");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader("Processing...", "Please wait while we reset your password");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      Swal.close();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Force JSON response
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json(); // Convert response to JSON
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      Swal.close();
      console.log("Password reset successful:", data);
      showAlert(
        "Password reset successful",
        "Proceed to login now!",
        "success"
      );
      window.location.href = "/";
    } catch (error) {
      Swal.close();
      setMessage(error.response?.data?.detail || "Failed to reset password.");
    }
  };

  // return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  //         <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
  //             <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
  //             {message && <p className="text-center text-red-500 mt-2">{message}</p>}
  //             <form onSubmit={handleSubmit} className="mt-4">
  //                 <input
  //                     type="password"
  //                     placeholder="New Password"
  //                     value={password}
  //                     onChange={(e) => setPassword(e.target.value)}
  //                     className="w-full p-2 border rounded mb-3"
  //                     required
  //                 />
  //                 <input
  //                     type="password"
  //                     placeholder="Confirm Password"
  //                     value={confirmPassword}
  //                     onChange={(e) => setConfirmPassword(e.target.value)}
  //                     className="w-full p-2 border rounded mb-3"
  //                     required
  //                 />
  //                 <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700">
  //                     Reset Password
  //                 </button>
  //             </form>
  //         </div>
  //     </div>
  // );

  return (
    <div className="login-container w-full h-screen flex items-center justify-center">
      <div className="login-card relative w-[80%]  tablet:w-[30%] tablet:p-6 p-4 rounded-sm">
        <div className="absolute inset-0 bg-black opacity-50 rounded-sm z-0"></div>
        <div className="relative z-10">
          <div className="mb-5">
            <img src="/assets/logo/logo.png" alt="Logo" />
          </div>
          {message && (
            <p className="text-center text-red-500 mt-2">{message}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <label htmlFor="password" className="text-white">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full p-2 rounded bg-transparent border text-white"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  const isValid = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);
                  if (!isValid) {
                    setPasswordError(
                      "Password must be at least 8 characters with upper and lowercase letters."
                    );
                  } else {
                    setPasswordError("");
                  }

                  // Also check confirm match if it's already filled
                  if (confirmPassword && value !== confirmPassword) {
                    setConfirmError("Passwords do not match.");
                  } else {
                    setConfirmError("");
                  }
                }}
                required
              />
              {passwordError && (
                <p className="text-red-400 text-sm mt-1">{passwordError}</p>
              )}
              <button
                type="button"
                className="absolute right-3 top-[38px] text-sm text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="mb-5 relative">
              <label htmlFor="password" className="text-white">
                Confirm Password
              </label>
              <input
                type={showPasswordConfirm ? "text" : "password"}
                id="confirm-password"
                className="w-full p-2 rounded bg-transparent border text-white"
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setConfirmPassword(value)
                  // Also check confirm match if it's already filled
                  if (value !== password) {
                    setConfirmError('Passwords do not match.');
                  } else {
                    setConfirmError('');
                  }
                }}
                required
              />
              {confirmError && (
                <p className="text-red-400 text-sm mt-1">{confirmError}</p>
              )}
              <button
                type="button"
                className="absolute right-3 top-[38px] text-sm text-white"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              >
                {showPasswordConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="bg-transparent border mb-5">
              <a
                href="/login"
                className="w-full flex items-center justify-center gap-1 rounded-sm font-bold cursor-pointer p-2 text-white hover:bg-white hover:text-primary"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                Cancel
              </a>
            </div>
            <div className="bg-primary mb-5">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1 rounded-sm font-bold cursor-pointer p-2 text-white hover:bg-white hover:text-primary"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                Reset Password
              </button>
            </div>
            <p className="text-xs text-slate-400 text-start font-semibold tracking-wider">
              Collaborative Sport Science with Athlete Performance Analysis
              using Linear Regression
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
