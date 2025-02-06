import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { InputFields } from '../SmallComponents';
import { LocalClient } from '../Api/API_Client';

const ManageVendor = () => {
  const [create, setCreate] = useState(false);
  const [data, setFormData] = useState({
    vendorName: "",
    phoneNo: "",  // Match Prisma schema
    city: ""
  });

  const handleAddDriver = () => {
    setCreate((prev) => !prev);
  };

  const DriverdetailsInput = [
    { id: "vendorName", label: "Vendor Name", placeholder: "Vendor Name", type: "text", required: true, name: "vendorName" },
    { id: "phoneNo", label: "Phone No", placeholder: "Phone No", type: "text", required: true, name: "phoneNo", len: 10 },
    { id: "city", label: "City", placeholder: "City", type: "text", required: true, name: "city" },
  ];

  const handleInputChange = (e) => {
    const { name, type, value } = e.target;

    // If phone number field, allow only digits and limit length to 10
    if (name === 'phoneNo') {
      // Only allow digits and limit to 10
      const formattedValue = value.replace(/\D/g, '').slice(0, 10); // Remove non-digits and slice to 10 digits
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("This is the request data:", data);

      const response = await LocalClient.post("createVendor", data);
      console.log("This is the response:", response);

      if (response.status === 201) {
        alert(response.data.message); // Success message
        setCreate(false); // Close form after submission
        setFormData({
          vendorName: "",
          phoneNo: "",
          city: "",
        }); // Reset the form data
      } else {
        alert(response.data.message); // Show error message from response
      }
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        alert('No response from the server. Please check your network connection.');
      } else {
        alert('An error occurred while processing your request.');
      }
      console.log("This is the error:", error);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Manage Vendors</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleAddDriver}
          >
            <Plus size={18} />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Render the form when create is true */}
      {create && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Add New Vendor</h3>
          <form onSubmit={handleSubmit}>
            <div className="flex grid-cols-3 gap-4">
              {DriverdetailsInput.map((input, index) => (
                <InputFields
                  key={index}
                  {...input}
                  value={data[input.name] || ""}
                  onChange={handleInputChange}
                />
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => setCreate(false)} // Close form
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageVendor;
