import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LocalClient } from '../Api/API_Client';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';

const DriverView = () => { 
    const [tripDetails, setTripDetails] = useState(null);
    const location = useLocation();
    const [visible,setvisible]=useState(false)


    // Extract the tripId from the URL
    const queryParams = new URLSearchParams(location.search);
    const tripId = queryParams.get('formId');
 
     // Signature states and refs
    const [showGuestModal, setShowGuestModal] = useState(false);

    const guestSignatureRef = useRef(null);
     


    // Signature handling functions
    const handleSaveGuestSignature = async (e) => {
      e.preventDefault(); // Add this line
      if (guestSignatureRef.current.isEmpty()) {
        toast.warning("Please provide a signature before saving.");
        return false;
      }
    
      const signatureDataURL = guestSignatureRef.current.toDataURL();
      setGuestSignature(signatureDataURL); // async — doesn't update immediately
    
      try {
        const response = await LocalClient.patch("/updateGuestSignature", {
          tripId,
          Guestsignature: signatureDataURL,
        });
    
        if (response.data.success) {
          toast.success("Guest signature saved successfully.");
          return signatureDataURL;
        } else {
          toast.error(response.data.message || "Failed to save guest signature.");
          return false;
        }
      } catch (error) {
        console.error("Error while saving guest signature:", error);
        toast.error("An error occurred while saving the signature.");
        return false;
      } finally {
        setShowGuestModal(false);
      }
    };
    

    useEffect(() => {
      const fetchTripDetails = async () => {
        if (tripId) {
          try {
            const response = await LocalClient.get(`/form/${tripId}`);
          
            if (response.status===200) {
                setvisible(true)
              setTripDetails(response.data.data)
              console.log(" this is the Driver View data " ,response.data.data); 
              console.log(" this is the data ", tripDetails);
              if (response.data.data.openKm != null) {
               setView(true)
              }
              if (response.data.data.guest_url!=null) {
                setGuestSignature(response.data.data.guest_url);
              }
            }
            setTripDetails(response.data.data);
          } catch (error) {
            console.error('Error fetching trip details:', error);
          }
        }
      };
  
      fetchTripDetails();
    }, [tripId]);

    const today = new Date().toISOString().split("T")[0]; 

    const [data, setFormData] = useState({
     
        closeKm: "",
        closeHr: "",
        formId:tripId,
        totalHr:"",
        toolCharges:null,
       parkingCharges:null
    });


    const [guestSignature, setGuestSignature] = useState(null);

   


const handleInputChange = (e) => {
  const { name, type, value, files } = e.target;

  let newValue = value;

  if (["openKm", "closeKm", "toolCharges", "parkingCharges"].includes(name)) {
      newValue = Number(value);
      if (newValue < 0 || isNaN(newValue)) newValue = 0; // Prevent negative values
  }

  setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? (files && files[0]) : newValue,
  }));
};

    function calculateTripMetrics() {

      // Create Date objects
      const openDateTime = new Date(`${tripDetails?.reportingDate}T${tripDetails?.reportingTime}:00`);
      const closeDateTime = new Date(`${data.closeDate}T${data.closeHr}:00`);
  console.log(" this is the");
  
      // Calculate total KM
      const totalKm = data.closeKm - tripDetails?.openKm;
  
      // Calculate total hours (difference in milliseconds converted to hours)
     // Convert to hours and minutes
     const diffMs = closeDateTime - openDateTime;
    const totalHr = Math.floor(diffMs / (1000 * 60 * 60)); // Get full hours
    const totalMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Get remaining minutes

  
      return { totalKm, totalHr,totalMin };
  }





    
  const validateForm = () => {

    console.log(" making the validation ");
    
    const requiredFields = [ "closeKm", "closeHr"];
    const missingFields = requiredFields.filter((field) => !data[field]);

  
    if (missingFields.length > 0) {
      toast.warning("Please fill all required fields");

      return false;
    }

    if (!guestSignature) {
      toast.warning("Guest signature is required");
      return false;
    }
    if(data.closeKm<tripDetails?.openKm){
      toast.warning("Closing Km Must be greater than Opening Km");
      return false;
    }
  

    const result = calculateTripMetrics();

    console.log(`Total KM: ${result.totalKm}`);
    console.log(`Total HR: ${result.totalHr}:${result.totalMin} hours`);

    if (!result) {
      toast.warning("Closing time must be later than opening time");
      return false;
    }

    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm())return

    console.log(" the fiunal submit method is getting invoked ");
    
   const {categoryRel} =tripDetails
   console.log(" this is the category to calculate the ectar hr and  " ,categoryRel.KM ,categoryRel.hours);

    const formData = {
        ...data,
        categoryHr:categoryRel.hours,
        categoryKm:categoryRel.KM
        
    };

    
    console.log("Data being sent:", formData);

    try {
        const response = await LocalClient.patch("addtripsheet", formData);
        console.log("Server response:", response.data);

        if (response.status===200) {
           toast.success("Submitted successfully!");
            setFormData({  closeKm: "", closeHr: "" , toolCharges:"",closeDate:"",
              parkingCharges:""});
            setGuestSignature(null);
            setRating(0)
        }
    } catch (error) {

      if(error.status===400){
        toast.error(" Form has been submitted already")
      }else{
        toast.error("Submission failed!");
      }
    
    }
    
};

