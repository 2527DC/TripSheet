import { useState } from "react";
import { imageUrl, LocalClient } from "../Api/API_Client";
import TripSheetPDF, { downloadPDF } from "./DownloadPdf";
import { Pencil, Download, CheckCircle, XCircle } from "lucide-react";

const TripDetails = ({ selectedTrip }) => {
  const [trip, setTrip] = useState(selectedTrip);
  const [isEditingDriverSig, setIsEditingDriverSig] = useState(false);
  const [isEditingGuestSig, setIsEditingGuestSig] = useState(false);
  const [newDriverSignature, setNewDriverSignature] = useState(null);
  const [newGuestSignature, setNewGuestSignature] = useState(null);

  const date = new Date(trip.createdAt);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleDownload = () => {
    downloadPDF();
  };

  const handleUpdateStatus = async (status) => {
    try {
      const response = await LocalClient.patch("updateStatus", {
        id: trip.formId,
        status: status,
      });

      if (response.status === 200) {
        setTrip({
          ...trip,
          status: response.data.updatedstatus,
        });
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  const handleSignatureUpdate = async (type) => {
    try {
      const formData = new FormData();
      formData.append('signature', type === 'driver' ? newDriverSignature : newGuestSignature);
      formData.append('tripId', trip.formId);
      formData.append('type', type);

      const response = await LocalClient.patch("updateSignature", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setTrip({
          ...trip,
          [type === 'driver' ? 'driver_url' : 'guest_url']: response.data.url,
        });
        type === 'driver' ? setIsEditingDriverSig(false) : setIsEditingGuestSig(false);
        alert('Signature updated successfully');
      }
    } catch (error) {
      alert('Failed to update signature');
    }
  };

  const driver_url = `${imageUrl}${trip.driver_url}`;
  const guest_url = `${imageUrl}${trip.guest_url}`;

  const getStatusColor = (status) => {
    const colors = {
      Approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      Rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="hidden">
        <TripSheetPDF selectedTrip={selectedTrip} formattedDate={formattedDate} />
      </div>

      {trip ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Trip Details</h2>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                {trip.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoField label="Date" value={formattedDate} />
              <InfoField label="Driver Name" value={trip.drivername} />
              <InfoField label="Vehicle Type" value={trip.vehicleType} />
              <InfoField label="Open Km" value={trip.openKm} />
              <InfoField label="Open Hr" value={trip.openHr} />
            </div>
            <div className="space-y-4">
              <InfoField label="Close Km" value={trip.closeKm} />
              <InfoField label="Close Hr" value={trip.closeHr} />
              <InfoField label="Total Km" value={trip.totalKm} />
              <InfoField label="Total Hr" value={trip.totalHr || "Not available"} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Guest Signature</h3>
                <button
                  onClick={() => setIsEditingGuestSig(!isEditingGuestSig)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={16} />
                </button>
              </div>
              {isEditingGuestSig ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewGuestSignature(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button
                    onClick={() => handleSignatureUpdate('guest')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Signature
                  </button>
                </div>
              ) : (
                <img
                  src={guest_url}
                  alt="Guest Signature"
                  className="w-48 h-48 object-contain border rounded-lg p-2 bg-gray-50"
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Driver Signature</h3>
                <button
                  onClick={() => setIsEditingDriverSig(!isEditingDriverSig)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={16} />
                </button>
              </div>
              {isEditingDriverSig ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewDriverSignature(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button
                    onClick={() => handleSignatureUpdate('driver')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Signature
                  </button>
                </div>
              ) : (
                <img
                  src={driver_url}
                  alt="Driver Signature"
                  className="w-48 h-48 object-contain border rounded-lg p-2 bg-gray-50"
                />
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t mt-6">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              <span>Download PDF</span>
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={() => handleUpdateStatus("Approved")}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={20} />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleUpdateStatus("Rejected")}
                className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle size={20} />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Select a trip to view details.</p>
        </div>
      )}
    </div>
  );
};

const InfoField = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default TripDetails;