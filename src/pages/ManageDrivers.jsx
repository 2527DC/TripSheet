import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {  Edit, MoreVertical, Plus, Search, Trash2, Truck, X } from 'lucide-react';
import { LocalClient } from '../Api/API_Client';
import { API, CreateDriver, CreatVehicle } from '../Api/Endpoints';
import { toast } from "react-toastify";

// Memoized Modal component
const Modal = React.memo(({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        {title && <h2 className="text-xl font-bold mb-6">{title}</h2>}
        {children}
      </div>
    </div>
  );
});

// Memoized Input Field Component
const InputField = React.memo(({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      {...props}
    />
  </div>
));

// Memoized Driver List Component
const DriverList = React.memo(({ drivers , menuOpen ,handleEditDriver ,toggleMenu ,handleDeleteDriver ,}) => (

  <div className="rounded-lg overflow-hidden shadow-sm mt-2">
    <div className="bg-gray-50 p-3 border-b mb-2">
      <div className="grid grid-cols-12 gap-4 font-medium text-gray-600">
        <div className="col-span-4">Driver Name</div>
        <div className="col-span-3">Phone Number</div>
        <div className="col-span-3">Vehicle Number</div>
      </div>
    </div>
    <div className="h-[400px] mb-5 overflow-y-auto">
      {drivers.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No drivers found</div>
      ) : (
        drivers.map((driver) => (
          <div
            key={driver.id}
            className="p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4 font-medium">{driver.name}</div>
              <div className="col-span-3">{driver.phoneNo}</div>
              <div className="col-span-3">{driver.vehicle.vehicleNo}</div>
                <div className="relative">
                      <button onClick={() => toggleMenu(driver.id)} className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreVertical size={20} className="text-gray-600" />
                      </button>
                      {menuOpen=== driver.id&& (
                        <div className="absolute right-0 mt-2 flex bg-white rounded-lg shadow-lg border border-gray-100 z-10 p-2">
                          <button onClick={() => handleEditDriver(driver)} className="flex flex-col items-center px-3 py-2 text-gray-700 hover:bg-gray-50">
                            <Edit size={18} color='blue' />
                            <span className="text-xs">Manage</span>
                          </button>
                          <button onClick={() => handleDeleteDriver(driver)} className="flex flex-col items-center px-3 py-2 text-gray-700 hover:bg-gray-50">
                            <Trash2 size={18} color='red' />
                            <span className="text-xs">Delete</span>
                          </button>
                        </div>
                      )}
                    </div>  
            </div>
          </div>
        ))
      )}
    </div>
  </div>
));

