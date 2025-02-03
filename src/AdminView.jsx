import axios from "axios";
import { useEffect, useState } from "react";
// import { useAuth } from "./store/AuthProvider";
// import { axiosClient } from "./Api/API_Client";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from "./store/ AuthProvider";
import { axiosClient } from "./Api/API_Client";

function AdminView() {
  const [trips, setTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [driverSignature, setDriverSignature] = useState(null);
  const [guestSignature, setGuestSignature] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const { logout } = useAuth();
  const limit = 5;

  const defaultImageUrl = "/path/to/default-image.png";

  useEffect(() => {
    fetchTrips(page);
  }, [page]);

  const fetchTrips = async (page) => {
    try {
      const response = await axiosClient.get(`trips?page=${page}&limit=${limit}`);
      if (response.data.success) {
        setTrips(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const fetchSignatures = async (driverUrl, guestUrl) => {
    try {
      const driverImageUrl = `http://localhost:3000/get-signature/${driverUrl}`;
      const guestImageUrl = `http://localhost:3000/get-signature/${guestUrl}`;
      
      setDriverSignature(driverImageUrl);
      setGuestSignature(guestImageUrl);
    } catch (error) {
      console.error("Error fetching images:", error);
      setDriverSignature(defaultImageUrl);
      setGuestSignature(defaultImageUrl);
    }
  };

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
    fetchSignatures(trip.driver_url, trip.guest_url);
    // On mobile, show details view when a trip is selected
    if (window.innerWidth < 768) {
      setIsMobileView(true);
    }
  };

  const handleBack = () => {
    setIsMobileView(false);
  };

  const handleApprove = async (tripId) => {
    try {
      await axiosClient.patch(`tripsheets/${tripId}/status`,{ status: "approved" });
      fetchTrips(page);
    } catch (error) {
      console.error("Error approving trip:", error);
    }
  };

  const handleReject = async (tripId) => {
    try {
      await axiosClient.patch(`tripsheets/${tripId}/status`, { status: "rejected" });
      fetchTrips(page);
    } catch (error) {
      console.error("Error rejecting trip:", error);
    }
  };

  const generatePDF = () => {
    if (!selectedTrip) return;

    const doc = new jsPDF();
    const fontSize = 12;
    const margin = 20;

    doc.setFontSize(16);
    doc.text("Trip Sheet Details", margin, margin);
    
    const formattedDate = new Date(selectedTrip.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const tripData = [
      ["M/s", selectedTrip.ms],
      ["Reporting To", selectedTrip.reporting],
      ["Booked By", selectedTrip.bookedBy],
      ["Vehicle Type", selectedTrip.vehicleType],
      ["Vehicle No", selectedTrip.vehicleNo],
      ["Driver Name", selectedTrip.driverName],
      ["Date", formattedDate],
      ["Opening KM", selectedTrip.openKm],
      ["Closing KM", selectedTrip.closeKm],
      ["Opening Time", selectedTrip.openHr],
      ["Closing Time", selectedTrip.closeHr],
      ["Journey Details", selectedTrip.journeyDetails],
      ["Status", selectedTrip.status],
    ];

    doc.autoTable({
      body: tripData,
      margin: { left: margin, right: margin, top: margin + 10 },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    const signatureX = doc.internal.pageSize.width / 2 - 50;
    const signatureY = doc.lastAutoTable.finalY + 20;

    if (driverSignature && driverSignature !== defaultImageUrl) {
      doc.addImage(driverSignature, 'PNG', signatureX, signatureY, 50, 50);
      doc.text("Driver's Signature", signatureX, signatureY + 55, { align: 'center' });
    }

    if (guestSignature && guestSignature !== defaultImageUrl) {
      doc.addImage(guestSignature, 'PNG', signatureX + 100, signatureY, 50, 50);
      doc.text("Guest's Signature", signatureX + 100, signatureY + 55, { align: 'center' });
    }

    doc.save(`trip_sheet_${selectedTrip.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Trip Sheet Admin Dashboard</h1>
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className={`md:grid md:grid-cols-2 md:gap-6 ${isMobileView ? 'hidden md:grid' : 'block'}`}>
          {/* Trip List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 md:mb-0">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Trip List</h2>
              <div className="space-y-3">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => handleSelectTrip(trip)}
                    className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Log Sheet: {trip.id}</h3>
                        <p className="text-sm text-gray-600">Date: {trip.date}</p>
                        <p className="text-sm text-gray-600">Driver: {trip.driverName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        trip.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50 text-sm"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50 text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-white rounded-lg shadow-sm hidden sm:block">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Trip Details</h2>
              {selectedTrip ? (
                <div className="space-y-6">
                  {/* Booking Details */}
                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Booking Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm"><span className="font-medium">M/s:</span> {selectedTrip.ms}</p>
                        <p className="text-sm"><span className="font-medium">Reporting To:</span> {selectedTrip.reporting}</p>
                        <p className="text-sm"><span className="font-medium">Booked By:</span> {selectedTrip.bookedBy}</p>
                      </div>
                    </div>
                  </section>

                  {/* Vehicle Details */}
                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Vehicle Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm"><span className="font-medium">Vehicle Type:</span> {selectedTrip.vehicleType}</p>
                        <p className="text-sm"><span className="font-medium">Vehicle No:</span> {selectedTrip.vehicleNo}</p>
                        <p className="text-sm"><span className="font-medium">Driver Name:</span> {selectedTrip.driverName}</p>
                      </div>
                    </div>
                  </section>

                  {/* Timing Details */}
                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Timing Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm"><span className="font-medium">Date:</span> {selectedTrip.date}</p>
                        <p className="text-sm"><span className="font-medium">Opening KM:</span> {selectedTrip.openKm}</p>
                        <p className="text-sm"><span className="font-medium">Closing KM:</span> {selectedTrip.closeKm}</p>
                        <p className="text-sm"><span className="font-medium">Opening Time:</span> {selectedTrip.openHr}</p>
                        <p className="text-sm"><span className="font-medium">Closing Time:</span> {selectedTrip.closeHr}</p>
                      </div>
                    </div>
                  </section>

                  {/* Journey Details */}
                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Journey Details</h3>
                    <p className="text-sm">{selectedTrip.journeyDetails}</p>
                  </section>

                  {/* Signatures */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Driver's Signature</h3>
                      <div className="relative group">
                        <img
                          src={driverSignature}
                          alt="Driver's Signature"
                          className="w-32 h-32 object-contain cursor-zoom-in transition-transform duration-300 hover:scale-150"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Guest's Signature</h3>
                      <div className="relative group">
                        <img
                          src={guestSignature}
                          alt="Guest's Signature"
                          className="w-32 h-32 object-contain cursor-zoom-in transition-transform duration-300 hover:scale-150"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {selectedTrip.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedTrip.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(selectedTrip.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={generatePDF}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Select a trip to view details</p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile View for Trip Details */}
        {isMobileView && (
          <div className="md:hidden">
            <button
              onClick={handleBack}
              className="mb-4 flex items-center text-gray-600"
            >
              <span className="mr-2">←</span> Back to Trip List
            </button>
            <div className="bg-white rounded-lg shadow-sm p-4">
              {selectedTrip && (
                <div className="space-y-6">
                  {/* Booking Details */}
                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Booking Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm"><span className="font-medium">M/s:</span> {selectedTrip.ms}</p>
                        <p className="text-sm"><span className="font-medium">Reporting To:</span> {selectedTrip.reporting}</p>
                        <p className="text-sm"><span className="font-medium">Booked By:</span> {selectedTrip.bookedBy}</p>
                      </div>
                    </div>
                  </section>

                  {/* Vehicle Details */}
                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Vehicle Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm"><span className="font-medium">Vehicle Type:</span> {selectedTrip.vehicleType}</p>
                        <p className="text-sm"><span className="font-medium">Vehicle No:</span> {selectedTrip.vehicleNo}</p>
                        <p className="text-sm"><span className="font-medium">Driver Name:</span> {selectedTrip.driverName}</p>
                      </div>
                    </div>
                  </section>

                  {/* Timing Details */}
                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Timing Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm"><span className="font-medium">Date:</span> {selectedTrip.date}</p>
                        <p className="text-sm"><span className="font-medium">Opening KM:</span> {selectedTrip.openKm}</p>
                        <p className="text-sm"><span className="font-medium">Closing KM:</span> {selectedTrip.closeKm}</p>
                        <p className="text-sm"><span className="font-medium">Opening Time:</span> {selectedTrip.openHr}</p>
                        <p className="text-sm"><span className="font-medium">Closing Time:</span> {selectedTrip.closeHr}</p>
                      </div>
                    </div>
                  </section>

                  {/* Journey Details */}
                  <section>
                    <h3 className="font-medium text-gray-900 mb-2">Journey Details</h3>
                    <p className="text-sm">{selectedTrip.journeyDetails}</p>
                  </section>

                  {/* Signatures */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Driver's Signature</h3>
                      <div className="relative group">
                        <img
                          src={driverSignature}
                          alt="Driver's Signature"
                          className="w-32 h-32 object-contain cursor-zoom-in transition-transform duration-300 hover:scale-150"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Guest's Signature</h3>
                      <div className="relative group">
                        <img
                          src={guestSignature}
                          alt="Guest's Signature"
                          className="w-32 h-32 object-contain cursor-zoom-in transition-transform duration-300 hover:scale-150"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {selectedTrip.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedTrip.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(selectedTrip.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={generatePDF}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminView;