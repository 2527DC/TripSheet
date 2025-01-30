import { useState } from 'react';
import { useAuth } from './store/ AuthProvider';

// Static trip data for demonstration
const staticTripData = [
  {
    id: 1,
    status: 'pending',
    bookingDetails: {
      ms: 'ABC Company',
      reportingTo: 'John Doe',
      bookedBy: 'Jane Smith'
    },
    vehicleDetails: {
      logSheetNo: 'LS001',
      vehicleType: 'Sedan',
      vehicleNo: 'KA01AB1234',
      driverName: 'David Wilson'
    },
    timings: {
      date: '2024-02-20',
      openingKm: '10000',
      openingHrs: '09:00',
      openingAmPm: 'AM',
      closingKm: '10150',
      closingHrs: '06:00',
      closingAmPm: 'PM'
    },
    journeyDetails: 'Airport pickup and drop - Multiple locations visited'
  },
  {
    id: 2,
    status: 'approved',
    bookingDetails: {
      ms: 'XYZ Corp',
      reportingTo: 'Alice Brown',
      bookedBy: 'Bob Johnson'
    },
    vehicleDetails: {
      logSheetNo: 'LS002',
      vehicleType: 'SUV',
      vehicleNo: 'KA01CD5678',
      driverName: 'Michael Scott'
    },
    timings: {
      date: '2024-02-19',
      openingKm: '15000',
      openingHrs: '10:00',
      openingAmPm: 'AM',
      closingKm: '15200',
      closingHrs: '08:00',
      closingAmPm: 'PM'
    },
    journeyDetails: 'Client meeting transportation - City tour'
  },
  {
    id: 3,
    status: 'approved',
    bookingDetails: {
      ms: 'XYZ Corp',
      reportingTo: 'Alice Brown',
      bookedBy: 'Bob Johnson'
    },
    vehicleDetails: {
      logSheetNo: 'LS002',
      vehicleType: 'SUV',
      vehicleNo: 'KA01CD5678',
      driverName: 'Michael Scott'
    },
    timings: {
      date: '2024-02-19',
      openingKm: '15000',
      openingHrs: '10:00',
      openingAmPm: 'AM',
      closingKm: '15200',
      closingHrs: '08:00',
      closingAmPm: 'PM'
    },
    journeyDetails: 'Client meeting transportation - City tour'
  }
  ,{
    id: 4,
    status: 'approved',
    bookingDetails: {
      ms: 'XYZ Corp',
      reportingTo: 'Alice Brown',
      bookedBy: 'Bob Johnson'
    },
    vehicleDetails: {
      logSheetNo: 'LS002',
      vehicleType: 'SUV',
      vehicleNo: 'KA01CD5678',
      driverName: 'Michael Scott'
    },
    timings: {
      date: '2024-02-19',
      openingKm: '15000',
      openingHrs: '10:00',
      openingAmPm: 'AM',
      closingKm: '15200',
      closingHrs: '08:00',
      closingAmPm: 'PM'
    },
    journeyDetails: 'Client meeting transportation - City tour'
  },
  {
    id: 5,
    status: 'pending',
    bookingDetails: {
      ms: 'XYZ Corp',
      reportingTo: 'Alice Brown',
      bookedBy: 'Bob Johnson'
    },
    vehicleDetails: {
      logSheetNo: 'LS002',
      vehicleType: 'SUV',
      vehicleNo: 'KA01CD5678',
      driverName: 'Michael Scott'
    },
    timings: {
      date: '2024-02-19',
      openingKm: '15000',
      openingHrs: '10:00',
      openingAmPm: 'AM',
      closingKm: '15200',
      closingHrs: '08:00',
      closingAmPm: 'PM'
    },
    journeyDetails: 'Client meeting transportation - City tour'
  },  {
    id: 6,
    status: 'pending',
    bookingDetails: {
      ms: 'ABC Company',
      reportingTo: 'John Doe',
      bookedBy: 'Jane Smith'
    },
    vehicleDetails: {
      logSheetNo: 'LS001',
      vehicleType: 'Sedan',
      vehicleNo: 'KA01AB1234',
      driverName: 'David Wilson'
    },
    timings: {
      date: '2024-02-20',
      openingKm: '10000',
      openingHrs: '09:00',
      openingAmPm: 'AM',
      closingKm: '10150',
      closingHrs: '06:00',
      closingAmPm: 'PM'
    },
    journeyDetails: 'Airport pickup and drop - Multiple locations visited'
  },  {
    id: 7,
    status: 'pending',
    bookingDetails: {
      ms: 'ABC Company',
      reportingTo: 'John Doe',
      bookedBy: 'Jane Smith'
    },
    vehicleDetails: {
      logSheetNo: 'LS001',
      vehicleType: 'Sedan',
      vehicleNo: 'KA01AB1234',
      driverName: 'David Wilson'
    },
    timings: {
      date: '2024-02-20',
      openingKm: '10000',
      openingHrs: '09:00',
      openingAmPm: 'AM',
      closingKm: '10150',
      closingHrs: '06:00',
      closingAmPm: 'PM'
    },
    journeyDetails: 'Airport pickup and drop - Multiple locations visited'
  },  {
    id: 8,
    status: 'pending',
    bookingDetails: {
      ms: 'ABC Company',
      reportingTo: 'John Doe',
      bookedBy: 'Jane Smith'
    },
    vehicleDetails: {
      logSheetNo: 'LS001',
      vehicleType: 'Sedan',
      vehicleNo: 'KA01AB1234',
      driverName: 'David Wilson'
    },
    timings: {
      date: '2024-02-20',
      openingKm: '10000',
      openingHrs: '09:00',
      openingAmPm: 'AM',
      closingKm: '10150',
      closingHrs: '06:00',
      closingAmPm: 'PM'
    },
    journeyDetails: 'Airport pickup and drop - Multiple locations visited'
  },  {
    id: 9,
    status: 'pending',
    bookingDetails: {
      ms: 'ABC Company',
      reportingTo: 'John Doe',
      bookedBy: 'Jane Smith'
    },
    vehicleDetails: {
      logSheetNo: 'LS001',
      vehicleType: 'Sedan',
      vehicleNo: 'KA01AB1234',
      driverName: 'David Wilson'
    },
    timings: {
      date: '2024-02-20',
      openingKm: '10000',
      openingHrs: '09:00',
      openingAmPm: 'AM',
      closingKm: '10150',
      closingHrs: '06:00',
      closingAmPm: 'PM'
    },
    journeyDetails: 'Airport pickup and drop - Multiple locations visited'
  },  {
    id: 10,
    status: 'pending',
    bookingDetails: {
      ms: 'ABC Company',
      reportingTo: 'John Doe',
      bookedBy: 'Jane Smith'
    },
    vehicleDetails: {
      logSheetNo: 'LS001',
      vehicleType: 'Sedan',
      vehicleNo: 'KA01AB1234',
      driverName: 'David Wilson'
    },
    timings: {
      date: '2024-02-20',
      openingKm: '10000',
      openingHrs: '09:00',
      openingAmPm: 'AM',
      closingKm: '10150',
      closingHrs: '06:00',
      closingAmPm: 'PM'
    },
    journeyDetails: 'Airport pickup and drop - Multiple locations visited'
  },
];

