import { useState } from "react";
import Swal from "sweetalert2";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const ProfileManagement = ({ user }) => {
  // console.log(user)
  const [formData, setFormData] = useState({
    id: user?.user?.id,
    name: user?.user?.name,
    email: user?.user?.email,
    avatar: `${user?.user?.profile}`,
    image: null,
    password: "",
    confirmPassword: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password && formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      return;
    }
  
   
    try {
      const tokens = JSON.parse(localStorage.getItem("sport-science-token"));
      if (!tokens) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "User is not logged in.",
        });
        return;
      }
  
      const userFormDataUpdate = new FormData();
      userFormDataUpdate.append("id", formData.id);
      userFormDataUpdate.append("name", formData.name);
      userFormDataUpdate.append("email", formData.email);
      userFormDataUpdate.append("password", formData.password);
      userFormDataUpdate.append("image", formData.image);
      console.log("Form data:",formData)
      console.log("FormData entries:");
      for (let pair of userFormDataUpdate.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }
  
      const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.token}`,
        },
        body: userFormDataUpdate,
      });
      
      const savedSport = await response.json();
      console.log(savedSport)
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: savedSport.message,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            // update the user data in local storage
            let storageData = JSON.parse(localStorage.getItem('sport-science-token'))
            // Update only the user object with the new values
            storageData.user = { ...storageData.user, ...savedSport.user };

             // Save updated data back to localStorage
            localStorage.setItem('sport-science-token', JSON.stringify(storageData));

            console.log("User updated in localStorage:", storageData.user);


            window.location.reload(); // Refresh the page
          }
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Failed to update profile.",
        });
        console.error("Failed to update profile:", errorData);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="p-4 text-gray-700">
      <div className="p-4 border rounded-lg shadow-md bg-white">
        <h1 className="text-2xl font-semibold mb-4">User Profile Management</h1>
        <form id="profileForm" onSubmit={handleSubmit} className="space-y-4">
          <input type="number" name="id" id="" />
          <div className="flex flex-col tablet:flex-row gap-4 items-center">
            {/* https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png */}
            <img
              src={formData.avatar != "null" ? `${API_BASE_URL}/storage/${formData.avatar}` : "https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png"}
              alt="Avatar"
              className="w-[70%] h-full tablet:w-28 tablet:h-20  rounded-md border"
            />
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="w-full tablet:w-[30%] p-2 border rounded"
              onChange={handleImageChange}
              // onChange={(e) => {
              //   // handleImageChange()
              //   const file = e.target.files[0];
              //   // setFormData
              //   if (file) {
              //     const reader = new FileReader();
              //     reader.onload = () =>
              //       setFormData({ ...formData, avatar: reader.result });
              //     reader.readAsDataURL(file);
              //   }
              // }}
            />
          </div>
          <div className="mb-4">
            <h1 className="text-primary text-xl font-semibold mb-2">
              Basic Information
            </h1>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2 w-full">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

            {/* <p className="text-gray-400">Password only available on login...</p> */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2 w-full">
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <p className="text-gray-400">Password must be 6 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <p className="text-gray-400">Password must be 6 characters</p>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary w-full tablet:w-[20%] text-white rounded"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileManagement;
