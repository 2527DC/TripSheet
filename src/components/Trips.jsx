

import { ChevronRight } from "lucide-react";

const TripList = ({ trips, selectedTrip, setSelectedTrip, currentPage, setCurrentPage, totalPages }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mt-1">
      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {trips.map((trip) => {
          // Ensure trip.createdAt is a valid date
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
                selectedTrip?.id === trip.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50 border-gray-100"
              } border`}
            >
              <div>
                <p className="font-medium">{trip.destination}</p>
                <p className="text-sm text-gray-500">{formattedDate}</p> {/* Corrected Date Formatting */}
              </div>
              <p className="text-sm text-gray-500">{trip.status}</p> {/* Fixed Status Display */}
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {/* <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export { TripList };
