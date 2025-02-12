import { useState, useEffect } from "react";
import { imageUrl, LocalClient } from "../Api/API_Client";
import TripSheetPDF, { downloadPDF } from "./DownloadPdf";
import { 
  Car, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Building2, 
  Truck,
  FileEdit,
  Download,
  CheckCircle2,
  XCircle,
  Save,
  X
} from "lucide-react";

const TripDetails = ({ selectedTrip }) => {
  const [trip, setTrip] = useState(selectedTrip);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTrip(selectedTrip);
  }, [selectedTrip]);

  const date = new Date(trip?.createdAt);
  const formattedDate = date ? `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}` : "";

  const handleDownload = () => downloadPDF();

  const handleUpdateStatus = async (status) => {
    try {
      const response = await LocalClient.patch("updateStatus", {
        id: trip.formId,
        status: status,
      });

      if (response.status === 200) {
        setTrip({ ...trip, status: response.data.updatedstatus });
        alert(response.data.message);
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  const handleSaveDetails = async () => {
    try {
      const response = await LocalClient.patch("updateTripDetails", {
        formId: trip.formId,
        ...trip
      });

      if (response.status === 200) {
        alert("Trip details updated!");
        setIsEditing(false);
      }
    } catch (error) {
      alert("Error updating details");
    }
  };

  const handleCancel = () => {
    setTrip(selectedTrip);
    setIsEditing(false);
  };

  const handleSignatureUpload = async (file, type) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('signature', file);
    formData.append('formId', trip.formId);
    formData.append('type', type);

    try {
      const response = await LocalClient.post("updateSignature", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setTrip(prev => ({
          ...prev,
          [`${type}_url`]: response.data[`${type}_url`]
        }));
      }
    } catch (error) {
      alert("Error updating signature");
    }
  };
    
  const driver_url = `${imageUrl}${trip?.driver_url}`;
  const guest_url = `${imageUrl}${trip?.guest_url}`;

  if (!trip) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500 text-lg">Select a trip to view details</p>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-2  ">
      <div className="hidden">
        <TripSheetPDF selectedTrip={trip} formattedDate={formattedDate} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trip Details</h2>
          <p className="text-gray-500">{formattedDate}</p>
        </div>
        <div className={`px-4 py-2 rounded-full ${getStatusColor(trip.status)}`}>
          {trip.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Car className="w-5 h-5" /> Vehicle Information
            </h3>
            <div className="space-y-3">
              {[
                ['Vehicle Type', 'vehicleType'],
                ['Vehicle No', 'vehicleNo'],
                ['AC Type', 'acType']
              ].map(([label, key]) => (
                <div key={key} className="flex items-center">
                  <span className="text-gray-600 w-32">{label}:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={trip[key]}
                      onChange={(e) => setTrip({...trip, [key]: e.target.value})}
                      className="flex-1 border rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <span className="text-gray-800">{trip[key]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Location Details
            </h3>
            <div className="space-y-3">
              {[
                ['Reporting Address', 'reportingAddress'],
                ['Drop Address', 'dropAddress']
              ].map(([label, key]) => (
                <div key={key}>
                  <span className="text-gray-600">{label}:</span>
                  {isEditing ? (
                    <textarea
                      value={trip[key]}
                      onChange={(e) => setTrip({...trip, [key]: e.target.value})}
                      className="w-full mt-1 border rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-800 mt-1">{trip[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Trip Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Open Km', 'openKm'],
                ['Close Km', 'closeKm'],
                ['Open Hr', 'openHr'],
                ['Close Hr', 'closeHr'],
                ['Total Km', 'totalKm']
              ].map(([label, key]) => (
                <div key={key}>
                  <span className="text-gray-600 block text-sm">{label}</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={trip[key]}
                      onChange={(e) => setTrip({...trip, [key]: e.target.value})}
                      className="w-full mt-1 border rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <span className="text-gray-800 font-medium">{trip[key]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Passenger Information
            </h3>
            <div className="space-y-3">
              {[
                ['Passenger Name', 'passengerName'],
                ['Passenger Phone', 'passengerPh'],
                ['Driver Name', 'drivername']
              ].map(([label, key]) => (
                <div key={key} className="flex items-center">
                  <span className="text-gray-600 w-32">{label}:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={trip[key]}
                      onChange={(e) => setTrip({...trip, [key]: e.target.value})}
                      className="flex-1 border rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <span className="text-gray-800">{trip[key]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Signatures</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="font-medium mb-2">Guest Signature</p>
            <div className="border rounded-lg p-4 bg-gray-50">
              <img src={guest_url} alt="Guest" className="w-40 h-40 object-contain mx-auto" />
              {isEditing && (
                <div className="mt-2 text-center">
                  <button 
                    onClick={() => document.getElementById('guestSig').click()}
                    className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    Update Signature
                  </button>
                  <input
                    type="file"
                    id="guestSig"
                    hidden
                    onChange={(e) => handleSignatureUpload(e.target.files[0], 'guest')}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Driver Signature</p>
            <div className="border rounded-lg p-4 bg-gray-50">
              <img src={driver_url} alt="Driver" className="w-40 h-40 object-contain mx-auto" />
              {isEditing && (
                <div className="mt-2 text-center">
                  <button
                    onClick={() => document.getElementById('driverSig').click()}
                    className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    Update Signature
                  </button>
                  <input
                    type="file"
                    id="driverSig"
                    hidden
                    onChange={(e) => handleSignatureUpload(e.target.files[0], 'driver')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button 
          onClick={handleDownload} 
          className="flex items-center gap-2 bg-blue-50 text-blue-600 py-2 px-4 rounded-full hover:bg-blue-100 transition-colors"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
        
        <div className="space-x-3">
          {isEditing ? (
            <>
              <button 
                onClick={handleSaveDetails} 
                className="flex items-center gap-2 bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
              <button 
                onClick={handleCancel} 
                className="flex items-center gap-2 bg-gray-100 text-gray-600 py-2 px-6 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
              >
                <FileEdit className="w-4 h-4" /> Edit Details
              </button>
              <button 
                onClick={() => handleUpdateStatus("Approved")} 
                className="flex items-center gap-2 bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
              <button 
                onClick={() => handleUpdateStatus("Rejected")} 
                className="flex items-center gap-2 bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;