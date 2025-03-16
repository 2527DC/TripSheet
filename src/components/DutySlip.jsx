import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DutySlip = () => {
  // Dummy data (you can replace this with props later)
  const dummyData = {
    dutyId: '#53111183-1',
    date: '05-03-2025',
    reportingTime: '04:45',
    customer: 'Walk-in',
    passenger: 'Anoop (91 97442 55513)',
    reportingAddress: 'Courtyard Marriott-Hebbal',
    dropAddress: 'BLR AIRPORT',
    dutyType: 'Airport Transfer',
    vehicleGroup: 'Innova Hycross Hybrid',
    vehicle: 'Innova Crysta Hycross KA05AP6133',
    driver: 'Muzahid Pasha',
    startKm: '16072',
    endKm: '16162',
    totalKm: '90',
    startTime: '03:30 05/03',
    endTime: '07:30 05/03',
    totalTime: '04:00',
    extraTime: '00:00',
    tollParkingCharge: '170.00',
  };

  // Function to generate and download PDF
  const generatePDF = () => {
    const input = document.getElementById('duty-slip');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('duty_slip.pdf');
    });
  };

  return (
    <div>
      <div id="duty-slip" style={{ width: '210mm', margin: '0 auto', padding: '20mm', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Duty #{dummyData.dutyId}</h2>
            <span style={{ backgroundColor: '#e0e0e0', padding: '2px 5px', borderRadius: '3px' }}>Status: Completed</span>
          </div>
          <button
            onClick={generatePDF}
            style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
          >
            Download PDF
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <div>
            <p><strong>Date:</strong> {dummyData.date}</p>
            <p><strong>Reporting Time:</strong> {dummyData.reportingTime}</p>
            <p><strong>Customer:</strong> {dummyData.customer}</p>
            <p><strong>Passenger:</strong> {dummyData.passenger}</p>
            <p><strong>Reporting Address:</strong> {dummyData.reportingAddress}</p>
            <p><strong>Drop Address:</strong> {dummyData.dropAddress}</p>
          </div>
          <div>
            <p><strong>Duty Id:</strong> {dummyData.dutyId}</p>
            <p><strong>Duty Type:</strong> {dummyData.dutyType}</p>
            <p><strong>Vehicle Group:</strong> {dummyData.vehicleGroup}</p>
            <p><strong>Vehicle:</strong> {dummyData.vehicle}</p>
            <p><strong>Driver:</strong> {dummyData.driver}</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>KM</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Start</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>End</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Extra</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>KM</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dummyData.startKm}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dummyData.endKm}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dummyData.totalKm}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dummyData.extraTime}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Time</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dummyData.startTime}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dummyData.endTime}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dummyData.totalTime}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dummyData.extraTime}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '20px' }}>
          <p><strong>Additional Charges:</strong></p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Charges</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Toll & Parking</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dummyData.tollParkingCharge}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: '20px' }}>Customer signature not available.</p>
        <p>Customer Feedback (via Feedback Form) <button style={{ color: '#007bff', border: 'none', background: 'none', cursor: 'pointer' }}>Show Feedback</button></p>
      </div>
    </div>
  );
};

export default DutySlip;