function AdminView() {
  const [trips, setTrips] = useState(staticTripData);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const handleApprove = (tripId) => {
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, status: 'approved' } : trip
    ));
  };

  const handleReject = (tripId) => {
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, status: 'rejected' } : trip
    ));
  };
  const {logout}= useAuth()
  return (
    <div className="p-4 sm:p-6 h-screen">
    {/* Header Section */}
    <div className="mb-4 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Trip Sheet Admin Dashboard
      </h1>
      <div><button title='Logout' onClick={logout}> LOgout MAcha</button></div>
    </div>
  
    {/* Two-column grid layout */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-[calc(100%-5rem)]">
      {/* Column 1 */}
      <div className="h-full overflow-y-auto">
        {/* Sticky Heading */}
        <div className="sticky top-0 bg-yellow-100 p-3 mb-1 z-10 rounded">
          <h1 className="text-lg sm:text-xl font-bold">TripSheet List</h1>
        </div>
        {/* Scrollable Content */}
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 mb-2"
            onClick={() => setSelectedTrip(trip)}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
              <div>
                <h3 className="font-semibold">Log Sheet: {trip.vehicleDetails.logSheetNo}</h3>
                <p className="text-sm text-gray-600">Date: {trip.timings.date}</p>
                <p className="text-sm text-gray-600">Driver: {trip.vehicleDetails.driverName}</p>
                <p className="text-sm text-gray-600">Company: {trip.bookingDetails.ms}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  trip.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : trip.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
  
      {/* Column 2 */}
      <div className="h-full overflow-y-auto">
        {/* Sticky Heading */}
        <div className="sticky top-0 bg-yellow-100 p-3 mb-1 z-10 rounded">
          <h1 className="text-lg sm:text-xl font-bold">TripSheet Details</h1>
        </div>
        {/* Scrollable Content */}
        {selectedTrip && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Booking Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="font-medium">M/s:</span> {selectedTrip.bookingDetails.ms}
                  </p>
                  <p>
                    <span className="font-medium">Reporting To:</span> {selectedTrip.bookingDetails.reportingTo}
                  </p>
                  <p>
                    <span className="font-medium">Booked By:</span> {selectedTrip.bookingDetails.bookedBy}
                  </p>
                </div>
              </div>
  
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Vehicle Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="font-medium">Log Sheet No:</span> {selectedTrip.vehicleDetails.logSheetNo}
                  </p>
                  <p>
                    <span className="font-medium">Vehicle Type:</span> {selectedTrip.vehicleDetails.vehicleType}
                  </p>
                  <p>
                    <span className="font-medium">Vehicle No:</span> {selectedTrip.vehicleDetails.vehicleNo}
                  </p>
                  <p>
                    <span className="font-medium">Driver Name:</span> {selectedTrip.vehicleDetails.driverName}
                  </p>
                </div>
              </div>
  
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Timing Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="font-medium">Date:</span> {selectedTrip.timings.date}
                  </p>
                  <p>
                    <span className="font-medium">Opening KM:</span> {selectedTrip.timings.openingKm}
                  </p>
                  <p>
                    <span className="font-medium">Opening Time:</span> {selectedTrip.timings.openingHrs} {selectedTrip.timings.openingAmPm}
                  </p>
                  <p>
                    <span className="font-medium">Closing KM:</span> {selectedTrip.timings.closingKm}
                  </p>
                  <p>
                    <span className="font-medium">Closing Time:</span> {selectedTrip.timings.closingHrs} {selectedTrip.timings.closingAmPm}
                  </p>
                  <p>
                    <span className="font-medium">Total KM:</span>{" "}
                    {selectedTrip.timings.closingKm - selectedTrip.timings.openingKm}
                  </p>
                </div>
              </div>
  
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Journey Details</h3>
                <p className="text-sm">{selectedTrip.journeyDetails}</p>
              </div>
  
              {selectedTrip.status === "pending" && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleApprove(selectedTrip.id)}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedTrip.id)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  
  );
}

export default AdminView;