
import React, { useEffect, useState } from 'react';
import { Menu, X, Plus, Search, Truck, Users, Building, LogOut } from 'lucide-react';

import TripSheetForm from './TripsheetForm';
import ManageDrivers from './ManageDrivers';
import { useAuth } from '../store/ AuthProvider';
import ManageVendor from './ManageVendor';
import { TripList } from './Trips';
import axios from 'axios';
import { LocalClient } from '../Api/API_Client';
import TripDetails from './TripDetails';


const initialTrips = [
  { id: 1, date: '2024-03-15', driver: 'John Doe', vendor: 'Express Logistics', destination: 'New York', status: 'In Progress' },
  { id: 2, date: '2024-03-14', driver: 'Jane Smith', vendor: 'Fast Transit', destination: 'Chicago', status: 'Completed' },

];


function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('trips'); // trips, drivers, vendors
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [createtrip,setCreateTrip] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const tripsPerPage = 5;

  const filteredTrips = selectedVendor === 'all' 
    ? trips 
    : trips.filter(trip => trip.vendor === selectedVendor);

  const vendors = [...new Set(trips.map(trip => trip.vendor))];

 const {logout}=useAuth()

  const handleNewClick = () => {
    console.log("The new trip sheet has been clicked");
    setCreateTrip((prev) => !prev); // Toggle the state
    console.log(" this the value of it ",createtrip);
    
  };



  const fetchTrips =async (page = 1) => {
    try { 
      const response = await LocalClient.get(`gettrips?page=${page}&limit=${tripsPerPage}`);
      if (response.data.success) {
        setTrips(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };
  
  useEffect(() => {
    fetchTrips(currentPage);
  }, [currentPage]);

  
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
            !createtrip?(  <div className="grid lg:grid-cols-2 gap-6">
              {/* Trip List */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Trip Sheets</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleNewClick}>
                    <Plus size={18} />
                    New Trip
                  </button>
                </div>

                {/* Filter */}
                <div className="mb-4">
                                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">All Vendors</option>
                  {vendors.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                  ))}
                </select>

                </div>
                {/* Trip List */}
                <TripList trips={filteredTrips} selectedTrip={selectedTrip} setSelectedTrip={setSelectedTrip} 
                handleNewClick={handleNewClick}   currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}/>
              
              </div>

              {/* Trip Details */}
             
               {/* <TripDetails selectedTrip={selectedTrip}/> */}

               {selectedTrip && activeTab === 'trips' && (
            <TripDetails selectedTrip={selectedTrip} />
          )}

             
            </div>):(<TripSheetForm method={handleNewClick}/>)
          )}

          {activeTab === 'drivers' && (
             <ManageDrivers />
          )}

      {activeTab === 'vendors' && (
             <ManageVendor />
          )}
         
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard