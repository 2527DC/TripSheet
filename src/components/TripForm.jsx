import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { TripList } from "./Trips";
import { CheckCircle, Clock, Clock10, FileSpreadsheet, History, Plus, Search, Truck, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LocalClient } from "../Api/API_Client";
import TripDetails from "./TripDetails";
import handleDownloadExcel from "./DownloadExcel";
import { useAuth } from "../context/AuthContext";
import { Modal } from "./SmallComponents";
import { toast } from "react-toastify";
import { API } from "../Api/Endpoints";

// Memoized button components
const StatusButton = memo(({ Icon, text, colorClass, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 ${colorClass} rounded-lg hover:bg-opacity-75 transition-colors`}
  >
    <Icon size={20} />
    {text}
  </button>
));

// Memoized suggestion item
const SuggestionItem = memo(({ name, onClick }) => (
  <li
    onClick={() => onClick(name)}
    className="p-2 hover:bg-gray-100 cursor-pointer"
  >
    {name}
  </li>
));

function TripForm() {
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState();
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearch, setSelectedSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useAuth();
  const typeOptions = ["Driver", "Customer", "Company", "Vendor"];
  const [loading, setLoading] = useState(false);
 const statusOptions = ["All", "Approved", "Pending", "Rejected"];


  // Memoized update function
  const updateTrip = useCallback((updatedTrip) => {
    setTrips(prev => prev.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
  }, []);

// Separate validation function with advanced syntax
const validateTripInputs = useCallback(({ searchQuery, fromDate, toDate, selectedType })  => {
  const errors = [];

  // Check required fields with short-circuit evaluation
  !searchQuery?.trim() && errors.push('Search Query is required');
  !fromDate && errors.push('From Date is required');
  !toDate && errors.push('To Date is required');
  !selectedType?.trim() && errors.push('Type is required');

  // Early return if required fields are missing
  if (errors.length) {
    console.error('Missing required parameters:', errors);
    toast.error(errors.join(', '));
    return false;
  }

  // Date validation with modern Date API
  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);
  const today = new Date().setHours(23, 59, 59, 999);

  // Use object literal for validation checks
  const dateChecks = {
    'Invalid From Date': isNaN(fromDateObj.getTime()),
    'Invalid To Date': isNaN(toDateObj.getTime()),
    'From Date after To Date': fromDateObj > toDateObj,
    'To Date in future': toDateObj > today,
  };

  // Filter failed checks and map to error messages
  const dateErrors = Object.entries(dateChecks)
    .filter(([, isInvalid]) => isInvalid)
    .map(([message]) => message);

  if (dateErrors.length) {
    console.error('Date validation failed:', dateErrors);
    dateErrors.forEach((error) => toast.error(`${error}. Please check your dates (e.g., YYYY-MM-DD)`));
    return false;
  }

  return true;
}, []);


// Optimized getTripList function
const getTripList = useCallback(async () => {
  const inputs = { searchQuery, fromDate, toDate, selectedType };

  // Validate inputs and exit if invalid
  if (!validateTripInputs(inputs)) {
    console.log('Validation failed, skipping API request');
    return;
  }

  try {
    // Log structured data with template literals
    console.log(`Fetching trip sheets: ${JSON.stringify({ ...inputs, selectedStatus })}`);

    // Build query parameters with object destructuring and nullish coalescing
    const params = new URLSearchParams({
      searchQuery: searchQuery.trim(),
      fromDate,
      toDate,
      selectedStatus: selectedStatus ?? 'All',
      selectedType: selectedType.trim(),
    });

    // Make API request
    const { data: { message, data } } = await LocalClient.get('trips', { params });

    // Update state and show success toast
    setTrips(data);
    toast.success(`Fetched ${data.length} Trips`);
    console.log(`API Response: ${message}`, { total: data.length });
  } catch (error) {
    // Optimized error handling with nullish coalescing
    const errorMessage = error.response?.data?.message ?? error.message ?? 'Failed to fetch trip sheets';
    console.error(`Error fetching trip sheets: ${errorMessage}`, error);
    !toast.isActive('error') && toast.error(errorMessage === 'Failed to fetch trip sheets' ? 'Error Fetching Details' : errorMessage);
  }
}, [searchQuery, fromDate, toDate, selectedType, selectedStatus]);


const handleNewClick = useCallback(() => navigate("/tripsheets"), [navigate]);
  const handleDownload = useCallback(() => handleDownloadExcel(trips), [trips]);

  useEffect(() => {

    if (searchQuery.length < 2 || selectedSearch === searchQuery) {
      setSuggestions([]);
      return;
    }
    // Define the async search function
    const handleSearch = async () => {
     
      try {
        const response = await LocalClient.get(`search?type=${selectedType}&query=${searchQuery}`);
        console.log("This is the response:", response.data);
        setSuggestions(response.data); // Uncommented to update suggestions
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]); // Clear suggestions on error
        setShowSuggestions(false);
      }
    };
  
    // Debounce the search
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300);
  
    // Cleanup: clear the timeout when searchQuery changes or component unmounts
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedType, selectedSearch]); // Added all dependencies

  
 const handleHistory = useCallback(async () => {

      try {
        const response= await LocalClient.get("getLogs")
      
        if (response.status===200) {
          setIsOpen(true)
          console.log(" this is the Log responce " ,response.data);
          
         setAuditLogs(response.data) 
        toast.success("Logs Fetched")
        }
       
      } catch (error) {
        toast.error("Failed To Fetch the Logs")
      }
    }, []);
  
 
    const fetchedApprovedTrips = useCallback(async () => {
 
      try {

        const  response=await LocalClient.get(API.approvedTrips)

        if (response.status===200) {
          toast.success(`Approved Trips Fetched ${response.data.approvedTrips.length}`)
          setTrips(response.data.approvedTrips)
        }
        
      } catch (error) {
        console.log("ERROR ",error);
        toast.error("SERVER IS BUSY")
      }
    }, []);



    const fetchedPendingTrip = useCallback(async () => {
      try {
        const  response=await LocalClient.get(API.pendingTrips)
        if (response.status===200) {
          toast.success(`Pending Trips Fetched ${response.data.pendingTrips.length}`)
          setTrips(response.data.pendingTrips)
        }
      } catch (error) {
        console.log("ERROR ",error);
        toast.error("SERVER IS BUSY")
      }
   
    }, []);

    const [assignedModal, setAssignedModal] = useState(false); // controls modal visibility
    const [assignedTrips, setAssignedTrip] = useState(null);   // stores the trip data
    
    const fetchedAssignedTrip = useCallback(async () => {
      try {
        const response = await LocalClient.get("/getAssigned");
    
        // Set trip data
        setAssignedTrip(response.data.data);
    
        console.log("Assigned trips fetched and modal opened");
      } catch (error) {
        console.error("Error fetching assigned trips:", error);
      }
    }, []);
    
    useEffect(() => {
      if (assignedModal) {
        fetchedAssignedTrip();
      }
    }, [assignedModal, fetchedAssignedTrip]);
    
    const fetchedRejectedTrip = useCallback(async () => {
      try {
           const  response=await LocalClient.get(API.rejectedTrips)
        if (response.status===200) {
          toast.success(`Rejected Trips Fetched ${response.data.rejectedTrips.length}`)
          setTrips(response.data.rejectedTrips)
        }
      } catch (error) {
        console.log("ERROR ",error);
        toast.error("SERVER IS BUSY")
      }
    }, []);

   // Optimized suggestion handler
   const handleSelectSuggestion = useCallback((name) => {
    setSearchQuery(name);
    setSelectedSearch(name);
    setSuggestions([]);
  }, []);
  // Memoized suggestions
  const memoizedSuggestions = useMemo(() => 
    suggestions.map((item, index) => (
      <SuggestionItem
        key={index}
        name={item.name}
        onClick={handleSelectSuggestion}
      />
    )),
  [suggestions, handleSelectSuggestion]);

  // Optimized useEffect for suggestions
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2 || selectedSearch === searchQuery) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await LocalClient.get(`search?type=${selectedType}&query=${searchQuery}`, {
          signal: controller.signal
        });
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => {
      controller.abort();
      clearTimeout(debounceTimer);
    };
  }, [searchQuery, selectedType, selectedSearch]);
    
  const handleAssignedTrips = () => {
    setAssignedModal(pre=>!pre); // just open modal
  };
  
    // Memoized status buttons
    const statusButtons = useMemo(() => [
      {
        onClick: handleAssignedTrips,
        Icon: Clock,
        text: "Assigned",
        colorClass: "text-blue-600 bg-blue-100"
      },
      {
        onClick: fetchedPendingTrip,
        Icon: Clock,
        text: "Pending",
        colorClass: "text-yellow-600 bg-yellow-50"
      },
      {
        onClick: fetchedApprovedTrips,
        Icon: CheckCircle,
        text: "Approved",
        colorClass: "text-green-600 bg-green-50"
      },
      {
        onClick: fetchedRejectedTrip,
        Icon: XCircle,
        text: "Rejected",
        colorClass: "text-red-600 bg-red-50"
      }
    ], [fetchedPendingTrip, fetchedAssignedTrip,fetchedApprovedTrips, fetchedRejectedTrip]);

  return (<>
    {!selectedTrip?(
      <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Truck className="text-blue-600" />
          Trip Sheets
        </h2>
     <div className="flex items-center gap-3">
               {statusButtons.map((props, idx) => (
                <StatusButton key={idx} {...props} />
              ))}
              {user.role === "SUPER_ADMIN" && (
                <StatusButton
                  onClick={handleHistory}
                  Icon={History}
                  text="History"
                  colorClass="text-green-600 bg-green-50"
                />
              )}
              <StatusButton
                onClick={handleDownload}
                Icon={FileSpreadsheet}
                text="Export"
                colorClass="text-green-600 bg-green-50"
              />
              <StatusButton
                onClick={handleNewClick}
                Icon={Plus}
                text="New Trip"
                colorClass="bg-blue-600 text-white hover:bg-blue-700"
              />
            </div>
      </div>

{/*  this is the ui for the Filter SEARCH  */}
      <div className="max-w-full mx-auto mb-3">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
              {/* Type Dropdown */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) =>setSelectedType(e.target.value) }
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="">All Types</option>
                  {typeOptions.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div className="lg:col-span-3 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="selectedsearch"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${selectedType || "..."}`}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Dropdown Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {suggestions.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(item.name)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                   {item.name}
                   
                    </li>
                  ))}
                </ul>
              )}
            </div>


              {/* Status Dropdown */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate}
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Search Button */}
              <div className="lg:col-span-1 flex items-end">
                <button
                  onClick={getTripList}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                > <Search size={18} />
                </button>
              </div>
            </div>
        
        </div>
      </div>
 
  
  

          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={"EDIT History"}>
            <div className="max-h-[400px] overflow-y-auto p-4">
             {auditLogs.map((log) => (
                <LogEntry key={log.id} log={log} />
              ))}
            </div>
          </Modal>


          <div className="bg-white rounded-xl shadow-sm p-6">
             {loading ? (
              <LoadingSpinner />
            ) : (<>
             {  assignedModal?<AssignedTripList trips={assignedTrips} />:<MemoizedTripList trips={trips} setSelectedTrip={setSelectedTrip} />}  
            </>
          
            )}  
          </div>
        </div>
      ) : (
        <MemoizedTripDetails
          selectedTrip={selectedTrip}
          goBack={() => setSelectedTrip(false)}
          updateTrip={updateTrip}
        />
      )}
    </>
  );
}
// Dummy data: all trips are "Not Started"
const dummyTrips = [
  { date: '2025-04-05T08:00:00Z', passengerName: 'Alice Johnson', vehicleNo: 'MH12AB1001', openKm: null },
  { date: '2025-04-05T08:30:00Z', passengerName: 'Bob Smith', vehicleNo: 'MH12AB1002', openKm: 210 },
  { date: '2025-04-05T09:00:00Z', passengerName: 'Carol White', vehicleNo: 'MH12AB1003', openKm: null },
  { date: '2025-04-05T09:30:00Z', passengerName: 'David Lee', vehicleNo: 'MH12AB1004', openKm: 180 },
  { date: '2025-04-05T10:00:00Z', passengerName: 'Ella Brown', vehicleNo: 'MH12AB1005', openKm: null },
  { date: '2025-04-05T10:30:00Z', passengerName: 'Frank Martin', vehicleNo: 'MH12AB1006', openKm: 230 },
  { date: '2025-04-05T11:00:00Z', passengerName: 'Grace Thomas', vehicleNo: 'MH12AB1007', openKm: null },
  { date: '2025-04-05T11:30:00Z', passengerName: 'Henry Young', vehicleNo: 'MH12AB1008', openKm: 240 },
  { date: '2025-04-05T12:00:00Z', passengerName: 'Ivy Wilson', vehicleNo: 'MH12AB1009', openKm: null },
  { date: '2025-04-05T12:30:00Z', passengerName: 'Jack Davis', vehicleNo: 'MH12AB1010', openKm: 200 },
];

