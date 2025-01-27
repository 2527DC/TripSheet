// import { useState } from 'react';
// import SignaturePad from 'react-signature-canvas';

// function App() {
//   const [signature, setSignature] = useState(null);
//   const [tripData, setTripData] = useState({
//     bookingDetails: {
//       ms: '',
//       reportingTo: '',
//       bookedBy: ''
//     },
//     vehicleDetails: {
//       logSheetNo: '',
//       vehicleType: '',
//       vehicleNo: '',
//       driverName: ''
//     },
//     timings: {
//       date: '',
//       openingKm: '',
//       openingHrs: '',
//       openingAmPm: 'AM',
//       closingKm: '',
//       closingHrs: '',
//       closingAmPm: 'AM'
//     },
//     journeyDetails: ''
//   });

//   const handleInputChange = (section, field, value) => {
//     setTripData(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value
//       }
//     }));
//   };

//   const clearSignature = () => {
//     if (signature) {
//       signature.clear();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
//         <header className="flex flex-col md:flex-row items-center p-6 border-b border-gray-200">
//           <img src="/MLt.jpeg" alt="MLT Logo" className="w-24 h-24 mb-4 md:mb-0 md:mr-6" />
//           <div className="text-center md:text-left">
//             <h1 className="text-2xl font-bold text-gray-800">MLT Corporate Solutions Private Limited</h1>
//             <p className="text-gray-600">123 Business Park, Main Street</p>
//             <p className="text-gray-600">City, State - PIN Code</p>
//             <p className="text-gray-600">Phone: +91 XXXXXXXXXX | Email: info@mltcorp.com</p>
//           </div>
//         </header>

//         <div className="p-6">
//           <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Booking Details</h2>
//             <div className="space-y-4">
//               <div className="flex flex-col md:flex-row md:items-center gap-2">
//                 <label className="w-32 font-medium text-gray-700">M/s:</label>
//                 <input
//                   type="text"
//                   className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={tripData.bookingDetails.ms}
//                   onChange={(e) => handleInputChange('bookingDetails', 'ms', e.target.value)}
//                 />
//               </div>
//               <div className="flex flex-col md:flex-row md:items-center gap-2">
//                 <label className="w-32 font-medium text-gray-700">Reporting To:</label>
//                 <input
//                   type="text"
//                   className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={tripData.bookingDetails.reportingTo}
//                   onChange={(e) => handleInputChange('bookingDetails', 'reportingTo', e.target.value)}
//                 />
//               </div>  
//               <div className="flex flex-col md:flex-row md:items-center gap-2">
//                 <label className="w-32 font-medium text-gray-700">Booked By:</label>
//                 <input
//                   type="text"
//                   className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={tripData.bookingDetails.bookedBy}
//                   onChange={(e) => handleInputChange('bookingDetails', 'bookedBy', e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Vehicle Details</h2>
//             <div className="space-y-4">
//               <div className="flex flex-col md:flex-row md:items-center gap-2">
//                 <label className="w-32 font-medium text-gray-700">Log Sheet No:</label>
//                 <input
//                   type="text"
//                   className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={tripData.vehicleDetails.logSheetNo}
//                   onChange={(e) => handleInputChange('vehicleDetails', 'logSheetNo', e.target.value)}
//                 />
//               </div>
//               <div className="flex flex-col md:flex-row md:items-center gap-2">
//                 <label className="w-32 font-medium text-gray-700">Vehicle Type:</label>
//                 <input
//                   type="text"
//                   className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={tripData.vehicleDetails.vehicleType}
//                   onChange={(e) => handleInputChange('vehicleDetails', 'vehicleType', e.target.value)}
//                 />
//               </div>
//               <div className="flex flex-col md:flex-row md:items-center gap-2">
//                 <label className="w-32 font-medium text-gray-700">Vehicle No:</label>
//                 <input
//                   type="text"
//                   className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={tripData.vehicleDetails.vehicleNo}
//                   onChange={(e) => handleInputChange('vehicleDetails', 'vehicleNo', e.target.value)}
//                 />
//               </div>
//               <div className="flex flex-col md:flex-row md:items-center gap-2">
//                 <label className="w-32 font-medium text-gray-700">Driver Name:</label>
//                 <input
//                   type="text"
//                   className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={tripData.vehicleDetails.driverName}
//                   onChange={(e) => handleInputChange('vehicleDetails', 'driverName', e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Timing Details</h2>
//             <div className="space-y-6">
//               <div className="flex flex-col md:flex-row md:items-center gap-2">
//                 <label className="w-32 font-medium text-gray-700">Date:</label>
//                 <input
//                   type="date"
//                   className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={tripData.timings.date}
//                   onChange={(e) => handleInputChange('timings', 'date', e.target.value)}
//                 />
//               </div>

