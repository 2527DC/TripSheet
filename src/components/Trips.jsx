
// import {  ChevronRight } from "lucide-react";

// const TripList = ({ trips, selectedTrip, setSelectedTrip, currentPage, setCurrentPage, totalPages }) => {


//   // Create a Date object from the ISO string
//   const date = new Date(trips.map((data)=>data.createdAt));
// console.log(trips);

//   // Get the day, month, and year
//   const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit format
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // `getMonth()` is zero-indexed (0 = January)
//   const year = date.getFullYear();

//   // Combine them in the "day/month/year" format
//   const formattedDate = `${day}/${month}/${year}`;
// console.log();
// const {data}= trips;
// console.log("  this is the data man ",data.status);

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-4">
//       <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
//         {trips.map((trip) => (
//           <div
//             key={trip.id}
//             onClick={() => setSelectedTrip(trip)}
//             className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
//               selectedTrip?.id === trip.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50 border-gray-100"
//             } border`}
//           >
//             <div>
//               <p className="font-medium">{trip.destination}</p>
//               <p className="text-sm text-gray-500">{formattedDate}</p>
              
//             </div>
//             <p className="text-sm text-gray-500">{trips.map((data)=>data.status)}</p>
//             <ChevronRight size={20} className="text-gray-400" />
//           </div>
//         ))}
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };




// export { TripList };


import { ChevronRight } from "lucide-react";

const TripList = ({ trips, selectedTrip, setSelectedTrip, currentPage, setCurrentPage, totalPages }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
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
      <div className="flex justify-between items-center mt-4">
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
      </div>
    </div>
  );
};

export { TripList };
