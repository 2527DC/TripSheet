import React, { forwardRef, useEffect } from 'react';
import { imageUrl } from '../Api/API_Client';

const DutySlip = forwardRef(({ dutyData }, ref) => {
  // Default if no data is provided
  if (!dutyData || !dutyData.id) {
    return <p ref={ref}>No duty slip data available.</p>;
  }

  // Safely format the date
  const dateObj = new Date(dutyData.date);
  const formattedDate = isNaN(dateObj.getTime())
    ? 'Invalid Date'
    : dateObj.toLocaleDateString('en-GB');

  // Construct guest signature URL
  const url = dutyData.guest_url ? `${imageUrl}${dutyData.guest_url}` : '';

  // Rating labels
  const ratingLabels = {
    0: 'Please select a rating',
    1: 'Very Unsatisfied',
    2: 'Unsatisfied',
    3: 'Neutral',
    4: 'Satisfied',
    5: 'Very Satisfied', 
  };

  // Safely access dutyData fields with fallbacks
  const {
    id = '',
    closingDate='',
    driverName = '',
    vehicleNo = '',
    vehicleType = '',
    reportingTime = '',
    customer = '',
    category = '',
    customerPh = '',
    reportingAddress = '',
    dropAddress = '',
    status = '',
    toolCharges = '0',
    parkingCharges = '0',
    review = 0,
    closeHr = '',
    openKm = '0',
    closeKm = '0',
    totalKm = '0',
    totalHr = '',
    acType = '',
    driverPh = '',
    reportingDate='',
    passenger = customer, // Fallback to customer if passenger is undefined
  } = dutyData;

  const start = new Date(reportingDate);
const end = new Date(closingDate);

// Get absolute difference in milliseconds
const diffTime = Math.abs(end - start);

// Convert milliseconds to full days
const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

console.log("Total Days:", totalDays);
  // Debug ref attachment
  useEffect(() => {
    if (ref && ref.current) {
      console.log('DutySlip ref attached:', ref.current);
    } else {
      console.warn('DutySlip ref not attached yet');
    }
  }, [ref]);

  return (
    <div
      id="duty-slip"
      ref={ref}
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
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            #duty-slip {
              width: 210mm;
              min-height: 148mm;
              margin: 0;
              padding: 5mm;
              border: none; /* Remove border for print if desired */
            }
          }
        `}
      </style>

      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '5mm',
          borderBottom: '1px solid #000',
          paddingBottom: '5mm',
        }}
      >
        <img
          src="/MLt.jpeg"
          alt="MLT Logo"
          style={{
            width: '150px',
            height: '60px',
            marginRight: '5px',
          }}
          onError={(e) => {
            console.error('Failed to load logo');
            e.target.style.display = 'none'; // Hide broken image
          }}
        />
        <div style={{ flexGrow: 1 }}>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '2px 0',
              lineHeight: '1.2',
            }}
          >
            MLT Corporate Solutions Private Limited
          </h1>
          <div style={{ fontSize: '10px', lineHeight: '1.3' }}>
            <p style={{ margin: '2px 0' }}>
              #766, Ground floor, 1st main road, Girinagar 2nd phase, 6th block,
              BSK 3rd stage,
            </p>
            <p style={{ margin: '2px 0' }}>Bengaluru - 560085</p>
            <p style={{ margin: '2px 0' }}>
              Ph: 9035354198 / 99 (24/7), 9980357272, 9686375747
            </p>
            <p style={{ margin: '2px 0' }}>
              Email: reservation@mitcorporate.com / info@mitcorporate.com
            </p>
            <p style={{ margin: '2px 0' }}>
              Web: www.mltcorporatesolutions.com
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
              textAlign: 'right',
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: '6px', fontWeight: 'bold' }}>Status</td>
                <td style={{ padding: '6px' }}>{status}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px', fontWeight: 'bold' }}>Duty ID</td>
                <td style={{ padding: '6px' }}>{id}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px', fontWeight: 'bold' }}>Date</td>
                <td style={{ padding: '6px' }}>{formattedDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Duty Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '5mm',
          marginBottom: '5mm',
        }}
      >
        <div>
          <p style={{ margin: '2px 0' }}>
            <strong>Reporting Time:</strong> {reportingTime}
          </p>
          <p style={{ margin: '2px 0' }}>
            <strong>Company:</strong> {customer}
          </p>
          <p style={{ margin: '2px 0' }}>
            <strong>Passenger:</strong> {passenger} ({customerPh})
          </p>
          <p style={{ margin: '2px 0' }}>
            <strong>Reporting Address:</strong> {reportingAddress}
          </p>
          <p style={{ margin: '2px 0' }}>
            <strong>Drop:</strong> {dropAddress}
          </p>
        </div>
        <div>
          <p style={{ margin: '2px 0' }}>
            <strong>Category:</strong> {category}
          </p>
          <p style={{ margin: '2px 0' }}>
            <strong>Vehicle:</strong> {vehicleNo} ({vehicleType})
          </p>
          <p style={{ margin: '2px 0' }}>
            <strong>Vehicle Type:</strong> {vehicleType}
          </p>
          <p style={{ margin: '2px 0' }}>
            <strong>Driver:</strong> {driverName} ({driverPh})
          </p>
          <p style={{ margin: '2px 0' }}>
            <strong>AC Type:</strong> {acType}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '5mm',
          marginBottom: '5mm',
        }}
      >
        <div>
          {/* KM and Hours Table */}
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                    background: '#f0f0f0',
                    width: '25%',
                  }}
                ></th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                    background: '#f0f0f0',
                    width: '25%',
                  }}
                >
                  Open
                </th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                    background: '#f0f0f0',
                    width: '25%',
                  }}
                >
                  Close
                </th>
                <th
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                    background: '#f0f0f0',
                    width: '25%',
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
            <tr>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  Date
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {reportingDate}
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {closingDate}
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {totalDays}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  KM
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {openKm}
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {closeKm}
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {totalKm}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  Hr
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {reportingTime}
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {closeHr}
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {totalHr}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Additional Charges Table */}
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              marginBottom: '3mm',
              marginTop: '10px',
            }}
          >
            <thead>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    border: '1px solid #000',
                    padding: '3px',
                    background: '#f0f0f0',
                  }}
                >
                  Additional Charges
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  Toll
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {toolCharges}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  Parking
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {parkingCharges}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <div style={{ textAlign: 'center' }}>
            {url && (
              <img
                src={url}
                alt="Guest Signature"
                style={{
                  maxWidth: '220px',
                  height: 'auto',
                }}
                onError={(e) => {
                  console.error('Failed to load guest signature');
                  e.target.style.display = 'none'; // Hide broken image
                }}
              />
            )}
            <p style={{ fontSize: '16px' }}>
              <strong>Guest Signature:</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '3mm',
          fontSize: '10px',
        }}
      >
        <div>
          <p style={{ margin: '2px 0' }}>
            <strong>Customer Feedback </strong> {ratingLabels[parseInt(review) || 0]}
          </p>
        </div>
      </div>
    </div>
  );
});

export default DutySlip;