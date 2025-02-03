import { useState } from 'react';

const TripSheetForm= () => {
  const [tripDetails, setTripDetails] = useState({
    driverName: '',
    tripDate: '',
  });

  const [generatedLink, setGeneratedLink] = useState('');

  const generateLink = async () => {
    const response = await fetch('http://localhost:5000/api/create-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripDetails),
    });

    const data = await response.json();
    if (data.success) {
      const link = `${window.location.origin}/driver-form?tripId=${data.tripId}`;
      setGeneratedLink(link);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard - Create Trip Sheet</h2>
      <input
        type="text"
        placeholder="Driver Name"
        value={tripDetails.driverName}
        onChange={(e) => setTripDetails({ ...tripDetails, driverName: e.target.value })}
      />
      <input
        type="date"
        value={tripDetails.tripDate}
        onChange={(e) => setTripDetails({ ...tripDetails, tripDate: e.target.value })}
      />
      <button onClick={generateLink}>Generate Trip Link</button>

      {generatedLink && (
        <p>
          Share this link with the driver: <a href={generatedLink}>{generatedLink}</a>
        </p>
      )}
    </div>
  );
};

export default TripSheetForm