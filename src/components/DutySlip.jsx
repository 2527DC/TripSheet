import React from 'react';
import { useLocation } from 'react-router-dom';
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
    passenger: queryParams.get("customer"),
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
    date:queryParams.get("createdAt"),
    customer:queryParams.get("company")
  };

  console.log("Received duty slip data:", dutyData);

  if (!dutyData.id) {
    return <p>No duty slip data available. Please go back and select a report.</p>;
  }
  const dateObj = new Date(dutyData.date);

  const formattedDate = dateObj.toLocaleDateString('en-GB');
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
            body {
              margin: 0;
              padding: 0;
            }
          }
        `}
      </style>
      <div
        id="duty-slip"
        style={{
          width: '210mm',
          minHeight: '148mm', // Half A4 height
          margin: '0 auto',
          padding: '5mm',
          fontFamily: 'Arial, sans-serif',
          border: '2px solid #000',
          background: '#fff',
          boxSizing: 'border-box',
          fontSize: '12px',
        }}
      >
        {/* Header Section - Adjusted Layout */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '5mm',
          borderBottom: '1px solid #000',
          paddingBottom: '5mm'
        }}>
          <img
            src="/MLt.jpeg"
            alt="MLT Logo"
            style={{
              width: '150px',
              height: '60px',
              marginRight: '5px',
            }}
          />
          <div style={{ flexGrow: 1 }}>
            <h1 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              margin: '2px 0',
              lineHeight: '1.2'
            }}>
              MLT Corporate Solutions Private Limited
            </h1>
            <div style={{ fontSize: '10px', lineHeight: '1.3' }}>
              <p style={{ margin: '2px 0' }}>
                #766, Ground floor, 1st main road, Girinagar 2nd phase, 6th block, BSK 3rd stage,
              </p>
              <p style={{ margin: '2px 0' }}>Bengaluru - 560085</p>
              <p style={{ margin: '2px 0' }}>Ph: 9035354198 / 99 (24/7), 9980357272, 9686375747</p>
              <p style={{ margin: '2px 0' }}>
                Email: reservation@mitcorporate.com / info@mitcorporate.com
              </p>
              <p style={{ margin: '2px 0' }}>
                Web: www.mltcorporatesolutions.com
              </p>
              {/* www.mltcorporatesolutions.com */}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'right' }}>
  <tbody>
    <tr>
      <td style={{  padding: '6px', fontWeight: 'bold' }}>Status</td>
      <td style={{  padding: '6px' }}>{dutyData.status}</td>
    </tr>
    <tr>
      <td style={{  padding: '6px', fontWeight: 'bold' }}>Duty ID</td>
      <td style={{  padding: '6px' }}>{dutyData.id}</td>
    </tr>
    <tr>
      <td style={{  padding: '6px', fontWeight: 'bold' }}>Date</td>
      <td style={{  padding: '6px' }}>{formattedDate}</td>
    </tr>
  </tbody>
</table>

          </div>
        </div>

        {/* Compact Duty Details */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '5mm',
          marginBottom: '5mm'
        }}>
          <div>
            <p style={{ margin: '2px 0' }}><strong>Reporting Time:</strong> {dutyData.reportingTime}</p>
            <p style={{ margin: '2px 0' }}><strong>Company:</strong> {dutyData.customer}</p>
            <p style={{ margin: '2px 0' }}><strong>Passenger:</strong> {dutyData.passenger} ({dutyData.customerPh})</p>
            <p style={{ margin: '2px 0' }}><strong>Reporting Address:</strong> {dutyData.reportingAddress}</p>
            <p style={{ margin: '2px 0' }}><strong>Drop:</strong> {dutyData.dropAddress}</p>
          </div>
          <div>
            <p style={{ margin: '2px 0' }}><strong>Category:</strong> {dutyData.category}</p>
            <p style={{ margin: '2px 0' }}><strong>Vehicle:</strong> {dutyData.vehicleNo} ({dutyData.vehicleType})</p>
            <p style={{ margin: '2px 0' }}><strong>Vehicle Type:</strong> {dutyData.vehicleType}</p>
            <p style={{ margin: '2px 0' }}><strong>Driver:</strong> {dutyData.driverName}</p>
            <p style={{ margin: '2px 0' }}><strong>AC Type:</strong> {dutyData.acType}</p>
       
          </div>
        </div>

        {/* Compact Table Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr',
          gap: '5mm',
          marginBottom: '5mm'
        }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
  <thead>
    <tr>
      <th style={{ border: '1px solid #000', padding: '5px', textAlign: 'center', background: '#f0f0f0', width: '25%' }}></th>
      <th style={{ border: '1px solid #000', padding: '5px', textAlign: 'center', background: '#f0f0f0', width: '25%' }}>Open</th>
      <th style={{ border: '1px solid #000', padding: '5px', textAlign: 'center', background: '#f0f0f0', width: '25%' }}>Close</th>
      <th style={{ border: '1px solid #000', padding: '5px', textAlign: 'center', background: '#f0f0f0', width: '25%' }}>Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>KM</td>
      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{dutyData.openKm}</td>
      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{dutyData.closeKm}</td>
      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{dutyData.totalKm}</td>
    </tr>
    <tr>
      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>Hr</td>
      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{dutyData.openHr}</td>
      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{dutyData.closeHr}</td>
      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{dutyData.totalHr}</td>
    </tr>
  </tbody>

            <table style={{ borderCollapse: 'collapse', width: '205%', marginBottom: '3mm'  ,marginTop:"10px"}}>
              <thead>
                <tr>
                  <th colSpan="2" style={{ border: '1px solid #000', padding: '3px', background: '#f0f0f0' }}>
                    Additional Charges
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>Toll</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{dutyData.toolCharges}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px' , textAlign: 'center'}}>Parking</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{dutyData.parkingCharges}</td>
                </tr>
              </tbody>
            </table>
          </table>

          <div>
           
            <div style={{ textAlign: 'center' }}>
             
              <img
                src={url}
                alt="Guest Signature"
                style={{ 
                  maxWidth: '220px', 
                  height: 'auto', 
                 
               
                }}
              />
               <p style={{  fontSize: '16px' }}><strong>Guest Signature:</strong></p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '3mm',
          fontSize: '10px'
        }}>
          <div>
            <p style={{ margin: '2px 0' }}><strong>Customer Feedback </strong> {ratingLabels[dutyData.review]}</p>
          </div>
          <div className="no-print">
            <button
              onClick={generatePDF}
              style={{
                padding: '4px 8px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DutySlip;