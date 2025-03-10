import { useState } from "react";
import { TripList } from "./Trips";
import { FileSpreadsheet, Plus } from "lucide-react"; // ✅ Import missing icons
import { useNavigate } from "react-router-dom";

function TripForm() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [createtrip, setCreateTrip] = useState(false); // ✅ Fixed missing state
  const [trips, setTrips] = useState([]); // ✅ Store trip data

  // Fetch trip list based on selected filters
  const getTripList = async () => {
    console.log("Fetching trip list for:", { selectedVendor, fromDate, toDate });
    // TODO: Fetch trip list from API and update `trips`
  };

   const navigate =useNavigate()
  // Handle creating a new trip
  const handleNewClick = () => {
    console.log("The new trip sheet has been clicked");
    setCreateTrip((prev) => !prev); // ✅ Toggle create trip state
    console.log("This is the value of createtrip:", createtrip);
    navigate("/tripsheets");

  };

  // Handle downloading trip data as Excel
  const handleDownloadExcel = (trips) => {
    console.log("Downloading Excel for trips:", trips);
    // TODO: Implement Excel download logic
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold">Trip Sheets</h2>

        <div>
          <button onClick={() => handleDownloadExcel(trips)}>
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

      {/* Filters & Search */}
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
              min={fromDate} // ✅ Ensures "To Date" is always after "From Date"
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
    </>
  );
}

export default TripForm;
