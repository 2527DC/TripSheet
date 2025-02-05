import { useState } from 'react';
import { InputFields } from '../SmallComponents';
import axios from 'axios';
import { axiosClient } from '../Api/API_Client';

const TripSheetForm = ({method}) => {
  

  const [generatedLink, setGeneratedLink] = useState("");
 
  const [data, setFormData] = useState({
    driver: "",
    vehicle: "",
    serviceType: "", // Vendor selection
    passengerName: "",
    passengerPhoneNumber: "",
    reportingAddress: "",
    dropAddress: "",
    acType:"",
    reportingTime:""
  });
  


  const generateLink = async () => {
    console.log(" this is the  request data ",data);
    try {
      const res = await axiosClient.post("/generate-link", data);
      const link = `${window.location.origin}/driver-form?formId=${res.data.data.formId}`;
      console.log(" this is the responce ",res);
     
      setGeneratedLink(link);


      if (res.status===201) {
       alert(" TripSheet Created ")
        
       setFormData({
        driver: "",
        vehicle: "",
        serviceType: "", // Vendor selection
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
    { id: "vehicle", label: "Vehicle", placeholder: "Vehicle", type: "text", required: true, name: "vehicle" },
    {
      id: "serviceType",
      label: "Vendor",
      type: "select",
      required: true,
      name: "serviceType",
      options: [
        { value: "", label: "Select a service" },
        { value: "hotel", label: "Hotel Booking" },
        { value: "flight", label: "Flight Booking" },
        { value: "car", label: "Car Rental" },
      ],
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
    
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? (files && files[0]) :
        ["openKm", "closeKm"].includes(name) ?
          Number(value) || 0 : value,
    }));
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