// Add this to your existing state declarations at the top
const [rating, setRating] = useState(0);

// Add this function to handle rating changes
const handleRatingChange = (newRating) => {
    setRating(newRating);
    setFormData((prevData) => ({
        ...prevData,
        rating: newRating // Add rating to form data
    }));
};

// Update totalHr whenever openHr or closeHr changes
useEffect(() => {
  const result = calculateTripMetrics();
  
  setFormData((prevData) => ({
    ...prevData,
    totalHr: `${result.totalHr}:${result.totalMin}`, // Keep totalHr as a string
    totalKm: parseFloat(result.totalKm) || 0, // Ensure totalKm is a float
  }));
}, [data.closeHr,data.closeDate]);


const openKmRef = useRef(null);


const handleStartDuty = async () => {
  try {
    const kmRaw = openKmRef.current?.value;
    const kmValue = parseInt(kmRaw, 10);

    if (isNaN(kmValue)) {
      toast.error("Please enter a valid KM value.");
      return;
    }

    const response = await LocalClient.patch("/updateOpenKm", {
      tripId,
      kmValue
    });

    const { success, message, data } = response.data;

    if (success) {
      toast.success("Duty started successfully.");
      setView(true);
      console.log("Updated data:", data);
    } else {
      toast.warning(message || "Something went wrong.");
    }

  } catch (error) {
    console.error("Error while starting duty:", error);

    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Server error. Please try again later.");
    }
  }
};