// AssignedTripList component wrapped in React.memo for performance
const AssignedTripList = React.memo(({ trips = dummyTrips }) => {
  // Memoized list (already all are "Not Started")
  const renderedTrips = useMemo(() => {
    return trips?.map((trip, index) => (
      <tr key={index} className=" hover:bg-gray-50">
        <td className="px-4 py-2">{new Date(trip.date).toLocaleDateString()}</td>
        <td className="px-4 py-2">{trip.customer}</td>
        <td className="px-4 py-2">{trip.driverName}</td>
        <td className="px-4 py-2">{trip.vehicleNo}</td>
        <td className="px-4 py-2">
        <span
  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs 
    ${
      trip.openKm
        ? 'bg-green-200 text-green-800'
        : 'bg-red-200 text-red-800'
    }`}
>
  {trip.openKm ? (
    <Clock10 size={14} className="text-green-600" />
  ) : (
    <Clock10 size={14} className="text-red-600" />
  )}
  {trip.openKm ? 'Duty Started' : 'Not Started'}
</span>

        </td>
      </tr>
    ));
  }, [trips]);

  return (
    <div className=" rounded-lg shadow bg-white max-h-[400px] overflow-y-auto border">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Passenger Name</th>
            <th className="px-4 py-2">Driver Name</th>
            <th className="px-4 py-2">Vehicle No</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>{renderedTrips}</tbody>
      </table>
    </div>
  );
});


// Memoized child components
const MemoizedTripList = memo(({ trips, setSelectedTrip }) => (
  <TripList trips={trips} setSelectedTrip={setSelectedTrip} />
));

const MemoizedTripDetails = memo(({ selectedTrip, goBack, updateTrip }) => (
  <TripDetails
    selectedTrip={selectedTrip}
    goBack={goBack}
    updateTrip={updateTrip}
  />
));

const LogEntry = memo(({ log }) => (
  <div key={log.id} className="mb-2">
  <p className="text-sm text-gray-700"> 
  For <span className="font-semibold m-1"> TripSheetId  </span>  
 <span className="font-semibold text-red-500 m-1">"{log.tripSheetId}"</span> 
<span className="font-semibold">{log.editedBy}</span> changed  
<span className="font-semibold"> {log.fieldName} </span> 
from "<span className="text-red-500">{log.oldValue}</span>" 
to "<span className="text-green-500">{log.newValue}</span>"  
on <span className="text-gray-500">{new Date(log.editedAt).toLocaleString()}</span>
    </p>
  </div>

));

const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
));

export default memo(TripForm);