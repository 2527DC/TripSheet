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
                className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
                  selectedTrip?.id === trip.id
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50 border-gray-100"
                } border`}
              >
                <div>

                  <p className="text-sm text-gray-500">{formattedDate}</p>
                </div>
                <p className="text-sm text-gray-500">{trip.status}</p>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export { TripList };
