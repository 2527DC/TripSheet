import { useState, useEffect } from "react";
import axios from "axios";
import { axiosClient } from "./Api/API_Client";

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // Number of items per page

  useEffect(() => {
    fetchTrips(page);
  }, [page]);

  const fetchTrips = async (page) => {
    try {
      const response = await axiosClient.get(`trips?page=${page}&limit=${limit}`);

      console.log(" this is the respodnce data",response.data);
      
      if (response.data.success) {
        setTrips(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  return (
    <div>
      <h2>Trip List</h2>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>{trip.vehicleType} - {trip.bookedBy}</li>
        ))}
      </ul>
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span> Page {page} of {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};




const SignatureDisplay = () => {
  const [imageSrc, setImageSrc] = useState('');
  const imageName = "driver-c0e338f3-525e-4cef-8dd6-68697b993644.png";

  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/getSignature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageName }), // Send the image name in the request body
        });

        if (response.ok) {
          // Create a Blob from the response and convert it to an object URL
          const imageBlob = await response.blob();

          // Create an object URL for the image
          const imageObjectUrl = URL.createObjectURL(imageBlob);
console.log(imageObjectUrl);

          // Set the object URL as the image source
          setImageSrc(imageObjectUrl);
        } else {
          console.error('❌ Error fetching image');
        }
      } catch (error) {
        console.error('❌ Error fetching signature:', error);
      }
    };

    fetchSignature();
  }, [imageName]);

  if (!imageSrc) return <p>Loading signature...</p>;

  return (
    <div>
      <h3>Signature Preview</h3>
      <img 
        src={imageSrc} 
        alt="Signature" 
        style={{ width: '300px', border: '1px solid #ddd' }} 
      />
    </div>
  );
};

export default SignatureDisplay;
