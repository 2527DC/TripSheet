import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generatePDF } from '../utils/pdfUtils';
import { imageUrl } from '../Api/API_Client';

const DutySlip = () => {


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Extract data from URL parameters
  const dutyData = {
    id: queryParams.get("id"),
    formId: queryParams.get("formId"),
    driverName: queryParams.get("driverName"),
    vehicleNo: queryParams.get("vehicleNo"),
    vehicleType: queryParams.get("vehicleType"),
    reportingTime: queryParams.get("reportingTime"),
    customer: queryParams.get("customer"),
    category: queryParams.get("category"),
    customerPh: queryParams.get("customerPh"),
    reportingAddress: queryParams.get("reportingAddress"),
    dropAddress: queryParams.get("dropAddress"),
    status: queryParams.get("status"),
    toolCharges: queryParams.get("toolCharges"),
    parkingCharges: queryParams.get("parkingCharges"),
    guest_url: queryParams.get("guest_url"),
    review: queryParams.get("review"),
    openHr: queryParams.get("openHr"),
    closeHr: queryParams.get("closeHr"),
    openKm: queryParams.get("openKm"),
    closeKm: queryParams.get("closeKm"),
    totalKm: queryParams.get("totalKm"),
    totalHr: queryParams.get("totalHr"),
    acType: queryParams.get("acType"),
  };

  console.log("Received duty slip data:", dutyData);

  if (!dutyData.id) {
    return <p>No duty slip data available. Please go back and select a report.</p>;
  }

  const url = `${imageUrl}${dutyData.guest_url}`;

  const ratingLabels = {
    0: "Please select a rating",
    1: "Very Unsatisfied",
    2: "Unsatisfied",
    3: "Neutral",
    4: "Satisfied",
    5: "Very Satisfied",
  };

  return (
    <div>
      <style>
        {`
          @media print {
            .no-print {
              display: none;
            }
          }
        `}
      </style>
      <div
        id="duty-slip"
        style={{
          width: '210mm',
          minHeight: '297mm', // A4 height
          margin: '0 auto',
          padding: '10mm',
          fontFamily: 'Arial, sans-serif',
          border: '2px solid #000',
          background: '#fff',
          boxSizing: 'border-box',
        }}
      >
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10mm' }}>
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
              <img src="/MLt.jpeg" alt="MLT Corporate Solutions Logo" style={{ height: '50px', marginRight: '10px' }} />
              <h2>MLT Corporate Solutions</h2>
            </div>
            <span style={{ padding: '2px 5px', borderRadius: '3px' }}>Status: {dutyData.status || 'Completed'}</span>
          </div>
        
          <div style={{ textAlign: 'right' }}>
    
            <div className="no-print">
              <button
                onClick={generatePDF}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Duty Details Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10mm' }}>
          <div style={{ width: '48%' }}>
            <p style={{ margin: '4px 0' }}><strong>Date:</strong> {dutyData.date}</p>
            <p style={{ margin: '4px 0' }}><strong>Reporting Time:</strong> {dutyData.reportingTime}</p>
            <p style={{ margin: '4px 0' }}><strong>Customer Name:</strong> {dutyData.customer}</p>
            <p style={{ margin: '4px 0' }}><strong>Customer Ph:</strong> {dutyData.customerPh}</p>
            <p style={{ margin: '4px 0' }}><strong>Reporting Address:</strong> {dutyData.reportingAddress}</p>
            <p style={{ margin: '4px 0' }}><strong>Drop Address:</strong> {dutyData.dropAddress}</p>
          </div>
          <div style={{ width: '48%' }}>
            <p style={{ margin: '4px 0' }}><strong>Duty Id:</strong> {dutyData.id}</p>
            <p style={{ margin: '4px 0' }}><strong>Category:</strong> {dutyData.category}</p>
            <p style={{ margin: '4px 0' }}><strong>Vehicle Type:</strong> {dutyData.vehicleType}</p>
            <p style={{ margin: '4px 0' }}><strong>Vehicle No:</strong> {dutyData.vehicleNo}</p>
            <p style={{ margin: '4px 0' }}><strong>Driver:</strong> {dutyData.driverName}</p>
            <p style={{ margin: '4px 0' }}><strong>AC Type:</strong> {dutyData.acType}</p>
          </div>
        </div>

        {/* KM and Hours Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10mm' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '8px', background: '#f0f0f0' }}></th>
              <th style={{ border: '1px solid #000', padding: '8px', background: '#f0f0f0' }}>Open</th>
              <th style={{ border: '1px solid #000', padding: '8px', background: '#f0f0f0' }}>Close</th>
              <th style={{ border: '1px solid #000', padding: '8px', background: '#f0f0f0' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '8px' }}>KM</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{dutyData.openKm}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{dutyData.closeKm}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{dutyData.totalKm}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '8px' }}>Hr</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{dutyData.openHr}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{dutyData.closeHr}</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{dutyData.totalHr}</td>
            </tr>
          </tbody>
        </table>

        {/* Additional Charges and Signature */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10mm' }}>
          <div style={{ width: '40%' }}>
            <p style={{ margin: '0 0 10px 0' }}><strong>Additional Charges:</strong></p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #000', padding: '6px', background: '#f0f0f0' }}>Charges</th>
                  <th style={{ border: '1px solid #000', padding: '6px', background: '#f0f0f0' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '6px' }}>Toll</td>
                  <td style={{ border: '1px solid #000', padding: '6px' }}>{dutyData.toolCharges}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '6px' }}>Parking</td>
                  <td style={{ border: '1px solid #000', padding: '6px' }}>{dutyData.parkingCharges}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ width: '50%', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0' }}><strong>Guest Signature:</strong></p>
            <img
              src={url}
              alt="Guest Signature"
              style={{ maxWidth: '300px', height: 'auto', border: '1px solid #000', padding: '5px' }}
            />
          </div>
        </div>

        {/* Review Section */}
        <div style={{ marginTop: '10mm' }}>
          <strong>Review:</strong> {ratingLabels[dutyData.review]}
        </div>
      </div>
    </div>
  );
};

export default DutySlip;