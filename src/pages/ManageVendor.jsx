import { Plus } from 'lucide-react';
import React, { useState } from 'react';

import { LocalClient } from '../Api/API_Client';

import { toast } from 'react-toastify';

import { Modal ,InputField } from '../components/SmallComponents';


const ManageVendor = () => {
  const [create, setCreate] = useState(false);
  const [isModalOpen,setIsModalOpen]=useState(false)
  const [formData, setFormData] = useState({
    vendorName: "",
       vendorPh: ""
  });

  const handleAddDriver = () => {
    setIsModalOpen(true)
    setCreate((prev) => !prev);
  };

  const DriverdetailsInput = [
    { id: "vendorName", label: "Vendor Name", placeholder: "Vendor Name", type: "text",  name: "vendorName" },
    { id: "phoneNo", label: "Phone No", placeholder: "Phone No", type: "text",  name: "vendorPh" },
  ];

  const handleInputChange = (e) => {
    const { name, type, value } = e.target;

    // If phone number field, allow only digits and limit length to 10
    if (name === 'vendorPh') {
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
      const response = await LocalClient.post("createVendor", formData);
      console.log("This is the response:", response);

      if (response.status === 201) {
        toast.success(response.data.message); // Success message
        setCreate(false); // Close form after submission
        setFormData({
          vendorName: "",
          vendorPh: "",
           
        }); // Reset the form data
      } else {
        toast.error(response.data.message); // Show error message from response
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        toast.error('No response from the server. Please check your network connection.');
      } else {
        toast.error('An error occurred while processing your request.');
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Vendor">
  <form onSubmit={handleSubmit}>
    <div className="grid grid-cols-2 gap-4">
      {DriverdetailsInput.map((input, index) => (
        <InputField
          key={index}
          label={input.label}
          type={input.type}
          name={input.name}
          value={formData[input.name]}  // Make sure it dynamically picks the correct value
          onChange={handleInputChange}
          placeholder={input.placeholder}
          required
        />
      ))}
    </div>
    <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
  </form>
</Modal>


    </div>
  );
};

export default ManageVendor;
