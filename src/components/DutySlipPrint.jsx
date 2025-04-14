import React from 'react';
import { imageUrl } from '../Api/API_Client';

const DutySlipPrint = ({ dutyData }) => {
    const {
        id,
        status = 'Completed',
        formattedDate = new Date().toLocaleDateString(),
        reportingTime,
        customer,
        passenger,
        customerPh,
        reportingAddress,
        dropAddress,
        category,
        vehicleNo,
        vehicleType,
        driverName,
        driverPh,
        acType,
        openKm,
        closeKm,
        totalKm,
        closeHr,
        totalHr,
        toolCharges,
        parkingCharges,
        guest_url,
        review = '5',
    } = dutyData || {};
    const url = `${imageUrl}${guest_url}`
    const ratingLabels = {
        0: 'No Rating',
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent',
    };
    
    return (
        <div style={{ 
            width: '100%', 
            maxHeight: '100vh', 
            overflow: 'hidden',
            border: '1px solid #000',
            padding: '10px',
            boxSizing: 'border-box'
        }}>
            
            {/* Header */}
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
                    style={{ width: '150px', height: '60px', marginRight: '5px' }}
                />
                <div style={{ flexGrow: 1 }}>
                    <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '2px 0', lineHeight: '1.2' }}>
                        MLT Corporate Solutions Private Limited
                    </h1>
                    <div style={{ fontSize: '10px', lineHeight: '1.3' }}>
                        <p>#766, Ground floor, 1st main road, Girinagar 2nd phase, 6th block, BSK 3rd stage,</p>
                        <p>Bengaluru - 560085</p>
                        <p>Ph: 9035354198 / 99 (24/7), 9980357272, 9686375747</p>
                        <p>Email: reservation@mitcorporate.com / info@mitcorporate.com</p>
                        <p>Web: www.mltcorporatesolutions.com</p>
                    </div>
                </div>
                <table style={{ 
                    fontSize: '12px', 
                    textAlign: 'right',
                    borderCollapse: 'separate',
                    borderSpacing: '2px'
                }}>
                    <tbody>
                        <tr><td><strong>Status:</strong></td><td>{status}</td></tr>
                        <tr><td><strong>Duty ID:</strong></td><td>{id}</td></tr>
                        <tr><td><strong>Date:</strong></td><td>{formattedDate}</td></tr>
                    </tbody>
                </table>
            </div>

            {/* Duty Details */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '5mm', 
                marginBottom: '5mm' 
            }}>
                <div>
                    <p><strong>Reporting Time:</strong> {reportingTime}</p>
                    <p><strong>Company:</strong> {customer}</p>
                    <p><strong>Passenger:</strong> {passenger} ({customerPh})</p>
                    <p><strong>Reporting Address:</strong> {reportingAddress}</p>
                    <p><strong>Drop:</strong> {dropAddress}</p>
                </div>
                <div>
                    <p><strong>Category:</strong> {category}</p>
                    <p><strong>Vehicle:</strong> {vehicleNo} ({vehicleType})</p>
                    <p><strong>Vehicle Type:</strong> {vehicleType}</p>
                    <p><strong>Driver:</strong> {driverName} ({driverPh})</p>
                    <p><strong>AC Type:</strong> {acType}</p>
                </div>
            </div>

            {/* KM & Time */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr', 
                gap: '5mm', 
                marginBottom: '5mm' 
            }}>
                <div>
                    <table style={{ 
                        borderCollapse: 'collapse', 
                        width: '100%',
                        border: '1px solid #000'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #000', padding: '4px' }}></th>
                                <th style={{ border: '1px solid #000', padding: '4px' }}>Open</th>
                                <th style={{ border: '1px solid #000', padding: '4px' }}>Close</th>
                                <th style={{ border: '1px solid #000', padding: '4px' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>KM</td>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>{openKm}</td>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>{closeKm}</td>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>{totalKm}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>Hr</td>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>{reportingTime}</td>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>{closeHr}</td>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>{totalHr}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table style={{ 
                        marginTop: '10px', 
                        borderCollapse: 'collapse', 
                        width: '100%',
                        border: '1px solid #000'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #000', padding: '4px' }} colSpan={2}>Additional Charges</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>Toll</td>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>{toolCharges}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>Parking</td>
                                <td style={{ border: '1px solid #000', padding: '4px' }}>{parkingCharges}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <img
                        src={url}
                        alt="Guest Signature"
                        style={{ maxWidth: '220px', height: 'auto' }}
                    />
                    <p><strong>Guest Signature</strong></p>
                </div>
            </div>

            {/* Footer */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '10px',
                borderTop: '1px solid #000',
                paddingTop: '5mm'
            }}>
                <div>
                    <p><strong>Customer Feedback:</strong> {ratingLabels[parseInt(review) || 0]}</p>
                </div>
            </div>
        </div>
    );
};

export default DutySlipPrint;