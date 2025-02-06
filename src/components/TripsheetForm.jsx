import { useEffect, useState } from 'react';
import { InputFields } from '../SmallComponents';
import { LocalClient } from '../Api/API_Client';

const TripSheetForm = ({method}) => {
  

  const [generatedLink, setGeneratedLink] = useState("");
 const [options,setOptions]=useState([{ value: "", label: "Select a Vendor" }])
  const [data, setFormData] = useState({
    driver: "",
    vehicle: "",
    serviceType: "", // Vendor selection
    passengerName: "",
    passengerPhoneNumber: "",
    reportingAddress: "",
    dropAddress: "",
    acType:"",
    reportingTime:"",
    vehicleType:""
  });
  
  const getVendors = async () => {
    try {
      const response = await LocalClient.get("getVendors");

      if (response.status === 200 && response.data) {
        // Transform response data into the correct format
        const vendorOptions = response.data.map((vendor) => ({
          value: vendor.vendorName,
          label: vendor.vendorName,
        }));

        // Add default option at the top
        setOptions([{ value: "", label: "Select a Vendor" }, ...vendorOptions]);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  useEffect(() => {
    getVendors();
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
        vendor: "", 
        passengerName: "",
        passengerPhoneNumber: "",
        reportingAddress: "",
        dropAddress: "",
        acType:"",
        reportingTime:""
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
      name: "vendor",
      options: options, // Use the dynamically updated options
    },
    { id: "reportingTime", label: "Reporting Time", placeholder: "Reporting Time", type: "time", required: true, name: "reportingTime" },
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
    const { name, type, value, files } = e.target;
    
    if (name === 'passengerPhoneNumber') {
      // Only allow digits and limit to 10
      const formattedValue = value.replace(/\D/g, '').slice(0, 10); // Remove non-digits and slice to 10 digits
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
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
          close
        </button>
      </div>
     

      <div className="grid grid-cols-4   gap-5">
        {bookingdetailsInput.map((input, index) => (  
          <InputFields
            key={index}
            {...input}
            value={data[input.name] || ""}
            onChange={handleInputChange}
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-5">
        <div className="grid grid-cols-2 gap-5">
          {passengerInput.map((input, index) => (
            <InputFields
              key={index}
              {...input}
              value={data[input.name] || ""}
              onChange={handleInputChange}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5">
          {reportingInput.map((input, index) => (
            <InputFields
              key={index}
              {...input}
              value={data[input.name] || ""}
              onChange={handleInputChange}
            />
          ))}
        </div>
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
