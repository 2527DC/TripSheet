import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DriverForm = () => {
  const [formData, setFormData] = useState({
    tripId: '',
    driverName: '',
    tripDate: '',
    vehicleNumber: '',
  });

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tripId = queryParams.get('tripId');

    if (tripId) {
      fetch(`http://localhost:5000/api/get-trip/${tripId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setFormData({
              tripId: data.trip.tripId,
              driverName: data.trip.driverName,
              tripDate: data.trip.tripDate,
              vehicleNumber: '',
            });
          } else {
            alert("Trip details not found");
          }
        })
        .catch(error => console.error("Error fetching trip details:", error));
    }
  }, [location]);

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:5000/api/submit-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (data.success) {
      alert("Trip details submitted successfully!");
    }
  };

  return (
    <div>
      <h2>Driver Form</h2>
      <form>
        <input type="text" value={formData.driverName} readOnly />
        <input type="date" value={formData.tripDate} readOnly />
        <input
          type="text"
          placeholder="Enter Vehicle Number"
          value={formData.vehicleNumber}
          onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
        />
        <button type="button" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default DriverForm;