//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="text-lg font-medium mb-4">Opening</h3>
//                 <div className="space-y-4">
//                   <div className="flex flex-col md:flex-row md:items-center gap-2">
//                     <label className="w-32 font-medium text-gray-700">KM:</label>
//                     <input
//                       type="number"
//                       className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={tripData.timings.openingKm}
//                       onChange={(e) => handleInputChange('timings', 'openingKm', e.target.value)}
//                     />
//                   </div>
//                   <div className="flex flex-col md:flex-row md:items-center gap-2">
//                     <label className="w-32 font-medium text-gray-700">Hours:</label>
//                     <input
//                       type="time"
//                       className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={tripData.timings.openingHrs}
//                       onChange={(e) => handleInputChange('timings', 'openingHrs', e.target.value)}
//                     />
//                   </div>
                
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h3 className="text-lg font-medium mb-4">Closing</h3>
//                 <div className="space-y-4">
//                   <div className="flex flex-col md:flex-row md:items-center gap-2">
//                     <label className="w-32 font-medium text-gray-700">KM:</label>
//                     <input
//                       type="number"
//                       className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={tripData.timings.closingKm}
//                       onChange={(e) => handleInputChange('timings', 'closingKm', e.target.value)}
//                     />
//                   </div>
//                   <div className="flex flex-col md:flex-row md:items-center gap-2">
//                     <label className="w-32 font-medium text-gray-700">Hours:</label>
//                     <input
//                       type="time"
//                       className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={tripData.timings.closingHrs}
//                       onChange={(e) => handleInputChange('timings', 'closingHrs', e.target.value)}
//                     />
//                   </div>
                
//                 </div>
//               </div>

//               <div className="bg-blue-50 rounded-lg p-4">
//                 <h3 className="text-lg font-medium mb-2">Totals</h3>
//                 <p className="text-gray-700">Total KM: {tripData.timings.closingKm - tripData.timings.openingKm || 0} KM</p>
//                 <p className="text-gray-700">Total Hours: Calculated based on time difference</p>
//               </div>
//             </div>
//           </div>

//           <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Journey Details</h2>
//             <textarea
//               className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
//               value={tripData.journeyDetails}
//               onChange={(e) => handleInputChange('journeyDetails', '', e.target.value)}
//               rows="4"
//             ></textarea>
//           </div>

//           <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Important Notes</h2>
//             <ol className="list-decimal pl-6 space-y-2 text-gray-700">
//               <li>All trips must be authorized by the company.</li>
//               <li>Driver must maintain proper log of all stops.</li>
//               <li>Speed limits must be strictly followed.</li>
//               <li>No unauthorized passengers allowed.</li>
//               <li>Report any vehicle issues immediately.</li>
//             </ol>
//           </div>

//           <div className="bg-white rounded-lg border border-gray-200 p-4 ">
//             <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Signatures</h2>
//             <div className="mt-4">
//               <h3 className="text-lg font-medium mb-2">Guest Signature</h3>
//               <div className="border border-gray-300 rounded-lg overflow-hidden">
//           <SignaturePad
//             ref={(ref) => setSignature(ref)}
//             canvasProps={{
//           className: 'signature-canvas bg-white',
//           style: {
//             height: '250px', // Default height
//           },
//         }}
//       />
//     </div>
//               <button
//                 onClick={clearSignature}
//                 className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               >
//                 Clear Signature
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;