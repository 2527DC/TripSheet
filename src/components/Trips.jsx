import { ChevronRight } from "lucide-react";

const TripList = ({ trips = [], selectedTrip, setSelectedTrip }) => {
  console.log("Trips in TripList Component:", trips);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mt-1">
      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {trips.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No trips found</p>
        ) : (
          trips.map((trip) => {
            const date = new Date(trip.createdAt);
            const formattedDate = !isNaN(date.getTime())
              ? `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}/${date.getFullYear()}`
              : "Invalid Date";

             return (
  <div
    key={trip.id}
    onClick={() => setSelectedTrip(trip)}
    className={`p-3 rounded-lg cursor-pointer grid grid-cols-5 items-center justify-between ${
      selectedTrip?.id === trip.id
        ? "bg-blue-50 border-blue-200" // Highlight selected trip with blue background
        : "hover:bg-gray-100 border-gray-200" // Hover effect with a soft gray background
    } border transition-colors duration-300 ease-in-out`}
  >
    <div className="col-span-1">
      <p className="text-sm text-gray-900">{formattedDate}</p>
    </div>
    <div className="col-span-1">
      <p className="text-sm text-blue-600 font-semibold">{trip.vehicleNo}</p> {/* Vehicle No in blue */}
    </div>
    <div className="col-span-1">
      <p className="text-sm text-green-600">{trip.customer}</p> {/* Customer in green */}
    </div>
    <div className="col-span-1">
      <p className="text-sm text-yellow-600">{trip.status}</p> {/* Status in yellow */}
    </div>
    <div className="col-span-1 flex justify-end">
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  </div>
);

              
          })
        )}
      </div>
    </div>
  );
};

export { TripList };
