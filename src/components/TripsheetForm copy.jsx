import { useEffect, useState } from 'react';
import { InputFields } from '../SmallComponents';
import { LocalClient } from '../Api/API_Client';
import axios from 'axios';

const TripSheetForm = ({method}) => {
  

  const [generatedLink, setGeneratedLink] = useState("");
 const [options,setOptions]=useState([{ value: "", label: "Select a Vendor" }])
 const [CompanyOptions,setCompanyOptions]=useState([{ value: "", label: "Select a Company" }])
 const [cateogryOptions,setcateogryOptions]=useState([{ value: "", label: "Select a Category" }])
  const [data, setFormData] = useState({
    driver: "",
    vehicle: "",
    passengerName: "",
    passengerPhoneNumber: "",
    reportingAddress: "",
    dropAddress: "",
    acType:"",
    reportingTime:"",
    vehicleType:"",
   
  });
  
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    if (search.length < 2) {
      setVehicles([]);
      return;
    }
  
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`http://0.0.0.0:3000/api/vehicles?search=${search}`);
        
        console.log("🚀 API Response:", result); // Logs full response
        console.log("✅ Response Data:", result.data); // Logs just the data
  
        if (result.status === 200) {
          console.log("🎯 Status OK, Data:", result.data);
        }
        
        setVehicles(result.data); // Store the fetched vehicles
      } catch (error) {
        console.error("❌ Error fetching vehicles:", error);
      }
      setLoading(false);
    };
  
    const delayDebounce = setTimeout(fetchVehicles, 300); // 🔥 Debounce API calls
  
    return () => clearTimeout(delayDebounce);
  }, [search]);
  
  
  // Fetch Vendors
  const fetchVendors = async () => {
    try {
      const response = await LocalClient.get("getVendors");
      if (response.status === 200) {
        const vendorsName = response.data.map((vendor) => ({
          value: vendor.vendorName,
          label: vendor.vendorName,
        }));
        setOptions([{ value: "", label: "Select a Vendor" }, ...vendorsName]);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  // Fetch Companies
  const fetchCompanies = async () => {
    try {
      const response = await LocalClient.get("getCompany");
      if (response.status === 200) {
        console.log(" this is data ",response.data)
        const companies = response.data.map((company) => ({
          
          
          value: company.companyName,
          label: company.companyName,
        }));

        console.log(" this is category ",companies)
        setCompanyOptions([{ value: "", label: "Select a Company" }, ...companies]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await LocalClient.get("getCategory");
      if (response.status === 200) {

        console.log(" this is the responce " ,response.data.categoryList);
        
        const category = response.data.categoryList.map((category) => ({
          value: category.category,
          label: category.category,
        }));
        console.log(" this is category ",category)
        setcateogryOptions([{ value: "", label: "Select a Category" }, ...category]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Fetch Both Vendors and Companies
  const getVendorsAndCompanies = async () => {
    await Promise.all([fetchVendors(), fetchCompanies(),fetchCategory()]);
  };

  useEffect(() => {
    getVendorsAndCompanies();
  }, []);

  const generateLink = async () => {
    console.log(" this is the  request data ",data);
    try {
      const res = await LocalClient.post("/generate-link", data);
      const link = `${window.location.origin}/driver-form?formId=${res.data.data.formId}`;
      console.log(" this is the responce ",res);
     
      setGeneratedLink(link);


      if (res.status===201) {
       alert(" TripSheet Created ")
        
       setFormData({
        driver: "",
        vehicle: "",
        vendorName: "", 
        passengerName: "",
        passengerPhoneNumber: "",
        reportingAddress: "",
        dropAddress: "",
        acType:"",
        reportingTime:"",
        company:"",
        bookedBy:"",
        category:""
      })
      }
    } catch (error) {

      console.log(" An error occured ",error);
      
      
    }

   
  
  };
  const bookingdetailsInput = [
    { id: "driver", label: "Driver Name", placeholder: "Driver Name", type: "text", required: true, name: "driver" },
    { id: "vehicle", label: "Vehicle No", placeholder: "Vehicle No", type: "text", required: true, name: "vehicle" },
    { id: "vehicleType", label: "Vehicle Type", placeholder: "vehicleType", type: "text", required: true, name: "vehicleType" },

    {
      id: "vendor",
      label: "Vendor",
      type: "select",
      required: true,
      name: "vendorName",
      options: options, // Use the dynamically updated options
    },
    { id: "reportingTime", label: "Reporting Time", placeholder: "Reporting Time", type: "time", required: true, name: "reportingTime" },
    { id: "company", label: "Company", placeholder: "Company", type: "select", required: true, name: "company",options: CompanyOptions, },
    { id: "category", label: "Category", placeholder: "Category", type: "select", required: true, name: "category",options: cateogryOptions, },
    { id: "bookedBy", label: "Booked By", placeholder: "Booked By", type: "text", required: true, name: "bookedBy"  },


  ];

  const passengerInput = [
    { id: "passengerName", label: "Passenger Name", placeholder: "Enter passenger name", type: "text", required: true, name: "passengerName" },
    { id: "passengerPhoneNumber", label: "Phone Number", placeholder: "Phone Number", type: "number", required: true, name: "passengerPhoneNumber" },
  ];

  const reportingInput = [
    { id: "reportingAddress", label: "Reporting Address", placeholder: "Reporting Address", type: "text", required: true, name: "reportingAddress" },
    { id: "dropAddress", label: "Drop Address", placeholder: "Drop Address", type: "text", required: true, name: "dropAddress" },
  ];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "vehicle") {
      setSearch(value); // Update search query for vehicle auto-suggestions
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "passengerPhoneNumber") {
      // Only allow digits and limit to 10
      const formattedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

   // Function to copy the generated link to clipboard
   const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        alert("Failed to copy link: " + err);
      });
  };
  // https://web.whatsapp.com/
  const shareOnWhatsApp = () => {
    const generatedLink = 'Your message or link here'; // Example: 'Check out this amazing link!'
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(generatedLink)}`;
    
    // Check if the user is on mobile or desktop
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // If mobile, open the WhatsApp app with the message
      window.open(whatsappUrl, '_blank');
    } else {
      // If desktop, open WhatsApp Web with the message
      window.open(whatsappUrl, '_blank');
    }
  };
  
  
  // Handle AC/Non-AC selection
  const handleAcTypeChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      acType: e.target.value,
    }));
  };

  return (
    <div>
      <div className='flex justify-between p-2 '> 
      <h2 className="text-2xl text-blue-800 font-bold mb-5">Create Trip Sheet</h2>
      <button className="rounded-lg bg-red-600 px-4  text-white"  onClick={method}>
          Close
        </button>
      </div>
     

      <div className="grid grid-cols-4   gap-5">
      <div className="relative w-full">
      {/* Search Input Field */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Vehicle No..."
        className="border p-2 w-full rounded"
      />

      {/* Show Loading Indicator */}
      {loading && <p className="text-gray-500 mt-1">Loading...</p>}

      {/* Suggestions Dropdown */}
      {vehicles.length > 0 && (
        <ul className="absolute z-10 bg-white border shadow-md w-full mt-1 max-h-60 overflow-y-auto rounded">
          {vehicles.map((vehicle) => (
            <li
              key={vehicle.id}
              onClick={() => {
                setSelectedVehicle(vehicle)
                setSearch(vehicle.vehicleNo); // Auto-fill input
                // setVehicles([]); // Hide dropdown
              }}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {vehicle.vehicleNo}
            </li>
          ))}
        </ul>
      )}
    </div>

    {bookingdetailsInput.map((input, index) => {
  return (
    <input
    key={index}
    type={input.type}
    value={""}
    onChange={handleInputChange}
    placeholder={input.placeholder}
    className="border p-2 w-full rounded"
  />
    
  );
})}

      </div>









      {/* AC / Non-AC Selection */}
      <div className="mt-5">
        <label className="block text-gray-700 font-bold mb-2">Select AC Type:</label>
        <div className="flex gap-5">
          <label className="flex items-center">
              <input
                type="radio"
                name="acType"
                value="AC"
                checked={data.acType === "AC"}
                onChange={handleAcTypeChange}
                className="mr-2"
              />
              AC
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="acType"
                value="NonAC"
                checked={data.acType === "NonAC"}
                onChange={handleAcTypeChange}
                className="mr-2"
              />
              Non-AC
            </label>
        </div>
      </div>

      {/* Button at the Bottom */}
      <div className="mt-5">
        <button className="rounded-lg bg-green-600 px-4 py-2 text-white" onClick={generateLink}>
          Generate Trip Link
        </button>
      </div>

      {generatedLink && (
        <div className="mt-3">
          <p>
            Share this link with the driver:
            <a href={generatedLink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              {generatedLink}
            </a>
          </p>
          <div className="flex gap-5 mt-3">
            {/* Copy Button */}
            <button
              className="rounded-lg bg-gray-600 text-white px-4 py-2"
              onClick={copyToClipboard}
            >
              Copy Link
            </button>

            {/* Share on WhatsApp Button */}
            <button
              className="rounded-lg bg-green-600 text-white px-4 py-2"
              onClick={shareOnWhatsApp}
            >
              Share on WhatsApp
            </button>
            <button
        className="rounded-lg bg-red-600 text-white px-4 py-2"
        onClick={() => setGeneratedLink('')}
      >
        Clear URL
      </button>
      
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSheetForm;