function ManageDrivers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    driverName: '',
    phoneNo: '',
    vehicleType: '',
    vehicleNo: '',
    vehicleId: ""
  });
  
  const [search, setSearch] = useState('');
  const [searchVendor, setSearchVendor] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vehicleFormData, setVehicleFormData] = useState({
    vehicleNo: '',
    vehicleType: '',
    vendorId: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const[isEditOpen,setIsEditOpen]=useState(false)
  // Memoized fetch drivers function
  const fetchDrivers = useCallback(async () => {
    try {
      const response = await LocalClient.get("getDrivers");
      if (response.status === 200) {
        setDrivers(response.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch drivers');
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Optimized vehicle search with cleanup
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchVehicles = async () => {
      if (search.length < 2 || formData.vehicleNo === search) return;
      
      setLoading(true);
      try {
        const result = await LocalClient.get(`vehicle-list?search=${search}`, {
          signal: controller.signal
        });
        if (isMounted) setVehicles(result.data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching vehicles:", error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchVehicles, 300);
    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(debounceTimer);
    };
  }, [search, formData.vehicleNo]);

  // Optimized vendor search with cleanup
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchVendors = async () => {
      if (searchVendor.length < 2 || selectedVendor === searchVendor) {
        setVendors([]);
        return;
      }

      try {
        setVendorLoading(true);
        const response = await LocalClient.get(`searchVendor?search=${searchVendor}`, {
          signal: controller.signal
        });
        if (isMounted && response.status === 200) {
          setVendors(response.data);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching vendors:", error);
        }
      } finally {
        if (isMounted) setVendorLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchVendors, 300);
    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(debounceTimer);
    };
  }, [searchVendor, selectedVendor]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'phoneNo') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleVehicleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setVehicleFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleVehicleSelect = useCallback((vehicle) => {
    setFormData(prev => ({
      ...prev,
      vehicleNo: vehicle.vehicleNo,
      vehicleType: vehicle.vehicleType,
      vehicleId: vehicle.id
    }));
    setSearch(vehicle.vehicleNo);
    setVehicles([]);
  }, []);

  const handleVendorSelect = useCallback((vendor) => {
    setSelectedVendor(vendor.name);
    setSearchVendor(vendor.name);
    setVehicleFormData(prev => ({
      ...prev,
      vendorId: vendor.id,
    }));
    setVendors([]);
  }, []);

  const handleVehicleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await LocalClient.post(CreatVehicle, vehicleFormData);
      if (response.status === 201) {
        toast.success("Vehicle created successfully!");
        setIsVehicleModalOpen(false);
        setVehicleFormData({ vehicleNo: '', vehicleType: '', vendorId: null });
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }, [vehicleFormData]);

  const handleAddDriver = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await LocalClient.post(CreateDriver, formData);
      if (response.status === 201) {
        toast.success("Driver Added successfully!");
        fetchDrivers();
        setIsModalOpen(false);
        setFormData({ driverName: '', phoneNo: '', vehicleType: '', vehicleNo: '', vehicleId: "" });
        setSearch("");
      }
    } catch (error) {
      toast.error("Failed to add driver");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, fetchDrivers]);

  // Memoized vehicles list
  const memoizedVehicles = useMemo(() => (
    vehicles.map(vehicle => (
      <li
        key={vehicle.id}
        onClick={() => handleVehicleSelect(vehicle)}
        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
      >
        <Truck size={16} className="text-gray-500" />
        <span>{vehicle.vehicleNo}</span>
      </li>
    ))
  ), [vehicles, handleVehicleSelect]);

  // Memoized vendors list
  const memoizedVendors = useMemo(() => (
    vendors.map(vendor => (
      <li
        key={vendor.id}
        onClick={() => handleVendorSelect(vendor)}
        className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 transition"
      >
        <Truck size={18} className="text-gray-500" />
        <span className="text-gray-700">{vendor.name}</span>
      </li>
    ))
  ), [vendors, handleVendorSelect]);


  const handleEditDriver = useCallback((driver) => {
    setIsEditOpen(true)

    console.log(" handle driver edit Cloicked ");
  }, []);

  const toggleMenu = useCallback((driver) => {
  console.log(" this is the driver fro toggle button" ,driver);
  setMenuOpen(prev => prev === driver ? null : driver);
    console.log(" Toggle button clicked  ");
  }, []);

   const handleDeleteDriver=useCallback(async(driver) => {
   
    try {
      const response= await LocalClient.delete(`${API.deleteDriver}?driverId=${driver.id}`)
      if (response.status===200) {
        setDrivers((prevDrivers) => prevDrivers.filter(d => d.id !== driver.id));
        toast.success(" Driver Deleted successfully")
      }
    } catch (error) {
      console.log(" Error ",error);
      
      toast.error(" Error Delecting  Driver ")
    }

   
  }, []);

      const handleEditSubmit=useCallback(async(e) => {
        e.preventDefault();
        console.log(" this  is the driver",driver);
        console.log(" this is the submited data",formData);


      }, []);
  return (
    <>
    <div className="bg-white rounded-lg shadow-md p-2">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Manage Drivers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Add driver"
        >
          <Plus size={20} />
          Add Driver
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Driver">
        <form onSubmit={handleAddDriver}>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Driver Name"
              name="driverName"
              value={formData.driverName}
              onChange={handleInputChange}
              placeholder="Enter driver name"
              required
            />
            <InputField
              label="Phone Number"
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
                aria-label="Add vehicle"
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
                {memoizedVehicles}
              </ul>
            )}
          </div>

          <InputField
            label="Vehicle Type"
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
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Driver'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isVehicleModalOpen} onClose={() => setIsVehicleModalOpen(false)} title="Add Vehicle">
        <form onSubmit={handleVehicleSubmit}>
          <InputField
            label="Vehicle Number"
            name="vehicleNo"
            value={vehicleFormData.vehicleNo}
            onChange={handleVehicleInputChange}
            placeholder="Enter vehicle number"
            required
          />
          <InputField
            label="Vehicle Type"
            name="vehicleType"
            value={vehicleFormData.vehicleType}
            onChange={handleVehicleInputChange}
            placeholder="Enter vehicle type"
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Vendor
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchVendor}
              onChange={(e) => setSearchVendor(e.target.value)}
              placeholder="Search Vendor..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

            {vendorLoading && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {vendors.length > 0 && (
            <ul className="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-lg w-[200px] mt-2 max-h-48 overflow-y-auto">
              {memoizedVendors}
            </ul>
          )}

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
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit driver">
      <form onSubmit={handleEditSubmit}>
      <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Driver Name"
              name="driverName"
              value={formData.driverName}
              onChange={handleInputChange}
              placeholder="Enter driver name"
              required
            />
            <InputField
              label="Phone Number"
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
                aria-label="Add vehicle"
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
                {memoizedVehicles}
              </ul>
            )}
          </div>

      <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Driver'}
            </button>
          </div>
      </form>

      </Modal>
   
      
    </div>
  
    <DriverList drivers={drivers} menuOpen={menuOpen}
     setIsEditOpen={()=>setIsEditOpen(true)}
      toggleMenu={toggleMenu} handleEditDriver={handleEditDriver}
      handleDeleteDriver={handleDeleteDriver} />
    </>
  );
}

export default React.memo(ManageDrivers);



