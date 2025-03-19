import { useEffect, useState } from "react";
import { TripList } from "./Trips";
import { CheckCircle, Clock, FileSpreadsheet, History, Plus, Search, Truck, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LocalClient } from "../Api/API_Client";
import TripDetails from "./TripDetails";
import handleDownloadExcel from "./DownloadExcel";
import { useAuth } from "../context/AuthContext";
import { Modal } from "./SmallComponents";
import { toast } from "react-toastify";
import { API } from "../Api/Endpoints";

function TripForm() {
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const[selectedTrip,setSelectedTrip]=useState()
  const navigate = useNavigate();
 const [auditLogs,setAuditLogs]=useState([])
 const [isOpen, setIsOpen] = useState(false);
 const typeOptions = ["Driver", "Customer", "Company", "Vendor"];
 const statusOptions = ["All", "Approved", "Pending", "Rejected"];
 const [selectedType, setSelectedType] = useState("");
 const [selectedStatus, setSelectedStatus] = useState("");
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedSearch, setSelectedSearch] = useState("");
 const [suggestions, setSuggestions] = useState([]);
 const [showSuggestions, setShowSuggestions] = useState(false);

  const { user } = useAuth()

  console.log(" this is the user " ,user);
  
  console.log(" this is the selected type" ,selectedType);
  
  

  const updateTrip = (updatedTrip) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === updatedTrip.id ? updatedTrip : trip
      )
    );
  };
// Separate validation function with advanced syntax
const validateTripInputs = ({ searchQuery, fromDate, toDate, selectedType }) => {
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
};

// Optimized getTripList function
const getTripList = async () => {
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
};

  const handleNewClick = () => {
    navigate("/tripsheets");
  };


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
  

 const handleSelectSuggestion = (name) => {
  console.log(" this is ythe selcted search " ,name);
   setSearchQuery(name)
setSelectedSearch(name)
setSuggestions([])
 };




  // handleDownloadExcel(selectedTrip)

    const handleDownload=async()=>{

        handleDownloadExcel(trips)

    }
  
 const handleHistory=async()=>{

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
     
    
   }
  
 
    const fetchedApprovedTrips= async ()=>{
 
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
    }


    const  fetchedPendingTrip=  async()=>{
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
   
    }


    const  fetchedRejectedTrip=async  ()=>{
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
    }

 ;

    
  return (<>
    {!selectedTrip?(
      <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Truck className="text-blue-600" />
          Trip Sheets
        </h2>
        <div className="flex items-center gap-3">

        <button
        onClick={fetchedPendingTrip}
        className="flex items-center gap-2 px-4 py-2 text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
      >
        <Clock size={20} />
        Pending
      </button>

         <button
        onClick={fetchedApprovedTrips}
        className="flex items-center gap-2 px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
      >
        <CheckCircle size={20} />
        Approved
      </button>

    
      <button
        onClick={fetchedRejectedTrip}
        className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
      >
        <XCircle size={20} />
        Rejected
      </button>

         {
          user.role==="SUPER_ADMIN"?
          <button
            onClick={handleHistory}
            className="flex items-center gap-2 px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <History size={20} />
            History
          </button>:null
         } 

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FileSpreadsheet size={20} />
            Export
          </button>
          <button
            onClick={handleNewClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Trip
          </button>
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
      {true?(<div>
  
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={"EDIT History"}>
      {/* ✅ Make the history scrollable */}
      <div className="max-h-[400px] overflow-y-auto p-4">
        {auditLogs.map((log) => (
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
              ))}
            </div>
          </Modal>

 

</div>):null}

      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TripList trips={trips} setSelectedTrip={setSelectedTrip}/>
        )}  
      </div>
    </div>
    ):(<TripDetails   selectedTrip={ selectedTrip} goBack={()=>setSelectedTrip(false)} updateTrip={updateTrip} />)

    }
    </>
  );
}

export default TripForm;