const [view,setView]=useState(false)
    return<>

    {visible?( <>
    {
      view?<div>
        <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
        <header className="flex flex-col md:flex-row items-center p-6 border-b border-gray-200">
          <img src="/MLt.jpeg" alt="MLT Logo" className="w-44 h-24 mb-4 md:mb-0 md:mr-6" />
          
          <div className="text-center md:text-left flex-grow">
      <h1 className="text-2xl font-bold text-gray-800">
        MLT Corporate Solutions Private Limited
      </h1>
      <p className="text-gray-600 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gray-700" />
        #766, Ground floor, 1st main road, Girinagar 2nd phase, 6th block, BSK 3rd stage,
      </p>
      <p className="text-gray-600">Bengaluru - 560085</p>
      <p className="text-gray-600 flex items-center gap-2">
        <Phone className="w-5 h-5 text-gray-700" />
        9035354198 / 99 (24/7), 9980357272, 9686375747
      </p>
      <p className="text-gray-600 flex items-center gap-2">
        <Mail className="w-5 h-5 text-gray-700" />
        reservation@mitcorporate.com / info@mitcorporate.com
      </p>
      <p className="text-gray-600 flex items-center gap-2">
        <Globe className="w-5 h-5 text-gray-700" />
        <a
          href="https://www.mltcorporatesolutions.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          www.mltcorporatesolutions.com
        </a>
      </p>
    </div>
        </header>
      </div>

      <div>
      <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
       <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Booking Details</h2>
           <div className="space-y-4">
              <strong>{"MLT Corporate Solutions Private Limited"}</strong> <br />
              <strong>Reporting:{tripDetails.reportingTime}</strong><br />
              <strong>BookedBy: {tripDetails.customer}</strong><br />

              <strong>Driver Name : {tripDetails.driverName}</strong><br />
              <strong>vehicleType: {tripDetails.vehicleType}</strong><br />
              <strong>vehicleNo:{tripDetails.vehicleNo}</strong>   <br />
             </div>
            </div>
        </div>
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Passanger Details</h2>
              <div className="space-y-4">
             <strong>Passenger Name: {tripDetails.customer}</strong>    <br />
              <strong>Passenger PhNo: {tripDetails.customerPh}</strong>         <br />
              <strong>Reporting Address :{tripDetails.reportingAddress}</strong>   <br />
              <strong>Droping Address :{tripDetails.dropAddress}</strong>   <br />
             </div>
               </div>
         

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            
            {/* Timing Details Section */}
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Timing Details</h2>
              <div className="space-y-6">
            

              <div className="p-4 space-y-6">
      

      {/* Closing Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Closing</h3>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="w-32 font-medium text-gray-700">KM:</label>
            <input
              name="closeKm"
              type="number"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.closeKm}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="w-32 font-medium text-gray-700">Date:</label>
            <input
              name="closeDate"
              type="date"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.closeDate}
              onChange={handleInputChange}
              min={today} // Prevents selecting past dates
                />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="w-32 font-medium text-gray-700">Hours:</label>
            <input
              name="closeHr"
              type="time"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.closeHr}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
    </div>

              <div className='bg-gray-50 rounded-lg p-4'>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <label className="w-32 font-medium text-gray-700">Toll Charges:</label>
                      <input
                        name="toolCharges"
                        type="number"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={data.toolCharges|| ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                    <label className="w-32 font-medium text-gray-700">Parking Charges:</label>
                    <input
                      name="parkingCharges"
                      type="number"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={data.parkingCharges || ""}
                      onChange={handleInputChange}
                    />
                  </div>
              </div>

            
            </div>

      
             {/* Signature Sections */}
             <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Signatures</h2>

                        <div className="space-y-4">
                            <div className="border p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Guest Signature</h3>
                                {guestSignature ? (
                                    <div className="mb-2">
                                        <img src={tripDetails.guest_url!=null?`http://localhost:3000/api/get-signature/${guestSignature}`:guestSignature} alt="Guest Signature" className="h-20 border" />
                                       
                                    </div>  
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowGuestModal(true)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Add Guest Signature
                                    </button>
                                )}
                            </div>

                           
                        </div>
                    </div>

                    {/* Signature Modals */}
                    {showGuestModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
                                <h2 className="text-xl font-semibold mb-4">Guest Signature</h2>
                                <div className="border border-gray-300 rounded-lg bg-gray-100 mb-4">
                                    <SignaturePad
                                        ref={guestSignatureRef}
                                        canvasProps={{ className: 'w-full', style: { height: '200px' } }}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => guestSignatureRef.current.clear()}
                                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                                    >
                                        Clear
                                    </button>
                                    <button
                                      type="button" // Add this line
                                        onClick={handleSaveGuestSignature}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Save Signature
                                    </button>
                                    <button
                                        onClick={() => setShowGuestModal(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    >
                                        Back to Form
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
{/* Rating Section */}
<div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Feedback Rating</h2>
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingChange(star)}
                                className={`text-3xl ${
                                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <div className="text-sm text-gray-600">
                        {rating === 1 && "Very Unsatisfied"}
                        {rating === 2 && "Unsatisfied"}
                        {rating === 3 && "Neutral"}
                        {rating === 4 && "Satisfied"}
                        {rating === 5 && "Very Satisfied"}
                        {rating === 0 && "Please select a rating"}
                    </div>
                </div>
            </div>
                  

            {/* Submit Button */}
            <div className="p-2 flex justify-center items-center">
            <button
              type="submit"
              className="text-xl bg-green-600  p-2 rounded items-center"
            >
              Submit
            </button>
          </div>

          </div>
        </form>
      </div>
    </div>
      </div>:
      
      <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Opening Details </h3>

    <div className="space-y-4">

          {/* Date */}
          <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-1">Date:</label>
        <input
          type="date"
          className="rounded-md border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-600"
          value={tripDetails?.reportingDate || ""}
          readOnly
        />
      </div>


      {/* Hours */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-1">Hours:</label>
        <input
          name="openHr"
          type="time"
         className="rounded-md border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-600"
          value={tripDetails?.reportingTime}
          
          readOnly
        />
      </div>
      
      {/* KM Input */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-1">KM:</label>
        <input
        name="openKm"
        type="number"
        ref={openKmRef}
        className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter KM"
      />
      </div>

  

    </div>

    {/* Start Duty Button */}
    <button
      onClick={handleStartDuty}
      className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
    >
      Start Duty
    </button>
  </div>
</div>
      </div>
    }
   
   </> ):( <>
    <div className="flex justify-center items-center h-screen">
  <h1 className="text-xl font-semibold text-gray-700">Loading .....</h1>
</div>

   

      </>)}
    </>
}


export default DriverView