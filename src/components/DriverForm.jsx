import {  useEffect, useState } from 'react';

import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { axiosClient } from '../Api/API_Client';

const DriverForm = () => {
  const [tripDetails, setTripDetails] = useState(null);
  const location = useLocation();
  
  // Extract the tripId from the URL
  const queryParams = new URLSearchParams(location.search);
  const tripId = queryParams.get('formId');
  
  // Fetch the trip details based on the tripId
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (tripId) {
        try {
          const response = await axiosClient.get(`/form/${tripId}`);
          setTripDetails(response.data.data);
        } catch (error) {
          console.error('Error fetching trip details:', error);
        }
      }
    };

    fetchTripDetails();
  }, [tripId]);

  return (
    <div>
      <h2>Driver Form</h2>
      {tripDetails ? (
        <div>
          <h3>Trip Details:</h3>
          <p><strong>Driver Name:</strong> {tripDetails.driver}</p>
          <p><strong>Vehicle:</strong> {tripDetails.vehicle}</p>
          <p><strong>Service Type:</strong> {tripDetails.serviceType}</p>
          <p><strong>Passenger Name:</strong> {tripDetails.passengerName}</p>
          <p><strong>Phone Number:</strong> {tripDetails.passengerPhoneNumber}</p>
          <p><strong>Reporting Address:</strong> {tripDetails.reportingAddress}</p>
          <p><strong>Drop Address:</strong> {tripDetails.dropAddress}</p>
          <p><strong>AC Type:</strong> {tripDetails.acType}</p>
          <p><strong>Reporting Time:</strong> {tripDetails.reportingTime}</p>
        </div>
      ) : (
        <p>Loading trip details...</p>
      )}
    </div>
  );
};

export default DriverForm;
