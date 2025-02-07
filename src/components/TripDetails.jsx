  import { useState } from "react";
  import { imageUrl, LocalClient } from "../Api/API_Client";
import TripSheetPDF, { downloadPDF } from "./DownloadPdf";

  const TripDetails = ({ selectedTrip }) => {
    const [trip, setTrip] = useState(selectedTrip); // Local state to track trip details

    // Create a Date object from the ISO string
    const date = new Date(trip.createdAt);

    // Get the day, month, and year
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit format
    const month = String(date.getMonth() + 1).padStart(2, "0"); // `getMonth()` is zero-indexed (0 = January)
    const year = date.getFullYear();

    // Combine them in the "day/month/year" format
    const formattedDate = `${day}/${month}/${year}`;

   
    const handleDownload = () => {
      downloadPDF()
  };
    console.log("this is the slected trips sheet ",selectedTrip);

    const handleUpdateStatus = async (status) => {
      try {
        const response = await LocalClient.patch("updateStatus", {
          id: trip.formId,
          status: status,
        });

        if (response.status === 200) {
          // If the status update is successful, update the local state to reflect the new status
          setTrip({
            ...trip,
            status: response.data.updatedstatus, // Assuming the response has the updated status
          });
          alert(response.data.message); // Show success message
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert("An error occurred");
      }
    };

    const driver_url = `${imageUrl}${selectedTrip.driver_url}`;
    const guest_url =  `${imageUrl}${selectedTrip.guest_url}`;

  console.log("this is the DriverUrl",driver_url);



    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
         <div className="hidden">
                <TripSheetPDF selectedTrip={selectedTrip}  formattedDate={formattedDate}  />
            </div>
        {trip ? (
          <div>
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold mb-4">Trip Details</h2>
              <h1>
                Status:
                <span
                  className={`p-1 rounded-lg ${
                    trip.status === "Approved"
                      ? "bg-green-100"
                      : trip.status === "pending"
                      ? "bg-yellow-100"
                      : trip.status === "Rejected"
                      ? "bg-red-100"
                      : "bg-gray-100"
                  }`}
                >
                  {trip.status}
                </span>
              </h1>
            </div>

            <span>
              <strong>Date : </strong>
              <span>{formattedDate}</span>
            </span>
            <br />
            <span>
              <strong>Driver Name : </strong>
              <span>{trip.drivername}</span>
            </span>
            <br />
            <span>
              <strong>Vehicle Type : </strong>
              <span>{trip.vehicleType}</span>
            </span>
            <br />
            <span>
              <strong>openKm : </strong>
              <span>{trip.openKm}</span>
            </span>
            <br />
            <span>
              <strong>openHr : </strong>
              <span>{trip.openHr}</span>
            </span>
            <br />
            <span>
              <strong>closeKm: </strong>
              <span>{trip.closeKm}</span>
            </span>
            <br />
            <span>
              <strong>closeHr : </strong>
              <span>{trip.closeHr}</span>
            </span>
            <br />
            <span>
              <strong>totalKm: </strong>
              <span>{trip.totalKm}</span>
            </span>
            <br />
            <span>
              <strong>totalHr: </strong>
              <span>{" field should be added reminder "}</span>
            </span>
            <br />

            <div className="flex grid-cols-1 gap-5">
              {/* Guest Signature */}
              {true && (
                <div className="mt-4 p-1 bg-white ml-4">
                  <strong>Guest Signature:</strong>
                  <img
                    src={driver_url} // Replace with your static image path
                    alt="Guest Signature"
                    className="mt-2 w-32 h-32 object-contain transition-transform transform hover:scale-200"
                  />
                </div>
              )}

              {/* Driver Signature */}
              {true && (
                <div className="mt-4 bg-white p-2 ml-11">
                  <strong>Driver Signature:</strong>
                  <img
                    src={guest_url}// Replace with your static image path
                    alt="Driver Signature"
                    className="mt-2 w-52 h-32 object-contain transition-transform transform hover:scale-200 "
                  />
                </div>
              )}
            </div>

            {/* Buttons for Download and Update Status */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleDownload}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Download
              </button>
              <div>
                <button
                  onClick={() => handleUpdateStatus("Approved")}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus("Rejected")}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a trip to view details.</p>
        )}
      </div>
    );
  };

  export default TripDetails;
