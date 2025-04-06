import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const Category = ({ sport_id }) => {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //   handle the category updates
  const handleCategoryUpdate = (category_id, initialValue, initialValueDesc) => {
    Swal.fire({
      title: "Edit performance category",
      html: `
        <div class="mb-4">
          <label for="sport-category" class="text-white mb-2 block">Category Name</label>
          <input type="text" value="${initialValue}" id="sport-category" class="swal2 w-full border p-2" required/>
        </div>
        <div class="mb-4">
          <label for="description" class="text-white mb-2 block">Description</label>
          <textarea id="description" class="swal2 w-full border p-2" rows="4">${initialValueDesc}</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update Category",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const inputName = document.getElementById("sport-category").value;
        const inputDescription = document.getElementById("description").value;
  
        if (!inputName) {
          return Swal.showValidationMessage("Category name cannot be empty.");
        }
  
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/performance/category/update`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                category_id: category_id,
                name: inputName,
                description: inputDescription,  // Add the description here
              }),
            }
          );
  
          if (!response.ok) {
            return Swal.showValidationMessage(
              `Error: ${JSON.stringify(await response.json())}`
            );
          }
  
          const updatedData = await response.json();
  
          // Update the categories state after a successful update
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === category_id
                ? { ...category, name: inputName, description: inputDescription }
                : category
            )
          );
  
          return updatedData;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Successfully Updated!",
        });
      }
    });
  };
  

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("sport-science-token"));
        console.log("Token:", token); // Debugging
        if (!token || !token.token) return; // Ensure token is valid

        const response = await fetch(
          `${API_BASE_URL}/api/performance/categories/${sport_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.token}`,
            },
          }
        );

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch total sports");
        }

        setCategories(data?.categories[0]?.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [sport_id]);

  return (
    <div className="grid grid-cols-1 tablet:grid-cols-4 gap-2">
      {categories?.map((category) => (
        <div className="shadow p-4 border">
          <div
            key={category?.id}
            className="flex items-center justify-between mb-2"
          >
            <h1 className="text-lg font-bold uppercase text-primary">{category?.name}</h1>
            <a
              onClick={() => handleCategoryUpdate(category.id, category.name, category.description)}
              href="#"
              className="text-primary hover:underline"
            >
              Edit
            </a>
          </div>
          <p className="p-2 bg-gray-100 text-gray-600 rounded-md">{category.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Category;
