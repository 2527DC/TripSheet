import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { InputFields } from '../SmallComponents';
import axios from 'axios';

const ManageDrivers = () => {
  const [create, setCreate] = useState(false);


  const [data, setFormData] = useState({
    driverName: "",
    vehicleNO: "",
    vehicleType: "", // Vendor selection
    phNumber: null,
   
  });
  
  const handleAddDriver = () => {
    setCreate((prev) => !prev);
    console.log("This value of create:", create);
  };
  const DriverdetailsInput = [
    { id: "driver", label: "Driver Name", placeholder: "Driver Name", type: "text", required: true, name: "driverName" },
    { id: "vehicleNo", label: "Vehicle No", placeholder: "Vehicle No", type: "text", required: true, name: "vehicleNO" },
    { id: "vehicletype", label: "Vehicle Type", placeholder: "Vehicle Type", type: "text", required: true, name: "vehicleType" },
    { id: "phNumber", label: "Phone No", placeholder: "phNumber", type: "number", required: true, name: "phNumber" },
  ]



  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;
    
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? (files && files[0]) :   
        ["openKm", "closeKm"].includes(name) ?
          Number(value) || 0 : value,
    }));
  };


  const handleSubmit= async()=>{

    const responce=await axios.post("")

  }
  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Manage Drivers</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleAddDriver}
          >
            <Plus size={18} />
            Add Driver
          </button>
        </div>
      </div>

      {/* Render the form when create is true */}
      {create && (
        <div className="mt-4 bg-gray-100 p-4  rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Add New Driver</h3>
          <form>

           <div className=' flex grid-cols-3 gap-4' >
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

export default ManageDrivers;
