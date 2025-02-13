import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { InputFields } from '../SmallComponents';
import { LocalClient } from '../Api/API_Client';

const ManageCategory = () => {
  const [create, setCreate] = useState(false);
  const [data, setFormData] = useState({
   category:""
  });

  const handleAddDriver = () => {
    setCreate((prev) => !prev);
  };

  const DriverdetailsInput = [
    { id: "category", label: "Category Name ", placeholder: "Category Name", type: "text", required: true, name: "category" }
   
  ];

  const handleInputChange = (e) => {
    const { name, type, value } = e.target;
    if (name === 'phNumber') {
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
    e.preventDefault(); // Prevent form from refreshing the page

    try {
      console.log(" thsi sis the request data ",data);
      
      const response = await LocalClient.post("createCategory", data);
      console.log(" this is the responce ",response);

      if (response.status ===201) {

        console.log(" statement inside the ");
        
        alert(response.data.message); // Success message
        setCreate(false); // Close form after submission
        setFormData({
          companyName: "",
          
        }); // Reset the form data
      }
       else {
        alert(response.data.message); // Show error message from response
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside of the 2xx range
        if (error.response.status === 404) {
          alert('User not found. Please check your credentials.');
        } else if (error.response.status === 401) {
          alert('Incorrect password. Please try again.');
        } else {
          alert('error: ' + error.response.data.message);
        }
      } else if (error.request) {
        // No response was received from the server
        alert('No response from the server. Please check your network connection.');
      } else {
        // Something else caused the error
        alert('An error occurred while logging in.');
      }
      console.log(" this is the error " ,error);
      
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Manage Category</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleAddDriver}
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      {/* Render the form when create is true */}
      {create && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
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

export default ManageCategory;
