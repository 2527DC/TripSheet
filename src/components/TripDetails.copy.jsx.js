import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2,  XCircle, Edit2, X, Eye, Download, Printer } from "lucide-react";
import SignaturePad from "react-signature-canvas";
import { imageUrl, LocalClient } from "../Api/API_Client";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import DutySlip from "./DutySlip";
import generatePDF from '../utils/pdfUtils'
import ReactDOM from 'react-dom';
import { useReactToPrint } from 'react-to-print';
// Move getRatingLabel outside the component to make it globally accessible in this file
const getRatingLabel = (rating) => {
  const ratingLabels = {
    0: "Please select a rating",
    1: "Very Unsatisfied",
    2: "Unsatisfied",
    3: "Neutral",
    4: "Satisfied",
    5: "Very Satisfied",
  };
  return ratingLabels[rating] || "Invalid Rating";
};


const TripDetails = ({ selectedTrip, goBack ,updateTrip}) => {
  
  console.log(" this is the trip Details Component");
  
  const [trip, setTrip] = useState(selectedTrip || {});
  const [editingFields, setEditingFields] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const driverSignatureRef = useRef();
  const guestSignatureRef = useRef();
  const [previousValues, setPreviousValues] = useState({});
  const date = new Date(trip?.createdAt);
  const formattedDate = date
    ? `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`
    : "";
   
    const { user } = useAuth();
    const userRole = user?.role || " ";
    const isStatusUpdated = selectedTrip.edit; // Example condition
    // Store `canEdit` in state so it can be accessed anywhere
    const [canEdit,setCanEdit] =  useState(userRole === "SUPER_ADMIN" || (userRole === "ADMIN" && !isStatusUpdated))
    
    

  console.log("this is the formatted date", formattedDate);

  useEffect(() => {
    setTrip(selectedTrip || {});
    setEditedValues(selectedTrip || {});
    setEditingFields({});
    setPreviousValues({}); // Reset previous values when trip changes
  }, [selectedTrip]);

  const handleStartEditing = (key) => {
    console.log(" this is rge key " ,key);
    
    setEditingFields((prev) => ({ ...prev, [key]: true }));
  
    // ✅ Store the original value before editing
    setPreviousValues(trip[key]);
  
    setEditedValues((prev) => ({ ...prev, [key]: trip[key] }));
  };
  

  const handleCancelEditing = (key) => {
    console.log(" this is the privious value ");
    
    setEditingFields((prev) => ({ ...prev, [key]: false }));
    setEditedValues((prev) => ({ ...prev, [key]: trip[key] }));
  };

  const handleSaveField = async (key) => {

    console.log(" this the edited privious value " ,previousValues);
    
    try {
      let value = editedValues[key];

      // Convert specific fields to Float
      const floatFields = [
        "toolCharges",
        "closeKm",
        "openKm",
        "totalKm",
        "parkingCharges",
      ];
      if (floatFields.includes(key)) {
        value = parseFloat(value);
        if (isNaN(value)) {
          toast.warning(`${key} must be a valid number.`);
          return;
        }
      }
      
   const data ={formId: trip.formId,
                 fieldName: key,
                 fieldValue: value,
                 previousValues,
                 tripid:trip.id,
                 userName:user.name
              }

      console.log("Saving field:", data);

      const response = await LocalClient.patch("editField", data);

      if (response.status === 200) {
        console.log("Response:", response.data);
        toast.success(`${key} updated successfully!`);
        const updatedTrip = { ...selectedTrip, [key]: value };

        // 🔥 Call `updateTrip` to update the trips list in the parent
        updateTrip(updatedTrip);
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
    setEditedValues((prev) => ({ ...prev, [key]: value }));
    console.log(" this is the edidted fiels  ",key ,);
   
  };

  const handleUpdateStatus = async (status) => {
    try {
      const response = await LocalClient.patch("updateStatus", {
        id: trip.formId,
        status: status,
      });

      if (response.status === 200) {
        setCanEdit(false)
        setTrip((prev) => ({ ...prev, status }));
        const updatedTrip = { 
          ...selectedTrip, 
          ["status"]: status,         // First dynamic field update
          ["edit"]: true // Second dynamic field update
        };
        updateTrip(updatedTrip)
        
        toast.success(`Trip status updated to ${status}`);
      }
    } catch (error) {
      toast.error("Error updating status");
      console.error(error);
    }
  };

  const fieldsToShow = [
    { label: "Company", key: "company" },
    { label: "VendorName", key: "vendorName" },
    { label: "Driver Name", key: "driverName" },
    { label: "Vehicle No", key: "vehicleNo" },
    { label: "VehicleType", key: "vehicleType" },
    { label: "Reporting", key: "reportingTime" },
    { label: "Customer Name", key: "customer" },
    { label: "Customer Ph", key: "customerPh" },
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




  const dutySlipRef = useRef(null); // Ref to access the DutySlip DOM
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false); // State to control rendering
  
  const handleDownloadReport = () => {
    console.log('This is the data sending for PDF:', trip);
    setIsGeneratingPDF(true); // Show DutySlip temporarily to generate PDF
  }
// Handle print
const handlePrint = () => {
  // Create a temporary container
  const printContainer = document.createElement('div');
  document.body.appendChild(printContainer);

  // Render ONLY the DutySlip component with current trip data
  ReactDOM.render(
    <DutySlip dutyData={trip} />,  // This is your existing DutySlip component
    printContainer,
    () => {
      // Focus and print
      window.focus();
      window.print();
      
      // Clean up after printing
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(printContainer);
        document.body.removeChild(printContainer);
      }, 500);
    }
  );
};

  // Effect to trigger PDF generation after DutySlip is rendered
  React.useEffect(() => {
    if (isGeneratingPDF && dutySlipRef.current) {
      // Wait for the next tick to ensure DOM is rendered
      setTimeout(() => {
        generatePDF(); // Call your existing generatePDF function
        setIsGeneratingPDF(false); // Hide DutySlip after generating PDF
      }, 0);
    }
  }, [isGeneratingPDF]);

  const handleSaveSignature = async (type) => {
    const signatureRef = type === "driver" ? driverSignatureRef : guestSignatureRef;
    if (signatureRef.current.isEmpty()) {
      alert("Please provide a signature");
      return;
    }

    try {
      const signatureData = signatureRef.current.toDataURL();

      const response = await LocalClient.patch("updateSignature", {
        formId: trip.formId,
        type: type,
        signature: signatureData,
      });

      if (response.status === 200 && type === "driver") {
        console.log("this is the url of the image", imageUrl + response.data.signature);

        console.log("this is the trip object", trip);

        setTrip((prev) => ({
          ...prev,
          [`${type}_url`]: response.data.signature,
        }));

        alert("update the signature");
      } else {
        console.log("this is the url of the image", imageUrl + response.data.signature);

        setTrip((prev) => ({
          ...prev,
          [`${type}_url`]: response.data.signature,
        }));

        toast.success("update guest signature");
      }

      if (type === "driver") {
        setShowDriverModal(false);
      } else {
        setShowGuestModal(false);
      }

      alert("Signature saved successfully!");
    } catch (error) {
      alert("Error saving signature");
      console.error(error);
    }
  };

  const renderEditableField = (key, label, type = "input") => {

    const isEditing = editingFields[key];
   
    return (
      <div className="bg-gray-50 p-3 rounded-lg" key={key}>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-600">{label}</label>
          {canEdit && !isEditing ? (
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
          <p className="text-gray-800 font-medium">
            {key === "review" && trip[key] !== undefined && trip[key] !== null
              ? `${trip[key]} - ${getRatingLabel(trip[key])}`
              : trip[key] || "N/A"}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white h-[calc(100vh-100px)] p-6 rounded-lg shadow-lg overflow-y-auto">
    
      {showGuestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Guest Signature</h3>
            <div className="border rounded-lg bg-white">
              <SignaturePad
                ref={guestSignatureRef}
                canvasProps={{
                  className: "w-full h-64",
                }}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleSaveSignature("guest")}
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
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              trip.status === "Approved"
                ? "bg-green-100 text-green-800"
                : trip.status === "Rejected"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {trip.status || "Pending"}
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
          {addressFields.map(({ label, key }) =>
            renderEditableField(key, label, "textarea")
          )}
        </div>

        {/* Driver Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {driverFields.map(({ label, key }) => renderEditableField(key, label))}
        </div>

        {/* Signatures and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Driver Signature */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h1 className="text-xl font-semibold mb-4">Customer Reviews</h1>
            {selectedTrip.review !== undefined && selectedTrip.review !== null ? (
              <p className="text-gray-800 font-medium">
                Rating: {selectedTrip.review} - {getRatingLabel(selectedTrip.review)}
              </p>
            ) : (
              <p className="text-gray-800 font-medium">No review available</p>
            )}
          </div>

          {/* Guest Signature */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-700 mb-3">Guest Signature</p>
            <div className="relative">
              <img
                src={imageUrl + trip.guest_url}
                alt="Guest Signature"
                className="w-full h-40 object-contain border rounded-lg bg-white"
              />
              {canEdit?<button
                onClick={() => setShowGuestModal(true)}
                className="absolute bottom-2 right-2 bg-white/90 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-white transition-colors"
              >
                Edit
              </button>:null
              }
              
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-3">
            <h3 className="font-medium text-gray-700 mb-2">Actions</h3>
            <button
            onClick={handleDownloadReport}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Download Pdf
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2  bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer size={18} />
            Print
          </button>
             {canEdit?( <><button
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
            </button></>):null}
          </div>
          {isGeneratingPDF && (
        <div style={{ position: 'absolute', left: '-9999px' }}>
          <DutySlip
            ref={dutySlipRef}
            // Pass trip data as props instead of URL params
            dutyData={selectedTrip}
          />
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;