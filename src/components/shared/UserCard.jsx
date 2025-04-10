import React from "react";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";
const API_BASE_URL = import.meta.env.VITE_FRONTEND_Image_URL || "http://127.0.0.1:8001";
const token = JSON.parse(localStorage.getItem("sport-science-token"));
const UserCard = ({ user }) => {
  const handleEdit = async () => {
    // SweetAlert to ask for new details (e.g., name, email, or role)
    const { value: formValues } = await Swal.fire({
      title: 'Edit User Details',
      html: `
        <div class="flex flex-col">
        <input id="name" class="swal2-input" placeholder="Name" value="${user.name}" />
        <label>Name</label>
        </div>
        <div class="flex flex-col">
        <input id="email" class="swal2-input" placeholder="Email" value="${user.email}" />
        <label>Email</label>
        </div>
        <div class="flex flex-col">
        <input id="role" class="swal2-input" placeholder="Role" value="${user.role}" />
        <label>Role</label>
        <div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          role: document.getElementById('role').value,
          id: user.id, // Including the user's id here
        };
      },
    });

    if (formValues) {
      const { name, email, role,id } = formValues;

      // You can now send the updated data to the API for saving (e.g., using fetch or axios)
      console.log("Updated Data:", { name, email, role,id });

      // Example API request
      try {
        const response = await fetch(`${API_BASE}/api/profile/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify({ name, email, role, id}),
        });

        if (response.ok) {
          Swal.fire('Success', 'User updated successfully!', 'success');
          window.location.reload(true)
        } else {
          Swal.fire('Error', 'There was an issue updating the user.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'There was an issue updating the user.', 'error');
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">{user.name}</h2>
        <span
          className="mt-2 inline-block px-2 rounded-full text-sm cursor-pointer"
          onClick={handleEdit}
        >
          Edit
        </span>
      </div>
      {user.image ? (
        <img
          src={`${API_BASE_URL}/${user.image}`}
          alt={user.name}
          className="w-full h-40 object-cover mt-2 rounded-lg"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 mt-2 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <div className="flex flex-col gap-1 py-2">
        <h2 className="text-base break-words">
          <span className="break-words">{user.email}</span>
        </h2>

        <h2 className="text-base">
          <span className="bg-primary p-1 rounded-md text-white text-xs uppercase">{user.role}</span>
        </h2>
      </div>
    </div>
  );
};

export default UserCard;
