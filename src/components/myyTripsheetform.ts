// import { useEffect, useState } from "react";
// import { LocalClient } from "../Api/API_Client";
// import axios from "axios";
// import { Companys } from "../Api/Endpoints";

// const TripSheetForm = ({ method }) => {
//   const [generatedLink, setGeneratedLink] = useState("");
//   const [options, setOptions] = useState([{ value: "", label: "Select a Vendor" }]);
//   const [customerOption,setCustomerOption]=useState([{ value: "", label: "Select a Customer" }])
//   const [customer,setCustomer]=useState([{ value: "", label: "Select a Customer" }])
//   const[searchCompany,setSearchCompany]=useState("")
//   const[companys, setCompanies]=useState([])

//   const [categoryOptions, setCategoryOptions] = useState([
//     { value: "", label: "Select a Category" },
//     { value: "Corporate", label: "Corporate" },

//   ]);
  
//   const vehicleDetailsInput = [
//     { id: "vehicleType", label: "Vehicle Type", type: "text", required: true, name: "vehicleType" ,},
//     { id: "driver", label: "Driver Name", type: "select", required: true, name: "driver", options: options, },
//     { id: "driver_ph", label: "Driver Ph", type: "tel", required: true, name: "driverPh" },
//     {id: "vendor", label: "Vendor",type: "text",required: true,name: "vendorName",},
//     { id: "reportingTime", label: "Reporting Time", type: "time", required: true, name: "reportingTime" },
//     { id: "category", label: "Category", type: "select", required: true, name: "category", options: categoryOptions },
//   ];
//   const passengerInput = [
//     { id: "passengerName", label: "Customer Name", placeholder: "Enter passenger name", type: "select", required: true, name: "customer" ,options: customerOption},
//     { id: "customerPh", label: "Phone Number", placeholder: "Phone Number", type: "tel", required: true, name: "customerPh" },
//     { id: "reportingAddress", label: "Reporting Address", placeholder: "Reporting Address", type: "text", required: true, name: "reportingAddress" },
//     { id: "dropAddress", label: "Drop Address", placeholder: "Drop Address", type: "text", required: true, name: "dropAddress" },
//   ];

//   const [data, setFormData] = useState({
//     driver: "",
//     driverPh: "",
//     vendorName: "",
//     vehicle: "",
//     vehicleType: "",
//     company:"",
//     customer:"",
//     customerPh: "",
//     reportingAddress: "",
//     dropAddress: "",
//     acType: "",
//     reportingTime: "",
   
//   });

//   const [search, setSearch] = useState("");
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [drivers, setDrivers] = useState([]);
//   const [driverName,setDriverName]=useState();
//   const [selectedData,setSelectedData]=useState()
//   const [customerName,setCustomerName]=useState();
//   // let driverName="";
//   useEffect(() => {
//     if (search.length < 2 || data.vehicle === search) {
//       return;
//     }

//     const fetchVehicles = async () => {
//       setLoading(true);
//       try {
//         const result = await axios.get(`http://0.0.0.0:3000/api/vehicles?search=${search}`);
//         console.log("🚀 API Response:", result);
//         console.log("✅ Response Data:", result.data);

//         if (result.status === 200) {
//           console.log("🎯 Status OK, Data:", result.data);
//         }

//         setVehicles(result.data);
//       } catch (error) {
//         console.error("❌ Error fetching vehicles:", error);
//       }
//       setLoading(false);
//     };

//     const delayDebounce = setTimeout(fetchVehicles, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [search]);



//   //  driver dropdown logic 
//   useEffect(() => {
//     const driverOptions = drivers.map((driver) => ({
//       value: driver.driverName,
//       label: driver.driverName,

//     }));
//     setOptions([{ value: "", label: "Select a driver" }, ...driverOptions]);
//   }, [drivers]);


  
//   useEffect(() => {
//     const  customerOptions = customer.map((customer) => ({
//       value: customer.customerName,
//       label: customer.customerName,

//     }));
//    setCustomerOption([{ value: "", label: "Select a customer" }, ...customerOptions]);
//    console.log(" this is the array of customers",customerOptions);
   
//   }, [customer]); 

// // This Useeffect is used to get the comapay list and its customers 

// useEffect(()=>{
//   if (searchCompany.length < 2 || data.company === searchCompany) {
//     return;
//   }
// const fetchCompanyList= async()=>{
  
//      const  companys= await LocalClient.get(Companys)

//      if (companys.status===200) {
//        setCompanies(companys.data)
//      console.log(" this is the responce data of the  companyDetails", companys);
     
//      }}
//   const delayDebounce = setTimeout(fetchCompanyList, 300);
//   return () => clearTimeout(delayDebounce);

// },[searchCompany]) 



//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name=="driver") {
//       console.log("this is the driver" ,value);
//       setDriverName(value)
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//   };


//   /* this is the  method  to 
//   get the driver phoen and vendor related to the driver */
//   useEffect(()=>{

//  const driver = drivers.find((d) => d.driverName === driverName);

