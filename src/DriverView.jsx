import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import {  LocalClient } from './Api/API_Client'; 
import { useLocation } from 'react-router-dom';

const DriverView = () => { 
    const [tripDetails, setTripDetails] = useState(null);
    const location = useLocation();
    const [visible,setvisible]=useState(false)
    // Extract the tripId from the URL
    const queryParams = new URLSearchParams(location.search);
    const tripId = queryParams.get('formId');
 // Signature states and refs
 const [showGuestModal, setShowGuestModal] = useState(false);
 const [showDriverModal, setShowDriverModal] = useState(false);

 const guestSignatureRef = useRef(null);
 const driverSignatureRef = useRef(null);
    // Signature handling functions
    const handleSaveGuestSignature = () => {
      if (!guestSignatureRef.current.isEmpty()) {
          setGuestSignature(guestSignatureRef.current.toDataURL());
      }
      setShowGuestModal(false);
  };

  const handleSaveDriverSignature = () => {
      if (!driverSignatureRef.current.isEmpty()) {
          setDriverSignature(driverSignatureRef.current.toDataURL());
      }
      setShowDriverModal(false);
  };

    useEffect(() => {
      const fetchTripDetails = async () => {
        if (tripId) {
          try {
            const response = await LocalClient.get(`/form/${tripId}`);
          
            if (response.status===200) {
              setvisible(true)
              setTripDetails(response.data.data)
              
              console.log(" this is the data ", tripDetails);
            }
            setTripDetails(response.data.data);
          } catch (error) {
            console.error('Error fetching trip details:', error);
          }
        }
      };
  
      fetchTripDetails();
    }, [tripId]);
  

    const [data, setFormData] = useState({
        openKm: "",
        openHr: "",
        closeKm: "",
        closeHr: "",
       formId:tripId
    });

    const [driverSignature, setDriverSignature] = useState(null);
    const [guestSignature, setGuestSignature] = useState(null);
    


 

    const handleInputChange = (e) => {
        const { name, type, value, files } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "file" ? (files && files[0]) : 
                    ["openKm", "closeKm"].includes(name) ? 
                    Number(value) || 0 : value, // Convert specific fields to numbers
        }));
    };

    let totalKm = Number(data.openKm || 0) + Number(data.closeKm || 0);

    const validateForm = () => {
      const requiredFields = ['openKm', 'openHr', 'closeKm', 'closeHr'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
          alert("Please fill all required fields");
          return false;
      }

      if (!driverSignature) {
          alert("Driver signature is required");
          return false;
      }

      if (!guestSignature) {
          alert("Guest signature is required");
          return false;
      }

      return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = {
        ...data,
        Driversignature: driverSignature, // Already base64, no need for toDataURL()
        Guestsignature: guestSignature,
        totalKm: Number(data.openKm) + Number(data.closeKm),
    };

    console.log("Data being sent:", formData);

    try {
        const response = await LocalClient.patch("addtripsheet", formData);
        console.log("Server response:", response.data);

        if (response.data.success) {
            alert("Submitted successfully!");
            setFormData({ openKm: "", openHr: "", closeKm: "", closeHr: "" });
            setGuestSignature(null);
            setDriverSignature(null);
        }
    } catch (error) {
        alert("Submission failed!");
        console.error("Error:", error);
    }
};

    return<>
    {visible?( <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
        <header className="flex flex-col md:flex-row items-center p-6 border-b border-gray-200">
          <img src="/MLt.jpeg" alt="MLT Logo" className="w-24 h-24 mb-4 md:mb-0 md:mr-6" />
          
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-2xl font-bold text-gray-800">MLT Corporate Solutions Private Limited</h1>
            <p className="text-gray-600">123 Business Park, Main Street</p>
            <p className="text-gray-600">City, State - PIN Code</p>
            <p className="text-gray-600">Phone: +91 XXXXXXXXXX | Email: info@mltcorp.com</p>
          </div>
        </header>
      </div>

      <div>
      <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
       <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Booking Details</h2>
           <div className="space-y-4">
              <strong>M/S: {"dhbjhdvjhdfvhfdfmbdfh"}</strong> <br />
              <strong>Reporting:{tripDetails.reportingTime}</strong><br />
              <strong>BookedBy: {"  reminder what to do "}</strong><br />

              <strong>Driver Name : {tripDetails.drivername}</strong><br />
              <strong>vehicleType: {tripDetails.vehicleType}</strong><br />
              <strong>vehicleNo:{tripDetails.vehicleNo}</strong>   <br />
             </div>
            </div>
        </div>
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Passanger Details</h2>
              <div className="space-y-4">
             <strong>passenger name: {tripDetails.passengerName}</strong>    <br />
              <strong>passenger PhNo: {tripDetails.passengerPh}</strong>         <br />
              <strong>reporting address :{tripDetails.reportingAddress}</strong>   <br />
              <strong>droping address :{tripDetails.dropAddress}</strong>   <br />
             </div>
               </div>
         

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            
            {/* Timing Details Section */}
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Timing Details</h2>
              <div className="space-y-6">
            

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Opening</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <label className="w-32 font-medium text-gray-700">KM:</label>
                      <input
                        name="openKm"
                        type="number"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={data.openKm || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <label className="w-32 font-medium text-gray-700">Hours:</label>
                      <input
                        name="openHr"
                        type="time"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={data.openHr || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Closing</h3>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="w-32 font-medium text-gray-700">KM:</label>
                    <input
                      name="closeKm"
                      type="number"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={data.closeKm || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="w-32 font-medium text-gray-700">Hours:</label>
                    <input
                      name="closeHr"
                      type="time"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={data.closeHr || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Totals</h3>
                <p className="text-gray-700"> Total KM: {Number(data.openKm || 0) + Number(data.closeKm || 0)} KM</p>

                <p className="text-gray-700">Total Hours: Calculated based on time difference</p>
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
                                        <img src={guestSignature} alt="Guest Signature" className="h-20 border" />
                                        <button
                                            type="button"
                                            onClick={() => setShowGuestModal(true)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            Re-sign
                                        </button>
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

                            <div className="border p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Driver Signature</h3>
                                {driverSignature ? (
                                    <div className="mb-2">
                                        <img src={driverSignature} alt="Driver Signature" className="h-20 border" />
                                        <button
                                            type="button"
                                            onClick={() => setShowDriverModal(true)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            Re-sign
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowDriverModal(true)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Add Driver Signature
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

                    {showDriverModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
                                <h2 className="text-xl font-semibold mb-4">Driver Signature</h2>
                                <div className="border border-gray-300 rounded-lg bg-gray-100 mb-4">
                                    <SignaturePad
                                        ref={driverSignatureRef}
                                        canvasProps={{ className: 'w-full', style: { height: '200px' } }}
                                    />
                                </div>  
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => driverSignatureRef.current.clear()}
                                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={handleSaveDriverSignature}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Save Signature
                                    </button>
                                    <button
                                        onClick={() => setShowDriverModal(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    >
                                        Back to Form
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
    ):( <p>Loading trip details...</p>)}</>
}


export default DriverView