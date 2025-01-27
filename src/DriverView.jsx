
import { InputFields } from './SmallComponents';
import React, { useState } from 'react';
import SignaturePad from 'react-signature-canvas';


const DriverView = (second) => { 
    const [signature, setSignature] = useState(null);

    const bookingdetailsInput = [
      { id: "M/s", label: "M/s", placeholder: "M/s", type: "text", required: true, name: "ms" },
      { id: "Reporting", label: "Reporting", placeholder: "Reporting", type: "text", required: true, name: "reporting" },
      { id: "Bookedby", label: "Booked By", placeholder: "Booked By", type: "text", required: true, name: "bookedby" },
    ];
  
    const VehicalInput = [
      { id: "Vehicletype", label: "Vehicle Type", placeholder: "Vehicle Type", type: "text", required: true, name: "vehicletype" },
      { id: "VehicleNo", label: "Vehicle NO", placeholder: "Vehicle NO", type: "text", required: true, name: "vehicleno" },
      { id: "drivername", label: "Driver Name", placeholder: "Driver Name", type: "text", required: true, name: "drivername" }
    ];
  
    const [data, setFormData] = useState({
      ms: "",
      reporting: "",
      bookedby: "",
      date: "",
      vehicletype: "",
      vehicleno: "",
      drivername: "",
      journeydetails: "",
      openingkm: "",
      openinghr: "",
      closingkm: "",
      closinghr: ""
    });
  
    const clearSignature = () => {
      if (signature) {
        signature.clear();
      }
    };
  
    const handleInputChange = (e) => {
      const { name, type, value, files } = e.target;
  
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === "file" ? (files && files[0]) : value,
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Form Data Submitted:", data);
      // Log signature if available
      if (signature) {
        const signatureData = signature.toDataURL();
        console.log("Signature Data:", signatureData);
      }
  
      // Clear form fields
      setFormData({
        ms: "",
        reporting: "",
        bookedby: "",
        date: "",
        vehicletype: "",
        vehicleno: "",
        drivername: "",
        journeydetails: "",
        openingkm: "",
        openinghr: "",
        closingkm: "",
        closinghr: ""
      });
  
      // Clear signature
      clearSignature();
    };
  

    return<>
     <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
        <header className="flex flex-col md:flex-row items-center p-6 border-b border-gray-200">
          <img src="/MLt.jpeg" alt="MLT Logo" className="w-24 h-24 mb-4 md:mb-0 md:mr-6" />
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">MLT Corporate Solutions Private Limited</h1>
            <p className="text-gray-600">123 Business Park, Main Street</p>
            <p className="text-gray-600">City, State - PIN Code</p>
            <p className="text-gray-600">Phone: +91 XXXXXXXXXX | Email: info@mltcorp.com</p>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Booking Details Section */}
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Booking Details</h2>
              <div className="space-y-4">
                {bookingdetailsInput.map((input, index) => (
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
                        name="openingkm"
                        type="number"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={data.openingkm || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <label className="w-32 font-medium text-gray-700">Hours:</label>
                      <input
                        name="openinghr"
                        type="time"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={data.openinghr || ""}
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
                      name="closingkm"
                      type="number"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={data.closingkm || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="w-32 font-medium text-gray-700">Hours:</label>
                    <input
                      name="closinghr"
                      type="time"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={data.closinghr || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Totals</h3>
                <p className="text-gray-700">Total KM: {"99"} KM</p>
                <p className="text-gray-700">Total Hours: Calculated based on time difference</p>
              </div>
            </div>

            {/* Journey Details Section */}
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Journey Details</h2>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                name="journeydetails"
                value={data.journeydetails || ""}
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

            {/* Signature Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 ">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Signatures</h2>
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Guest Signature</h3>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <SignaturePad
                    ref={(ref) => setSignature(ref)}
                    canvasProps={{
                      className: 'signature-canvas bg-white',
                      style: { height: '250px' },
                    }}
                  />
                </div>
                <button
                  onClick={clearSignature}
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