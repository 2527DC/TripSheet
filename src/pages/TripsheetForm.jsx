import { useEffect, useState } from "react";
import { LocalClient } from "../Api/API_Client";
import { Companys } from "../Api/Endpoints";
import { X, Search, Truck, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const TripSheetForm = () => {
  // ... [Keep all the existing state and useEffect hooks as is]

  const navigate =useNavigate()
  const [generatedLink, setGeneratedLink] = useState("");
    const [options, setOptions] = useState([{ value: "", label: "Select a Vendor" }]);
    const [customerOption,setCustomerOption]=useState([{ value: "", label: "Select a Customer" }])
    const [customer,setCustomer]=useState([{ value: "", label: "Select a Customer" }])
    const[searchCompany,setSearchCompany]=useState("")
    const[companys, setCompanies]=useState([])
  
    const [categoryOptions, setCategoryOptions] = useState([ ]);

    
    const vehicleDetailsInput = [
      { id: "vehicleType", label: "Vehicle Type", type: "text", required: true, name: "vehicleType" ,},
      { id: "driver", label: "Driver Name", type: "select", required: true, name: "driver", options: options, },
      { id: "driver_ph", label: "Driver Ph", type: "tel", required: true, name: "driverPh" },
      {id: "vendor", label: "Vendor",type: "text",required: true,name: "vendorName",},
      { id: "reportingTime", label: "Reporting Time", type: "time", required: true, name: "reportingTime" },
      { id: "category", label: "Category", type: "select", required: true, name: "category", options: categoryOptions },
    ];
    const passengerInput = [
      { id: "passengerName", label: "Customer Name", placeholder: "Enter passenger name", type: "select", required: true, name: "customer" ,options: customerOption},
      { id: "customerPh", label: "Phone Number", placeholder: "Phone Number", type: "tel", required: true, name: "customerPh" },
      { id: "reportingAddress", label: "Reporting Address", placeholder: "Reporting Address", type: "text", required: true, name: "reportingAddress" },
      { id: "dropAddress", label: "Drop Address", placeholder: "Drop Address", type: "text", required: true, name: "dropAddress" },
    ];
  
    const [data, setFormData] = useState({
      driver: "",
      driverPh: "",
      vendorName: "",
      vehicle: "",
      vehicleType: "",
      company:"",
      customer:"",
      customerPh: "",
      reportingAddress: "",
      dropAddress: "",
      acType: "",
      reportingTime: "",
      category :""
      // "createdAt": "2025-02-18T04:13:56.554Z"
     
    });
  
    const [search, setSearch] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [driverName,setDriverName]=useState();

//  fetching the Vehicles by vehicle no 
    useEffect(() => {
      if (search.length < 2 || data.vehicle === search) {
        return;
      }
  
      const fetchVehicles = async () => {
        setLoading(true);
        try {
          const result = await LocalClient.get(`vehicle-list?search=${search}`);
          console.log("🚀 API Response:", result);
          console.log("✅ Response Data:", result.data);
  
          if (result.status === 200) {
            console.log("🎯 Status OK, Data:", result.data);
          }
  
          setVehicles(result.data);
        } catch (error) {
          console.error("❌ Error fetching vehicles:", error);
        }
        setLoading(false);
      };
  
      const delayDebounce = setTimeout(fetchVehicles, 300);
  
      return () => clearTimeout(delayDebounce);
    }, [search]);
  
  
  


const fetchCategory = async () => {
  try {
    const response = await LocalClient.get("fetchCategory");
    if (response.status === 200) {
      const formattedCategories = response.data.map((category) => ({
        value: category.name, // Use id for value
        label: category.name, // Use name for label
      }));
      setCategoryOptions([{ value: "", label: "Select a Category" }, ...formattedCategories]);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

useEffect(() => {
  fetchCategory();
}, []);

    //  driver dropdown logic 
    useEffect(() => {
      const driverOptions = drivers.map((driver) => ({
        value: driver.name,
        label: driver.name
  
      }));
      setOptions([{ value: "", label: "Select a driver" }, ...driverOptions]);
    }, [drivers]);
  
  
    
    useEffect(() => {
      const  customerOptions = customer.map((customer) => ({
        value: customer.name,
        label: customer.name,
  
      }));
     setCustomerOption([{ value: "", label: "Select a customer" }, ...customerOptions]);
     console.log(" this is the array of customers",customerOptions);
     
    }, [customer]); 
  
  // This Useeffect is used to get the comapay list and its customers 
  
  useEffect(()=>{
    if (searchCompany.length < 2 || data.company === searchCompany) {
      return;
    }
  const fetchCompanyList= async()=>{
    
       const  companys= await LocalClient.get(Companys)
  
       if (companys.status===200) {
         setCompanies(companys.data)
       console.log(" this is the responce data of the  companyDetails", companys);
       
       }}
    const delayDebounce = setTimeout(fetchCompanyList, 300);
    return () => clearTimeout(delayDebounce);
  
  },[searchCompany]) 
  
  
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name=="driver") {
        console.log("this is the driver" ,value);
        setDriverName(value)
      }    
      if (name=="category") {
        console.log("this is the category" ,name ,value);
      }    
      
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
  
    };
  
  
    /* this is the  method  to 
    get the driver phoen and vendor related to the driver */
    useEffect(()=>{
  
   const driver = drivers.find((d) => d.name === driverName);
  
   console.log(" this is the  method inside the useeffect to get the driver phoen and vendor related to the driver ");
     
      let driverPh = driver && driver.phoneNo? driver.phoneNo : "phone notfound";
      setFormData((prev) => ({
        ...prev,
        driverPh:driverPh
   
      })); 
    },[driverName])
  
      /* this is the  method  to get the customer Ph */
    useEffect(()=>{
  
      const  found= customer.find((d)=> d.name === data.customer)

         let customerPh = found && found.phoneNo? found.phoneNo : "";
         setFormData((prev) => ({
           ...prev,
           customerPh:customerPh || ""
      
         })); 
  
      console.log(" this is the  method inside the useeffect to get customer phone nubmber ",customerPh);
  
       },[data.customer])
     
  
    //  Handles the autocomplete of vehicle details 
    const handleDataAuto = (vehicle) => {
      const { vehicleNo, vehicleType, vendor, drivers } = vehicle;
      
      const vendorName = vendor?.name || ""; // Handle cases where vendor might be null
    
      setSearch(vehicleNo);
      setVehicles([]);
      setDrivers(drivers);
    
      setFormData((prev) => ({
        ...prev,
        vehicleType: vehicleType || "",
        vehicle: vehicleNo || "",
        vendorName: vendorName, // ✅ Cleaner vendorName assignment
      }));
    };
    
  
     const  handleCompanyAutoFill=(company)=>{    
      setSearchCompany(company.name);
  
      console.log(" this is the comapany customers " ,company.customers);
      
      setCustomer(company.customers)
      setCompanies([])
     
      console.log(" this is the selected company" ,company);
      
      setFormData((prev)=>({
        ...prev,
        company:company.name || ""
      }))
     }

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
  
  const generateLink = async () => {
    console.log("This is the request data", data);
  
    // Validation
    const requiredFields = [
      { key: "driver", label: "Driver Name" },
      { key: "driverPh", label: "Driver Phone" },
      { key: "vendorName", label: "Vendor Name" },
      { key: "vehicle", label: "Vehicle" },
      { key: "vehicleType", label: "Vehicle Type" },
      { key: "company", label: "Company" },
      { key: "customer", label: "Customer Name" },
      { key: "customerPh", label: "Customer Phone" },
      { key: "reportingAddress", label: "Reporting Address" },
      { key: "dropAddress", label: "Drop Address" },
      { key: "acType", label: "AC Type" },
      { key: "reportingTime", label: "Reporting Time" }
    ];
  
    const missingFields = requiredFields.filter(field => !data[field.key]);
  
    if (missingFields.length > 0) {
      missingFields.forEach(field => toast.error(`${field.label} is required`));
      return;
    }

    console.log(" the request data ",data);
    
  
    try {
      const res = await LocalClient.post("/generate-link", data);
      const link = `${window.location.origin}/driver-form?formId=${res.data.data.formId}`;
      console.log("This is the response", res);
  
      setGeneratedLink(link);
  
      if (res.status === 201) {
        toast.success("Trip Sheet Created");
        setSearch("");
        setSearchCompany("");
        setFormData({
          driver: "",
          driverPh: "",
          vendorName: "",
          vehicle: "",
          vehicleType: "",
          company: "",
          customer: "",
          customerPh: "",
          reportingAddress: "",
          dropAddress: "",
          acType: "",
          reportingTime: "",
        });
      }
    } catch (error) {
      console.log("An error occurred", error);
      toast.error("Failed to generate trip sheet");
    }
  };
  

   const handleNavigarion=()=>{
    navigate("/tripsheet-list")
  }
  return (
<>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Truck className="text-white" size={24} />
          <h2 className="text-2xl text-white font-bold">Create Trip Sheet</h2>
        </div>
        <button 
          onClick={handleNavigarion}
          className="p-2 hover:bg-blue-600 rounded-full transition-colors"
        >
          <X className="text-white" size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Vehicle Search Section */}
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Vehicle Number..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {loading && (
            <div className="absolute z-20 inset-0 bg-white/80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {vehicles.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-lg w-full mt-1 max-h-60 overflow-y-auto">
              {vehicles.map((vehicle) => (
                <li
                  key={vehicle.id}
                  onClick={() => handleDataAuto(vehicle)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                >
                  <Truck size={16} className="text-gray-500" />
                  <span>{vehicle.vehicleNo}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Vehicle Details Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">Vehicle Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4">
            {vehicleDetailsInput.map((input, index) =>
              input.type !== "select" ? (
                <div key={index} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{input.label}</label>
                  <input
                    name={input.name}
                    type={input.type}
                    placeholder={input.label}
                    value={data[input.name] || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <div key={index} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{input.label}</label>
                  <select
                    name={input.name}
                    value={data[input.name] || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {input.options.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
             {/* AC / Non-AC Selection */}
      <div className="mt-5">
        <div className="flex gap-5">
          <label className="flex items-center">
              <input
                type="radio"
                name="acType"
                value="AC"
                checked={data.acType === "AC"}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="mr-2"
              />
              Non-AC
            </label>
        </div>
      </div>
          </div>
        </div>

        {/* Company Search Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">Company Details</h3>
          </div>
          <div className="relative">
            <input
              name="company"
              type="text"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              placeholder="Search Company..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

            {companys.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-lg w-full mt-1 max-h-60 overflow-y-auto">
                {companys.map((company) => (
                  <li
                    key={company.id}
                    onClick={() => handleCompanyAutoFill(company)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                  >
                    <Building2 size={16} className="text-gray-500" />
                    <span>{company.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Passenger Details Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">Passenger Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {passengerInput.map((input, index) =>
              input.type !== "select" ? (
                <div key={index} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{input.label}</label>
                  <input
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                    value={data[input.name] || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <div key={index} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{input.label}</label>
                  <select
                    name={input.name}
                    value={data[input.name] || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {input.options.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
          </div>
        </div>

        {/* Submit Button */}
  {/* Submit Button Section - Modified */}
<div className="flex justify-end pt-4">
  {!generatedLink ? (
    <div className="mt-5">
      <button 
        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
        onClick={generateLink}
      >
        Generate Trip Link
      </button>
    </div>
  ) : (
    <div className="space-y-3 w-full max-w-2xl text-right">
      <p className="text-sm text-gray-600">
        Share this link with the driver:{" "}
        <a 
          href={generatedLink} 
          className="text-blue-600 underline break-all"
          target="_blank" 
          rel="noopener noreferrer"
        >
          {generatedLink}
        </a>
      </p>
      <div className="flex gap-3 justify-end">
        <button
          className="rounded-lg bg-gray-600 text-white px-4 py-2 hover:bg-gray-700 transition-colors"
          onClick={copyToClipboard}
        >
          Copy Link
        </button>
        <button
          className="rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors"
          onClick={shareOnWhatsApp}
        >
          Share on WhatsApp
        </button>
        <button
          className="rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors"
          onClick={() => setGeneratedLink('')}
        >
          Clear
        </button>
      </div>
    </div>
  )}
</div>
      </div>
  </>
  );
};

export default TripSheetForm;

