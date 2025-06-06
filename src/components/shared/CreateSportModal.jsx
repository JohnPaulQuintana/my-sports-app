import { useState } from "react";

export default function CreateSportModal({ isOpen, onClose, onSubmit, availableCoach }) {
  // console.log(availableCoach)
  const [formData, setFormData] = useState({
    name: "",
    descriptions: "",
    image: null,
    coach: "", // Add coach field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[9999999]">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create Sport</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-gray-600 font-medium">Sport Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-gray-600 font-medium">Description</label>
            <textarea
              name="descriptions"
              value={formData.descriptions}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-600 font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-2 py-1 border rounded-md"
              required
            />
          </div>

          {/* Assign Coach */}
          <div>
            <label htmlFor="coachSelect" className="block text-sm font-medium text-gray-700">
              Assign Coach
            </label>
            <select
              id="coachSelect"
              name="coach"
              value={formData.coach} // Controlled input
              onChange={handleChange} // Handle selection change
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Coach</option>
              {availableCoach.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.name}
                </option>
              ))}
            </select>
          </div>


          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
