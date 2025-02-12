import { useState, useEffect, useRef } from "react";

import TripSheetPDF, { downloadPDF } from "./DownloadPdf";
import { CheckCircle2, Download, XCircle, Edit2, X,  } from "lucide-react";
import SignaturePad from 'react-signature-canvas';
import { imageUrl, LocalClient } from "../Api/API_Client";

const TripDetails = ({ selectedTrip, goBack }) => {
  const [trip, setTrip] = useState(selectedTrip || {});
  const [editingFields, setEditingFields] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const driverSignatureRef = useRef();
  const guestSignatureRef = useRef();


  useEffect(() => {
    setTrip(selectedTrip || {});
    setEditedValues(selectedTrip || {});
    setEditingFields({});
  }, [selectedTrip]);

  const handleStartEditing = (key) => {
    setEditingFields(prev => ({ ...prev, [key]: true }));
    setEditedValues(prev => ({ ...prev, [key]: trip[key] }));
  };

  const handleCancelEditing = (key) => {
    setEditingFields(prev => ({ ...prev, [key]: false }));
    setEditedValues(prev => ({ ...prev, [key]: trip[key] }));
  };

  

  const handleSaveField = async (key) => {
    try {
      let value = editedValues[key];
  
      // Convert specific fields to Float
      const floatFields = ["toolCharges", "closeKm", "openKm", "totalKm", "parkingCharges"];
      if (floatFields.includes(key)) {
        value = parseFloat(value);
        if (isNaN(value)) {
          alert(`${key} must be a valid number.`);
          return;
        }
      }
  
      console.log("Saving field:", {
        formId: trip.formId,
        fieldName: key,
        fieldValue: value
      });
  
      const response = await LocalClient.patch("editField", {
        formId: trip.formId,
        fieldName: key,
        fieldValue: value,
      });
  
      if (response.status === 200) {
        console.log("Response:", response.data);
        alert(`${key} updated successfully!`);
  
        // ✅ Update state
        setTrip((prev) => ({ ...prev, [key]: value }));
        setEditingFields((prev) => ({ ...prev, [key]: false }));
      }
    } catch (error) {
      alert(`Error updating ${key}`);
      console.error(error);
    }
  };
  
  const handleChange = (key, value) => {
    setEditedValues(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateStatus = async (status) => {
    try {
      // Here you would make the API call to update the status
      const response = await LocalClient.patch("updateStatus", {
       id: trip.formId,
        status: status
      });

      if (response.status===200) {
        setTrip(prev => ({ ...prev, status }));
        alert(`Trip status updated to ${status}`);
      }

    
    } catch (error) {
      alert("Error updating status");
      console.error(error);
    }
  };
  const fieldsToShow = [
    { label: "Company", key: "company" },
    { label: "Vendor", key: "vendor" },
    { label: "Booked By", key: "bookedBy" },
    { label: "Driver Name", key: "drivername" },
    { label: "Vehicle No", key: "vehicleNo" },
    { label: "VehicleType", key: "vehicleType" },
    { label: "Reporting", key: "reportingTime" },
    { label: "Passenger", key: "passengerName" },
    { label: "Passenger Ph", key: "passengerPh" },
  ];




  const addressFields = [
    { label: "Reporting Address", key: "reportingAddress" },
    { label: "Drop Address", key: "dropAddress" },
  ];

  const driverFields = [
    { label: "Open Km", key: "openKm" },
    { label: "Open Hr", key: "openHr" },
    { label: "Close Km", key: "closeKm" },
    { label: "Close Hr", key: "closeHr" },
    { label: "Parking", key: "parkingCharges" },
    { label: "Tool", key: "toolCharges" },
    { label: "Total Hr", key: "totalHr" },
    { label: "Total Km", key: "totalKm" },
    { label: "Ac Type", key: "acType" },
    
  ];


  const handleDownload = () => {
    downloadPDF();
  };

  const handleSaveSignature = async (type) => {
    const signatureRef = type === 'driver' ? driverSignatureRef : guestSignatureRef;
    if (signatureRef.current.isEmpty()) {
      alert('Please provide a signature');
      return;
    }

    try {
      const signatureData = signatureRef.current.toDataURL();
      // console.log("this is the  signature data ",signatureData);
      
      // Here you would make the API call to save the signature
      const response = await LocalClient.patch("updateSignature", {
        formId: trip.formId,
        type: type,
        signature: signatureData
      });


      if (response.status===200 && type==='driver') {
         console.log(" this is the url of the image ", imageUrl+response.data.signature);
   
       
        console.log(" this is the trip object ", trip);
   
        setTrip(prev => ({
          ...prev,
          [`${type}_url`]: response.data.signature
        }));
        
        alert("update the signature")
     
      }else{
        console.log(" this is the url of the image ", imageUrl+response.data.signature);
   
       
        setTrip(prev => ({
          ...prev,
          [`${type}_url`]: response.data.signature
        }));
        
        alert("update guest signature")
      }

      if (type === 'driver') {
        setShowDriverModal(false);
      } else {
        setShowGuestModal(false);
      }
      
      alert('Signature saved successfully!');
    } catch (error) {
      alert('Error saving signature');
      console.error(error);
    }
  };

  const renderEditableField = (key, label, type = "input") => {
    const isEditing = editingFields[key];
    
    
    return (
      <div className="bg-gray-50 p-3 rounded-lg" key={key}>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-600">{label}</label>
          {!isEditing ? (
            <button
              onClick={() => handleStartEditing(key)}
              className="text-blue-600 hover:text-blue-700 p-1 rounded"
            >
              <Edit2 size={16} />
            </button>
          ) : null}
        </div>
        {isEditing ? (
          <div className="space-y-2">
            {type === "textarea" ? (
              <textarea
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={editedValues[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                rows={2}
              />
            ) : (
              <input
                type="text"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={editedValues[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveField(key)}
                className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => handleCancelEditing(key)}
                className="flex-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 font-medium">{trip[key] || "N/A"}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white h-[calc(100vh-100px)] p-6 rounded-lg shadow-lg overflow-y-auto">
      <div className="hidden">
        <TripSheetPDF selectedTrip={trip} />
      </div>

      {showDriverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Driver Signature</h3>
            <div className="border rounded-lg bg-white">
              <SignaturePad
                ref={driverSignatureRef}
                canvasProps={{
                  className: 'w-full h-64'
                }}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleSaveSignature('driver')}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowDriverModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showGuestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Guest Signature</h3>
            <div className="border rounded-lg bg-white">
              <SignaturePad
                ref={guestSignatureRef}
                canvasProps={{
                  className: 'w-full h-64'
                }}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleSaveSignature('guest')}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowGuestModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trip Details</h2>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
            trip.status === 'Approved' ? 'bg-green-100 text-green-800' :
            trip.status === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {trip.status || 'Pending'}
          </span>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          onClick={goBack}
        >
          <X size={18} />
          Close
        </button>
      </div>

      {/* Main Details */}
      <div className="space-y-6">
        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fieldsToShow.map(({ label, key }) => renderEditableField(key, label))}
        </div>

        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressFields.map(({ label, key  }) => renderEditableField(key, label, "textarea"))}
        </div>

        {/* Driver Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {driverFields.map(({ label, key }) => renderEditableField(key, label))}
        </div>

        {/* Signatures and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Driver Signature */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-700 mb-3">Driver Signature</p>
            <div className="relative">
              <img
                src={imageUrl+trip.driver_url}
                alt="Driver Signature"
                className="w-full h-40 object-contain border rounded-lg bg-white"
              />
              <button
                onClick={() => setShowDriverModal(true)}
                className="absolute bottom-2 right-2 bg-white/90 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-white transition-colors"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Guest Signature */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-700 mb-3">Guest Signature</p>
            <div className="relative">
              <img
               src={imageUrl+trip.guest_url}
                alt="Guest Signature"
                className="w-full h-40 object-contain border rounded-lg bg-white"
              />
              <button
                onClick={() => setShowGuestModal(true)}
                className="absolute bottom-2 right-2 bg-white/90 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-white transition-colors"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-3">
            <h3 className="font-medium text-gray-700 mb-2">Actions</h3>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />  
              Download PDF
            </button>
            <button
              onClick={() => handleUpdateStatus("Approved")}
              className="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle2 size={18} />
              Approve
            </button>
            <button
              onClick={() => handleUpdateStatus("Rejected")}
              className="flex items-center justify-center gap-2 w-full bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle size={18} />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;