
import React, { useEffect, useState } from 'react';
import { Menu, X, Plus, Search, Truck, Users, Building, LogOut, Boxes, FileSpreadsheet } from 'lucide-react';
import TripSheetForm from './TripsheetForm';
import ManageDrivers from './ManageDrivers';
import { useAuth } from '../store/ AuthProvider';
import ManageVendor from './ManageVendor';
import { TripList } from './Trips';
import { LocalClient } from '../Api/API_Client';
import TripDetails from './TripDetails';
import ManageCompany from './ManageCompany';
import ManageCategory from './ManangeCategory';
import handleDownloadExcel from './DownloadExcel';


function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('trips'); // trips, drivers, vendors

  const [createtrip,setCreateTrip] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);    
  const [totalPages, setTotalPages] = useState(1);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("all");
  const tripsPerPage = 5;



 const {logout}=useAuth()

  const handleNewClick = () => {
    console.log("The new trip sheet has been clicked");
    setCreateTrip((prev) => !prev); // Toggle the state
    console.log(" this the value of it ",createtrip);
    
  };

  console.log(" this is the from date  and todate ",toDate , fromDate,selectedVendor );
  
  const getTripList = async () => {
    // ✅ Validation: Vendor must be selected
    if (!selectedVendor || selectedVendor === "Select Vendor") {
      console.log("Please select a valid vendor.");
      return;
    }
  
    // ✅ Validation: Dates must not be empty
    if (!fromDate || !toDate) {
      console.log("Both From Date and To Date are required.");
      return;
    }
  
    // ✅ Validation: To Date must not be before From Date
    const from = new Date(fromDate);
    const to = new Date(toDate);
  
    if (to < from) {
      console.log("To Date cannot be before From Date.");
      return;
    }
  
    try {
      const response = await LocalClient.get("trips", {
        params: {
          vendorName: selectedVendor,
          fromDate: fromDate,
          toDate: toDate,
        },
      });
  
      if (response.status === 200) {
        setTrips(response.data)
        console.log("This is the response:", response.data);
      } else {
        console.log("Could not fetch the data.");
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await LocalClient.get("getVendors");
      setVendors(response.data); // Store the response in state
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

 
    
  useEffect(() => {
    fetchVendors()
  
  }, []);

 
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold">Trip Management Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-30 w-64 h-[calc(100vh-64px)] bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('trips')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                activeTab === 'trips' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <Truck size={20} />
              Trip Sheets
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                activeTab === 'drivers' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              Drivers
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                activeTab === 'vendors' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <Building size={20} />
              Vendors
            </button>
            <button
              onClick={() => setActiveTab('category')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                activeTab === 'category' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <Boxes size={20} />
            Category
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                activeTab === 'company' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <Building size={20} />
              Company
            </button>
            <button
              onClick={logout}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                activeTab === 'logout' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <LogOut size={20} />
             Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}    
        <main className="flex-1 p-4 lg:p-6">
        {activeTab === 'trips' && (
       !createtrip ? (
    <div className="">
      {/* Trip List or Trip Details */}
      
        {selectedTrip ? (
          // Show TripDetails when a trip is selected
          <TripDetails selectedTrip={selectedTrip} goBack={() => setSelectedTrip(null)} />
        ) : (
          // Show TripList when no trip is selected
          <>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold">Trip Sheets</h2>
              
              <div>
                <button onClick={()=>handleDownloadExcel(trips)}>
                <FileSpreadsheet size={20} color="green" />  
                </button>
              
              </div>
              <button 
                className="flex items-center gap-2 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700" 
                onClick={handleNewClick}
              >
                <Plus size={18} />
                New Trip
              </button>
            </div>


            <div className="p-4 bg-white shadow-lg rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        {/* Vendor Selection */}
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Vendor
      </label>
      <select
        value={selectedVendor}
        onChange={(e) => setSelectedVendor(e.target.value)}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">Select Vendors</option>
        {vendors.map((vendor, index) => (
          <option key={index} value={vendor.vendorName}>
            {vendor.vendorName}
          </option>
        ))}
      </select>
        </div>

        {/* From Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* To Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate} // Ensures "To Date" is always after "From Date"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Go Button */}
        <div>
          <button
            onClick={getTripList}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Go
          </button>
        </div>
      </div>
    </div>

            {/* Trip List */}
            <TripList 
              trips={trips} 
              selectedTrip={selectedTrip} 
              setSelectedTrip={setSelectedTrip} 
              handleNewClick={handleNewClick} 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
              totalPages={totalPages} 
            />
          </>
        )}
      
    </div>
  ) : (
    // Show TripSheetForm when createtrip is true
    <TripSheetForm method={handleNewClick} />
  )
)}

          {activeTab === 'drivers' && (
             <ManageDrivers />
          )}

      {activeTab === 'vendors' && (
             <ManageVendor />
          )}
           {activeTab === 'company' && (
             <ManageCompany />
          )}
           {activeTab === 'category' && (
             <ManageCategory />
          )}
         
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard