import { useState, useEffect } from "react";

export default function EditSportModal({isOpen,onClose,onSubmit,availableCoach,sport,API_BASE_URL}) {
  console.log("Editing sport with ID:", sport.name);
  // useEffect(() => {
  //   if (sport) {
  //     console.log("Editing sport with ID:", sport);
  //   }
  // }, [sport]);

  console.log(availableCoach)
  const [formData, setFormData] = useState({
    sport_id: sport.id,
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[99999999999]">
      <div className="bg-white rounded-lg p-6 max-h-[80vh] w-[90%] tablet:w-[50%] overflow-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Sport</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 grid grid-cols-1 tablet:grid-cols-2 gap-4 items-center"
        >
          {/* Name Input */}
          <div>
            <div>
              <label className="block text-gray-600 font-medium">
                Sport Name
              </label>
              {/* <input
                type="text"
                name="sport_id"
                value={formData.sport_id}
                onChange={handleChange}
                className="w-full hidden"
                required
              /> */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-gray-600 font-medium">
                Description
              </label>
              <textarea
                name="descriptions"
                value={formData.descriptions}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
            </div>

            {/* Image Upload */}
            <div className="w-full">
              <label className="block text-gray-600 font-medium">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-2 py-1 border rounded-md"
                
              />
            </div>

            {/* Assign Coach */}
            <div>
              <label
                htmlFor="coachSelect"
                className="block text-sm font-medium text-gray-700"
              >
                Assign Coach
              </label>
              <select
                id="coachSelect"
                name="coach"
                value={formData.coach} // Controlled input
                onChange={handleChange} // Handle selection change
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a Coach</option>
                {availableCoach.map((coach) => (
                  <option key={coach.id} value={coach.id}>
                    {coach.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border p-2 text-center">
            <span className="font-bold uppercase">{sport.name}</span>
          <img
                className="w-[300px]"
                src={`${API_BASE_URL}/storage/${sport.image}`}
                alt=""
                srcset=""
              />
              <span>{new Date(sport.created_at).toLocaleString()}</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-start space-x-2">
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
