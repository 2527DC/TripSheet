import { useEffect, useState } from "react";
import { TripList } from "./Trips";
import { FileSpreadsheet, History, Plus, Search, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LocalClient } from "../Api/API_Client";
import TripDetails from "./TripDetails";
import handleDownloadExcel from "./DownloadExcel";
import { useAuth } from "../context/AuthContext";

function TripForm() {
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [vendorLoading, setVendorLoading] = useState(false);
  const[selectedTrip,setSelectedTrip]=useState()
  const navigate = useNavigate();

  const { user } = useAuth()

  console.log(" this is the user " ,user);
  
  
  const getTripList = async () => {
    try {
      setLoading(true);
      const params = {
        vendorName: selectedVendor,
        fromDate: fromDate,
        toDate: toDate
      };

      
      const response = await LocalClient.get("/trips", { params });
      if (response.status === 200) {
        console.log(" this is the responce " ,response.data);
        
        setTrips(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewClick = () => {
    navigate("/tripsheets");
  };

  useEffect(() => {
    console.log(" this is the selected vendor ",selectedVendor);
    
    const fetchVendors = async () => {
      if (search.length < 2 ||selectedVendor===search) {
        setVendors([]);
        return;
      }
      
      try {
        setVendorLoading(true);
        const response = await LocalClient.get(`searchVendor?search=${search}`);
        if (response.status === 200) {
          setVendors(response.data);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setVendors([]);
      } finally {
        setVendorLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchVendors, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor.vendorName);
    setSearch(vendor.vendorName);
    setVendors([]);
  };
    const handleDownload=async()=>{

        handleDownloadExcel(trips)

    }
  // handleDownloadExcel(selectedTrip)
  console.log("Trips being passed to TripList:", trips, "Type:", typeof trips);
    const handleHistory=()=>{
    console.log(" history button clicked ");
   }
  
  return (<>
    {!selectedTrip?(
      <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Truck className="text-blue-600" />
          Trip Sheets
        </h2>
        <div className="flex items-center gap-3">
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

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="relative md:col-span-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendor..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {vendorLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}

            {vendors.length > 0 && (
              <ul className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto border border-gray-100">
                {vendors.map((vendor) => (
                  <li
                    key={vendor.id}
                    onClick={() => handleVendorSelect(vendor)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <Truck size={18} className="text-gray-500" />
                    <span className="text-gray-700">{vendor.vendorName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="md:col-span-3">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="From Date"
            />
          </div>

          <div className="md:col-span-3">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="To Date"
            />
          </div>

          <div className="md:col-span-1">
            <button
              onClick={getTripList}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

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
    ):(<TripDetails   selectedTrip={ selectedTrip} goBack={()=>setSelectedTrip(false)}/>)

    }
    </>
  );
}

export default TripForm;