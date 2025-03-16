import React, { useEffect, useState } from 'react';
import { Plus, Search, Truck, X } from 'lucide-react';
import { LocalClient } from '../Api/API_Client';
import { CreateDriver, CreatVehicle } from '../Api/Endpoints';
import { toast } from "react-toastify";


// Modal component with transparent background
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        {title && <h2 className="text-xl font-bold mb-6">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      {...props}
    />
  </div>
);

function ManageDrivers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    driverName: '',
      phoneNo: '',
    vehicleType: '',
    vehicleNo: '',
    vehicleId:""
  });
  const [vehicleFormData, setVehicleFormData] = useState({
    vehicleNo: '',
    vehicleType: '',
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNo') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    try {
       
      const response =await LocalClient.post(CreatVehicle,vehicleFormData)

      if (response.status===201) {
        toast.success("Vehicle created successfully!");
      }


    } catch (error) {

      toast.error(" Something went wrong ")
      
    }
 
    console.log("this is the vehicle data submitted ",vehicleFormData);
    
    setIsVehicleModalOpen(false);
    setVehicleFormData({ vehicleNo: '', vehicleType: '' });
 


  };

//  fetching the Vehicles by vehicle no 
useEffect(() => {
  if (search.length < 2 || formData.vehicleNo === search) {
    return;
  }

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const result = await LocalClient.get(`vehicle-list?search=${search}`);

      console.log("✅ Response Data:", result.data);

  

      setVehicles(result.data);
    } catch (error) {
      console.error("❌ Error fetching vehicles:", error);
    }
    setLoading(false);
  };

  
  const delayDebounce = setTimeout(fetchVehicles, 300);

  return () => clearTimeout(delayDebounce);
}, [search]);


  const handleVehicleSelect = (vehicle) => {
    console.log(" this is the vehicle selected " ,vehicle);
    setFormData((prev) => ({
      ...prev,
      vehicleNo: vehicle.vehicleNo,
      vehicleType: vehicle.vehicleType,
      vehicleId:vehicle.id
    }));
    setFormData((prev) => ({ ...prev, vehicleNo: vehicle.vehicleNo }));
    setSearch(vehicle.vehicleNo);
    setVehicles([]);
  };



  const handleAddDriver= async (e) => {
    e.preventDefault();
  
    try {

      // ✅ Send POST request using Axios
      const response = await LocalClient.post(CreateDriver, formData);
  console.log(" this is the responce", response);
  
      if (response.status === 201) {
        toast.success("Driver Added successfully!");
        setSearch("")
        // ✅ Close modal & reset form
        setIsVehicleModalOpen(false);
        setFormData({ driverName: '', phoneNo: '', vehicleType: '', vehicleNo: '' ,vehicleId:""});
      }

      console.log(" this is the driver details that is been submmited ",formData);
      
    } catch (error) {
      console.error("🚨 Error adding vehicle:", error);
      alert("Failed to create vehicle. Please try again.");
    }
  };
  

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Manage Drivers</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Driver
          </button>
        </div>


        {/* Add Driver Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Driver">
          <form onSubmit={handleAddDriver}>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Driver Name"
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleInputChange}
                placeholder="Enter driver name"
                required
              />
              <InputField
                label="Phone Number"
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Number
              </label>
              <div className="relative flex items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search vehicle number..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(true)}
                  className="ml-2 p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {loading && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}

              {vehicles.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-lg w-full mt-1 max-h-48 overflow-y-auto">
                  {vehicles.map((vehicle) => (
                    <li
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    >
                      <Truck size={16} className="text-gray-500" />
                      <span>{vehicle.vehicleNo}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <InputField
              label="Vehicle Type"
              type="text"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              placeholder="Enter vehicle type"
              required
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                 type='submit'
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Driver
              </button>
            </div>
          </form>
        </Modal>

        {/* Add Vehicle Modal */}
        <Modal
          isOpen={isVehicleModalOpen}
          onClose={() => setIsVehicleModalOpen(false)}
          title="Add Vehicle"
        >
          <form onSubmit={handleVehicleSubmit}>
            <InputField
              label="Vehicle Number"
              type="text"
              name="vehicleNo"
              value={vehicleFormData.vehicleNo}
              onChange={handleVehicleInputChange}
              placeholder="Enter vehicle number"
              required
            />
            <InputField
              label="Vehicle Type"
              type="text"
              name="vehicleType"
              value={vehicleFormData.vehicleType}
              onChange={handleVehicleInputChange}
              placeholder="Enter vehicle type"
              required
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(false)}
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

        {/* Driver List */}
        <div className=" rounded-lg overflow-hidden shadow-sm mt-2">
          <div className="bg-gray-50 p-3 border-b mb-2">
            <div className="grid grid-cols-12 gap-4 font-medium text-gray-600">
              <div className="col-span-4">Driver Name</div>
              <div className="col-span-3">Phone Number</div>
              <div className="col-span-3">Vehicle Number</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {drivers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No drivers found</div>
            ) : (
              drivers.map((driver) => (
                <div
                  key={driver.id}
                  className="p-3  hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4 font-medium">{driver.driverName}</div>
                    <div className="col-span-3">{driver.phoneNo}</div>
                    <div className="col-span-3">{driver.vehicleNo}</div>
                    <div className="col-span-2 flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
 </>
  );
}

export default ManageDrivers;



// creat a documentation for  the work flow where  to create a driver  in the create new driver th euser need to  fill th edriver name 
// and this phone number and as he fill the other fiekld he has to search for the vehicle  if the vehicle is not found he can create a 
// vehicle  with the vehicle No and the vehicle type  and after the he as the user select the vehicle no th evehicle type gets auto filled
//  for the creation of  driver