//  console.log(" this is the  method inside the useeffect to get the driver phoen and vendor related to the driver ");
//     let vendorName= driver && driver.vendor ? driver.vendor.vendorName : "No Vendor Found";
//     let driverPh = driver && driver.phoneNo? driver.phoneNo : "phone notfound";
//     setFormData((prev) => ({
//       ...prev,
//       vendorName:vendorName ||"",
//       driverPh:driverPh
 
//     })); 
//   },[driverName])

//     /* this is the  method  to get the customer Ph */
//   useEffect(()=>{

//     const  found= customer.find((d)=> d.customerName === data.customer)

//     console.log(" this is the filterd customer" ,customerName);
    
   
    
    
//        let customerPh = found && found.phoneNo? found.phoneNo : "phone notfound";
//        setFormData((prev) => ({
//          ...prev,
//          customerPh:customerPh || ""
    
//        })); 

//     console.log(" this is the  method inside the useeffect to get customer phone nubmber ",customerPh);

//      },[data.customer])
   

//   //  Handles the autocomplete of vehicle details 
//   const handleDataAuto = (vehicle) => {
//     setSearch(vehicle.vehicleNo);
//     setVehicles([]);
//     setDrivers(vehicle.drivers);
//     setSelectedData(vehicle)
//     console.log(" this isselected data  ", vehicle);
//     // console.log(" this is vehicle type ", selectedVehicle.vehicleType);
    
   
//     setFormData((prev) => ({
//       ...prev,
//       vehicleType: vehicle.vehicleType || "", // ✅ Store vendorName from selected vehicle
//       vehicle:vehicle.vehicleNo || "",
//     }));
//   };

//         const handlesubbmit=()=>{
//       console.log(" this is the subbmited data ",data);
//         }


//    const  handleCompanyAutoFill=(company)=>{    
//     setSearchCompany(company.companyName);

//     console.log(" this is the comapany customers " ,company.customers);
    
//     setCustomer(company.customers)
//     setCompanies([])
   
//     console.log(" this is the selected company" ,company);
    
//     setFormData((prev)=>({
//       ...prev,
//       company:company.companyName || ""
//     }))
//    }

//   return (
//     <div>
//       <h2 className="text-2xl text-blue-800 font-bold mb-5">Create Trip Sheet</h2>
//       <button className="rounded-lg bg-red-600 px-4 text-white" onClick={method}>
//         Close
//       </button>

//       <input
//         type="text"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search Vehicle No..."
//         className="border p-2 w-full rounded"
//       />

//       {loading && <p className="text-gray-500 mt-1">Loading...</p>}

//       {vehicles.length > 0 && (
//         <ul className="absolute z-10 bg-white border shadow-md w-full mt-1 max-h-60 overflow-y-auto rounded">
//           {vehicles.map((vehicle) => (
//             <li
//               key={vehicle.id}
//               onClick={() => handleDataAuto(vehicle)}
//               className="cursor-pointer p-2 hover:bg-gray-200"
//             >
//               {vehicle.vehicleNo}
//             </li>
//           ))}
//         </ul>
//       )}

// {vehicleDetailsInput.map((input, index) =>
//   input.type !== "select" ? (
//     <input
//       key={index}
//       name={input.name}
//       type={input.type}
//       placeholder={input.label}
//       value={data[input.name] || ""}  // ✅ Bind to state dynamically
//       onChange={handleInputChange}  // ✅ Update state on user input
//       className="border p-2 rounded"
//     />
//   ) : (
//     <select
//       key={index}
//       name={input.name}
//       value={data[input.name] || ""}
//       onChange={handleInputChange}  // ✅ Update state on selection
//       className="border p-2 rounded"
//     >
//       {input.options.map((option, idx) => (
//         <option key={idx} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   )
// )}

// <div className="">
  
// <input  name="company"
//         type="text"
//         value={searchCompany}
//         onChange={(e) => setSearchCompany(e.target.value)}
//         placeholder="Search Company ..."
//         className="border p-2 w-full rounded"
//       />
// {/* 
//       {loading && <p className="text-gray-500 mt-1">Loading...</p>} */}

//       {companys.length > 0 && (
//         <ul className="absolute z-10 bg-white border shadow-md  mt-1 max-h-60 overflow-y-auto rounded">
//           {companys.map((company) => (
//             <li
//               key={company.id}
//               onClick={() => handleCompanyAutoFill(company)}
//               className="cursor-pointer p-2 hover:bg-gray-200"
//             >
//               {company.companyName}
//             </li>
//           ))}
//         </ul>
//       )}

// {passengerInput.map((input, index) =>
//   input.type !== "select" ? (
//     <input
//       key={index}
//       name={input.name}
//       type={input.type}
//       placeholder={input.label}
//       value={data[input.name] || ""}  // ✅ Bind to state dynamically
//       onChange={handleInputChange}  // ✅ Update state on user input
//       className="border p-2 rounded"
//     />
//   ) : (
//     <select
//       key={index}
//       name={input.name}
//       value={data[input.name] || ""}
//       onChange={handleInputChange}  // ✅ Update state on selection
//       className="border p-2 rounded"
//     >
//       {input.options.map((option, idx) => (
//         <option key={idx} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   )
// )}
      
// </div>



// <div><button onClick={handlesubbmit}> subbmit</button></div>

//     </div>
//   );
// };

// export default TripSheetForm;