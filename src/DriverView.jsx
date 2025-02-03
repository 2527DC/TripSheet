import { InputFields } from './SmallComponents';
import React, { useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { useAuth } from './store/ AuthProvider';
import { axiosClient } from './Api/API_Client';

const DriverView = () => { 
    let [Driversignature, setDriverSignature] = useState(null);
    let [Guestsignature, setGuestSignature] = useState(null);
    const { logout } = useAuth();

    const bookingdetailsInput = [
        { id: "M/s", label: "M/s", placeholder: "M/s", type: "text", required: true, name: "ms" },
        { id: "Reporting", label: "Reporting", placeholder: "Reporting", type: "text", required: true, name: "reporting" },
        { id: "bookedBy", label: "Booked By", placeholder: "Booked By", type: "text", required: true, name: "bookedBy" },
    ];

    const VehicalInput = [
        { id: "vehicleType", label: "Vehicle Type", placeholder: "Vehicle Type", type: "text", required: true, name: "vehicleType" },
        { id: "VehicleNo", label: "Vehicle NO", placeholder: "Vehicle NO", type: "text", required: true, name: "vehicleNo" },
        { id: "driverName", label: "Driver Name", placeholder: "Driver Name", type: "text", required: true, name: "driverName" }
    ];

    const [data, setFormData] = useState({
        vehicleType: "",
        ms: "",
        reporting: "",
        bookedBy: "",
        date: "",
        vehicleNo: "",
        driverName: "",
        journeyDetails: "",
        openKm: "",
        openHr: "",
        closeKm: "",
        closeHr: "",
    });

    const clearGuestSignature = (e) => {
        e.preventDefault();
        if (Guestsignature) {
            Guestsignature.clear();
        }
    };

    const clearDriverSignature = (e) => {
        e.preventDefault();
        if (Driversignature) {
            Driversignature.clear();
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const driverSignatureData = Driversignature ? Driversignature.toDataURL() : null;
        const guestSignatureData = Guestsignature ? Guestsignature.toDataURL() : null;

        const updatedFormData = {
            ...data,
            Driversignature: driverSignatureData,
            Guestsignature: guestSignatureData,
            totalKm: totalKm,
            status: "pending",
            totalHr: 2,
        };

        try {
            const response = await axiosClient.post("addtripsheet", updatedFormData);
            
            if (response.data.success) {
                alert("Submitted successfully!"); // Show success message
                console.log("Data uploaded successfully");

                // Clear form fields
                setFormData({
                    ms: "",
                    reporting: "",
                    bookedBy: "",
                    date: "",
                    vehicleType: "",
                    vehicleNo: "",
                    driverName: "",
                    journeyDetails: "",
                    openKm: "",
                    openHr: "",
                    closeKm: "",
                    closeHr: "",
                    totalKm: "",
                    totalHr: "",
                    status: "",
                    Driversignature: null,
                    Guestsignature: null,
                });

                // Clear signatures
                if (Driversignature) {
                    Driversignature.clear();
                }
                if (Guestsignature) {
                    Guestsignature.clear();
                }

            } else {
                alert("Submission failed! Please try again.");
                console.log("Data didn't upload successfully");
            }
        } catch (error) {
            alert("An error occurred while submitting.");
            console.error("An error occurred:", error);
        }

        console.log("Form Data Submitted:", updatedFormData);
    };

    return<>
     <div className="min-h-screen bg-gray-50 py-8 px-4">
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

          <div className="ml-auto">
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base">
              Logout
            </button>
          </div>
        </header>
      </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Booking Details Section */}
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Booking Details</h2>
              <div className="space-y-4">
                {bookingdetailsInput.map((input,index) => (
                  <InputFields
                    key={index}
                    id={input.id}
                    label={input.label}
                    placeholder={input.placeholder}
                    type={input.type}
                    required={input.required}
                    name={input.name}
                    value={data[input.name] || ""}
                    onChange={handleInputChange}
                  />
                ))}
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Vehicle Details</h2>
              <div className="space-y-4">
                {VehicalInput.map((input, index) => (
                  <InputFields
                    key={index}
                    id={input.id}
                    label={input.label}
                    placeholder={input.placeholder}
                    type={input.type}
                    required={input.required}
                    name={input.name}
                    value={data[input.name] || ""}
                    onChange={handleInputChange}
                  />
                ))}
              </div>
            </div>

            {/* Timing Details Section */}
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Timing Details</h2>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-32 font-medium text-gray-700">Date:</label>
                  <input
                    name="date"
                    type="date"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.date || ""}
                    onChange={handleInputChange}
                  />
                </div>

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

            {/* Journey Details Section */}
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Journey Details</h2>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                name="journeyDetails"
                value={data.journeyDetails || ""}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>

            {/* Important Notes Section */}
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Important Notes</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>All trips must be authorized by the company.</li>
                <li>Driver must maintain proper log of all stops.</li>
                <li>Speed limits must be strictly followed.</li>
                <li>No unauthorized passengers allowed.</li>
                <li>Report any vehicle issues immediately.</li>
              </ol>
            </div>

            {/* Signature Section  for guest */}
            <div className="bg-white rounded-lg border border-gray-500 p-4  ">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Signatures</h2>
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Guest Signature</h3>
                <div className="border border-gray-300 rounded-lg overflow-hidden  bg-greay-600 ">
                  <SignaturePad
                    ref={(ref) => setDriverSignature(ref)}
                    canvasProps={{
                      className: 'signature-canvas bg-red-100 w-full',
                      style: { height: '250px', 
                    
                      },
                    }}
                  />
                </div>
                <button
                  onClick={ clearGuestSignature}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Clear Signature
                </button>
              </div>
            </div>

              {/* Signature Section for driver  */}
            <div className="bg-white rounded-lg border border-gray-500 p-4 mt-2 ">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Signatures</h2>
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Driver Signature</h3>
                <div className="border border-gray-300 rounded-lg overflow-hidden  bg-greay-600 ">
                  <SignaturePad
                    ref={(ref) => setGuestSignature(ref)}
                    canvasProps={{
                      className: 'signature-canvas bg-red-100 w-full',
                      style: { height: '250px', 
                    
                      },
                    }}
                  />
                </div>
                <button
                  onClick={clearDriverSignature}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Clear Signature
                </button>
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
    </div></>
}


export default DriverView