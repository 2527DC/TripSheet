import { useCallback, useEffect, useMemo, useState } from "react";
import { LocalClient } from "../Api/API_Client";
import { API, Companys, CreateDriver, CreatVehicle } from "../Api/Endpoints";
import { X, Search, Truck, Users, Building2, Plus, PlusCircle, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { InputField, Modal } from "../components/SmallComponents";
import Select from "react-select";


const TripSheetForm = () => {

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
      { id: "reportingDate", label: "Reporting Date", type: "date", required: true, name: "reportingDate" },
      { id: "reportingTime", label: "Reporting Time", type: "time", required: true, name: "reportingTime"},
      { id: "category", label: "Category", type: "select", required: true, name: "category", options: categoryOptions },
      {id: "city", label: "City",type: "text",required: true,name: "city",},
    ];
    const passengerInput = [
      { id: "passengerName", label: "Passenger", placeholder: "Enter passenger name", type: "select", required: true, name: "customer" ,options: customerOption},
      { id: "customerPh", label: "Phone Number", placeholder: "Phone Number", type: "tel", required: true, name: "customerPh" },
      { id: "reportingAddress", label: "Reporting Address", placeholder: "Reporting Address", type: "text", required: true, name: "reportingAddress" },
      { id: "dropAddress", label: "Drop Address", placeholder: "Drop Address", type: "text", required: true, name: "dropAddress" },
    ];
    const [formData, setFormData] = useState({
      driverName: '',
      phoneNo: '',
      vehicleType: '',
      vehicleNo: '',
      vehicleId: ""
    });
  
    const [data, setData] = useState({
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
      city:"",
      companyId:"",
      reportingDate:""
     
      
      // "createdAt": "2025-02-18T04:13:56.554Z"
     
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [driverName,setDriverName]=useState();
    const [modalVehicles, setModalVehicles] = useState([]); // Vehicle list for modal search
    const [loadingModal, setLoadingModal] = useState(false);
    const [searchModalVehicle, setSearchModalVehicle] = useState(""); // Search input for modal
    const [createCustomer, setCreateCustomer] = useState(false);
    const [customerData, setCustomerData] = useState({ customerName: "", phoneNo: "" });

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
  
  
  
    const handleCustomerInputChange = useCallback((e) => {
      const { name, value } = e.target;
      setCustomerData(prev => ({ ...prev, [name]: value }));
    }, []);
  
    // 🔹 Fetch vehicles for modal search
  useEffect(() => {
   
    if (searchModalVehicle.length < 2 || formData.vehicleNo === searchModalVehicle  ) {
      return;
    }
    const fetchModalVehicles = async () => {
      setLoadingModal(true);
      try {
        const result = await LocalClient.get(`vehicle-list?search=${searchModalVehicle}`);
        setModalVehicles(result.data);
        console.log(result.data);
        
      } catch (error) {
        console.error("❌ Error fetching vehicles (Modal):", error);
      }
      setLoadingModal(false);
    };

    const delayDebounce = setTimeout(fetchModalVehicles, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchModalVehicle]);



const fetchCategory = async () => {
  try {
    const response = await LocalClient.get("fetchCategory");
    if (response.status === 200) {
      const formattedCategories = response.data.map((category) => ({
        value: category.name, // Use id for value
        label: category.name, // Use name for label
        id:category.id
      }));
      setCategoryOptions([{ value: "", label: "Select a Category" }, ...formattedCategories]);
      console.log(" this is the category with id ",formattedCategories);
 
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
        label: driver.name,
      
  
      }));
      setOptions([{ value: "", label: "Select a driver" }, ...driverOptions]);
    }, [drivers]);
  
  
    
    useEffect(() => {
      const  customerOptions = customer.map((customer) => ({
        value: customer.name,
        label: customer.name,
         id:customer.id
      }));
     setCustomerOption([{ value: "", label: "Select a Passenger" }, ...customerOptions]);
     console.log(" this is the array of customers",customerOptions);
     
    }, [customer]); 
  
  //  Fetching companies
  
  useEffect(()=>{
    if (searchCompany.length < 2 || data.company === searchCompany) {
      return;
    }
  const fetchCompanyList= async()=>{
    
       const  companys= await LocalClient.get(`${Companys}?search=${searchCompany}`)
  
       if (companys.status===200) {
         setCompanies(companys.data)
       console.log(" this is the responce data of the  companyDetails", companys);
       
       }}
    const delayDebounce = setTimeout(fetchCompanyList, 300);
    return () => clearTimeout(delayDebounce);
  
  },[searchCompany]) 
  
  const handleFormInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'phoneNo') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  
  const handleCustomerSubmit = useCallback(async (e) => {
    e.preventDefault();
   
    if (data.companyId) {

      try {
        const queryParams =`companyId=${ parseInt(data.companyId, 10)}`; // Base 10 conversion
        const response = await LocalClient.post(`${API.createCustomer}?${queryParams}`, customerData);
        if (response.status === 201) {
          toast.success("Customer added successfully");
          const newCustomer = { 
            ...customerData, 
  
            id: response.data.id || Date.now() // Assuming API returns ID
          };
          console.log(" this is the new Customer",newCustomer);
          
        
          setCreateCustomer(false);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        toast.error(error.response?.data?.message || "An error occurred");
      }
      
    }
    
  
   
  }, [customerData]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "driver") {
      console.log("This is the driver:", value);
      setDriverName(value);
    }
  
    if (name === "category") {
      // Find the selected category object
      const selectedCategory = categoryOptions.find((cat) => cat.value === value);
      
      console.log("This is the category:", selectedCategory);
  
      setData((prev) => ({
        ...prev,
        category: selectedCategory?.label || "",  // Store category name
        categoryId: selectedCategory?.id || null // Store category ID
      }));
  
      return; // Exit to prevent unnecessary `setData` call below
    }
  
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  
    const CustomerInput = useMemo(() => [
      {
        id: "customerName",
        label: "Customer Name",
        placeholder: "Enter customer name",
        type: "text",
        name: "customerName",
      },
      {
        id: "phoneNumber",
        label: "Phone Number",
        placeholder: "Enter phone number",
        type: "tel",
        name: "phoneNo",
      },
    ], []);
    
    /* this is the  method  to 
    get the driver phoen and vendor related to the driver */
    useEffect(()=>{
  
   const driver = drivers.find((d) => d.name === driverName);
  
   console.log(" this is the  method inside the useeffect to get the driver phoen and vendor related to the driver ");
     
      let driverPh = driver && driver.phoneNo? driver.phoneNo : "Driver Phone Number";
      setData((prev) => ({
        ...prev,
        driverPh:driverPh,
        driverId:driver?.id
   
      })); 
    },[driverName])
  
      /* this is the  method  to get the customer Ph */
    useEffect(()=>{
  
      const  found= customer.find((d)=> d.name === data.customer)
      const  id= customer.find((d)=> d.name === data.customer)
         let customerPh = found && found.phoneNo? found.phoneNo : "";
         setData((prev) => ({
           ...prev,

           customerPh:customerPh || "",
           customerId:found?.id
      
         })); 
  
      console.log(" this is the  method inside the useeffect to get customer phone nubmber ",customerPh);
  
       },[data.customer])
     
  
    //  Handles the autocomplete of vehicle details 
    const handleDataAuto = (vehicle) => {
      const { vehicleNo, vehicleType, vendor, drivers } = vehicle;
      
      console.log(" this is the selectedd vehicle " ,vehicle);
      
      const vendorName = vendor?.name || ""; // Handle cases where vendor might be null
    
      setSearch(vehicleNo);
      setVehicles([]);
      setDrivers(drivers);
    
      setData((prev) => ({
        ...prev,
        vehicleType: vehicleType || "",
        vehicle: vehicleNo || "",
        vehicleId:vehicle.id
     
      }));
    };
    
  
     const  handleCompanyAutoFill=(company)=>{    
      setSearchCompany(company.name);
  
      console.log(" this is the comapany customers " ,company.customers);
      
      setCustomer(company.customers)
      setCompanies([])
     
      console.log(" this is the selected company" ,company);
      
      setData((prev)=>({
        ...prev,
        company:company.name || "",
        companyId:company.id 
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
      { key: "reportingTime", label: "Reporting Time" },
      { key: "category", label: "Category" },
      { key: "city", label: "City" },

      
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
        setSearchFormVendor("")
        setData({
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
          city:""
         
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
  const readOnlyFields = ["customerPh", "driverPh","vendorName","vehicleType"];

  const [drivermodla,setDriverModal]=useState(false)
  
  const handleAddDriver = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await LocalClient.post(CreateDriver, formData);
      if (response.status === 201) {
        toast.success("Driver Added successfully!");
   
        setDriverModal(false);
        setFormData({ driverName: '', phoneNo: '', vehicleType: '', vehicleNo: '', vehicleId: "" });
        setSearchModalVehicle("");
      }
    } catch (error) {
      toast.error("Failed to add driver");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handleVehicleSelect = (vehicle) => {
    setSearchModalVehicle(vehicle.vehicleNo); // Set input value
    setFormData((prev) => ({
      ...prev,
      vehicleNo: vehicle.vehicleNo,
      vehicleType: vehicle.vehicleType,
      vehicleId: vehicle.id,
    }));
    setModalVehicles([]); // Clear the dropdown
  };
  

    // Memoized vehicles list
    const memoizedModalVehicles = useMemo(
      () =>
        modalVehicles.map((vehicle) => (
          <li
            key={vehicle.id}
            onClick={() => handleVehicleSelect(vehicle)}
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
          >
            <Truck size={16} className="text-gray-500" />
            <span>{vehicle.vehicleNo}</span>
          </li>
        )),
      [modalVehicles]
    );

    const [searchVendor, setSearchVendor] = useState("");

    const [vehicleFormData, setVehicleFormData] = useState({
      vehicleNo: '',
      vehicleType: '',
      vendorId: null,
    });
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vendorLoading, setVendorLoading] = useState(false);

    const handleVehicleInputChange = useCallback((e) => {
      const { name, value } = e.target;
      setVehicleFormData(prev => ({ ...prev, [name]: value }));
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

    const [selectedVendor, setSelectedVendor] = useState("");
      const [vendors, setVendors] = useState([]);

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



  const handleVendorSelect = useCallback((vendor) => {
    setSelectedVendor(vendor.name);
    setSearchVendor(vendor.name);
    setVehicleFormData(prev => ({
      ...prev,
      vendorId: vendor.id,
    }));
    setVendors([]);
   
  }, []);

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
  
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  
    const handleVendorSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await LocalClient.post("createVendor", formData);
        if (response.status === 201) {
          toast.success(response.data.message);
        
          setIsVendorModalOpen(false);
          setFormData({ vendorName: "", vendorPh: "" });
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred.');
        console.error("Error:", error);
      }
    }

  // Memoize input fields to prevent re-creation on each render
  const DriverdetailsInput = useMemo(() => [
    { id: "vendorName", label: "Vendor Name", placeholder: "Vendor Name", type: "text", name: "vendorName" },
    { id: "phoneNo", label: "Phone No", placeholder: "Phone No", type: "tel", name: "vendorPh" },
  ], []);

  // const handleAddVendor = useCallback(() => {
  //   setIsVendorModalOpen(true);
  //   setCreate((prev) => !prev);
  // }, []);

  const handleVendorInputChange = useCallback((e) => {
    const { name, value, type } = e.target;

    let newValue = value;
    if (type === "tel") {
      newValue = newValue.replace(/\D/g, "").slice(0, 10); // Restrict to 10 digits, prevent non-numeric input
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  }, []);

  const [searchFormVendor, setSearchFormVendor] = useState(""); // Input field state
  const [selectedFormVendor, setSelectedFormVendor] = useState(""); // Stores selected vendor
  const [formVendors, setFormVendors] = useState([]); // Stores fetched vendors
  const [formVendorLoading, setFormVendorLoading] = useState(false); // Loading state
// Optimized form-specific vendor search with cleanup
useEffect(() => {
  let isMounted = true;
  const controller = new AbortController();

  const fetchFormVendors = async () => {
    if (searchFormVendor.length < 2 || selectedFormVendor === searchFormVendor) {
      setFormVendors([]);
      return;
    }

    try {
      setFormVendorLoading(true);
      const response = await LocalClient.get(`searchVendor?search=${searchFormVendor}`, {
        signal: controller.signal
      });
      if (isMounted && response.status === 200) {
        setFormVendors(response.data);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching form vendors:", error);
      }
    } finally {
      if (isMounted) setFormVendorLoading(false);
    }
  };

  const debounceTimer = setTimeout(fetchFormVendors, 300);
  return () => {
    isMounted = false;
    controller.abort();
    clearTimeout(debounceTimer);
  };
}, [searchFormVendor, selectedFormVendor]);

// Handle Form Vendor Selection
const handleFormVendorSelect = useCallback((vendor) => {
  setSelectedFormVendor(vendor.name);
  setSearchFormVendor(vendor.name);
setData((prev)=>({
  ...prev,vendorName:vendor.name,
  vendorId:vendor.id
}))
  setFormVendors([]);
}, []);

// Memoized Form Vendors List
const memoizedFormVendors = useMemo(() => (
  formVendors.map(vendor => (
    <li
      key={vendor.id}
      onClick={() => handleFormVendorSelect(vendor)}
      className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 transition"
    >
      <Truck size={18} className="text-gray-500" />
      <span className="text-gray-700">{vendor.name}</span>
    </li>
  ))
), [formVendors, handleFormVendorSelect]);

  
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
  {/* Vehicle and Vendor Search Section */}
  <div className="w-full flex flex-col md:flex-row gap-4">
    
    {/* Vehicle Search Input */}
    <div className="relative flex-1">
      <label className="block mb-1 text-gray-700">Search Vehicle</label>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Vehicle Number..."
          className="w-full pr-10 pl-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {/* Dropdown List for Vehicle */}
      {!drivermodla && vehicles.length > 0 && (
        <ul className="absolute left-0 right-0 z-50 bg-white border border-gray-200 shadow-lg rounded-lg w-full mt-1 max-h-60 overflow-y-auto">
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

    {/* Plus Button for Vehicle */}
    <button
      onClick={() => setIsVehicleModalOpen(true)}
      className="p-2 rounded-full text-blue-500 hover:text-blue-700 self-end"
    >
      <PlusCircle size={24} />
    </button>

   {/* Vendor Search Input */}
<div className="relative flex-1">
  <label className="block mb-1 text-gray-700">Search Vendor</label>
  <div className="relative">
    <input
      type="text"
      value={searchFormVendor}
      onChange={(e) => setSearchFormVendor(e.target.value)}
      placeholder="Search Vendor ....."
      className="w-full pr-10 pl-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    
    {/* Loading Indicator */}
    {formVendorLoading && (
      <div className="absolute right-12 top-1/2 -translate-y-1/2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      </div>
    )}
  </div>

  {/* Dropdown List for Vendor */}
  {formVendors.length > 0 && (
    <ul className="absolute left-0 right-0 z-50 bg-white border border-gray-300 shadow-lg rounded-lg w-full mt-1 max-h-48 overflow-y-auto">
      {memoizedFormVendors}
    </ul>
  )}
</div>

{/* Plus Button for Vendor */}
<button
  onClick={() => setIsVendorModalOpen(true)}
  className="p-2 rounded-full text-blue-500 hover:text-blue-700 self-end"
>
  <PlusCircle size={24} />
</button>

  </div>


    
    
    <Modal isOpen={drivermodla} onClose={() => setDriverModal(false)} title="Add New Driver">
        <form onSubmit={handleAddDriver}>
        <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Driver Name"
              name="driverName"
              value={formData.driverName}
              onChange={handleFormInputChange}
              placeholder="Enter driver name"
              required
            />
            <InputField
              label="Phone Number"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleFormInputChange}
              placeholder="Enter phone number"
              required
            />
          </div>
          {/* 🔹 Vehicle Search in Modal */}
          <div className="relative mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
            <div className="relative flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchModalVehicle}
                  onChange={(e) => setSearchModalVehicle(e.target.value)}
                  placeholder="Search vehicle number..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* 🔹 Vehicle List in Modal */}
            {modalVehicles.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-lg w-full mt-1 max-h-48 overflow-y-auto">
                {memoizedModalVehicles}
              </ul>
            )}
          </div>

          <InputField
            label="Vehicle Type"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleFormInputChange}
            placeholder="Enter vehicle type"
            required
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setDriverModal(false)}
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


      <Modal isOpen={createCustomer} onClose={() => setCreateCustomer(false)} title="Add New Customer">
              <form onSubmit={handleCustomerSubmit} className="space-y-6">
                {CustomerInput.map((input) => (
                  <InputField
                    key={input.id}
                    label={input.label}
                    type={input.type}
                    name={input.name}
                    value={customerData[input.name]}
                    onChange={handleCustomerInputChange}
                    placeholder={input.placeholder}
                    required
                  />
                ))}
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setCreateCustomer(false)} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add Customer
                  </button>
                </div>
              </form>
            </Modal>
  {/* Modal for Adding Vendor */}
  <Modal isOpen={isVendorModalOpen} onClose={() => setIsVendorModalOpen(false)} title="Add Vendor">
        <form onSubmit={handleVendorSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {DriverdetailsInput.map((input) => (
              <InputField
                key={input.id}
                label={input.label}
                type={input.type}
                name={input.name}
                value={formData[input.name]}
                onChange={ handleVendorInputChange}
                placeholder={input.placeholder}
                required
              />
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsVendorModalOpen(false)}
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
      <div className="flex items-center space-x-2">
        <input
          name={input.name}
          type={input.type}
          placeholder={input.label}
          value={data[input.name] || ""}
          onChange={handleInputChange}
          readOnly={readOnlyFields.includes(input.name)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {/* Add button for vendorName */}
        {input.name === "vendorName" && (
          <button 
            onClick={() => setIsVendorModalOpen(true)} 
            className="p-2 rounded-full text-blue-500 hover:text-blue-700">
            <PlusCircle size={20} />
          </button>
        )}
      </div>
    </div>
  ) : (
    <div key={index} className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {input.label}
      </label>
      <div className="flex items-center space-x-2">
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
        {/* Add button for driver selection */}
        {input.name === "driver" && (
          <button 
            onClick={() => setDriverModal(true)} 
            className="p-2 rounded-full text-blue-500 hover:text-blue-700">
            <PlusCircle size={20} />
          </button>
        )}
      </div>
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
        readOnly={readOnlyFields.includes(input.name)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  ) : (
    <div key={index} className="space-y-1 relative flex items-center gap-2">
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700">{input.label}</label>
        {input.name === "customer" ? (
          <Select
            name={input.name}
            value={
              input.options.find(option => option.value === data[input.name]) || null
            }
            onChange={(selectedOption) =>
              handleInputChange({ target: { name: input.name, value: selectedOption?.value } })
            }
            styles={{
              control: (base, state) => ({
                ...base,
                width: '100%',
                padding: '2px',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem', // rounded-lg
                border: `1px solid ${state.isFocused ? '#3b82f6' : '#d1d5db'}`, // blue-500 or gray-300
                boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.4)' : 'none', // ring-blue-500
                '&:hover': {
                  borderColor: '#3b82f6',
                },
              }),
              menu: (base) => ({
                ...base,
                zIndex: 20,
                borderRadius: '0.5rem',
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? '#3b82f6'
                  : state.isFocused
                  ? '#e0f2fe'
                  : '#fff',
                color: state.isSelected ? '#fff' : '#000',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
              }),
              placeholder: (base) => ({
                ...base,
                color: '#9ca3af', // text-gray-400
              }),
              singleValue: (base) => ({
                ...base,
                color: '#111827', // text-gray-900
              }),
            }}
            options={input.options}
            placeholder={input.placeholder}
            isSearchable

          />
        ) : (
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
        )}
      </div>

      {input.name === "customer" && (
        <button
          className="p-2 rounded-full text-blue-500 hover:text-blue-700"
          onClick={() => setCreateCustomer(true)}
        >
          <PlusCircle size={20} />
        </button>
      )}
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

