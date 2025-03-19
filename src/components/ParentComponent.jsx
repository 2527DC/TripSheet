import React, { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import DutySlip from './DutySlip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generatePDF = (callback) => {
  const input = document.getElementById('duty-slip');

  if (!input) {
    console.error('Element with id "duty-slip" not found');
    return;
  }

  // Temporarily hide elements that should not be in the PDF
  const noPrintElements = document.querySelectorAll('.no-print');
  noPrintElements.forEach(el => el.style.display = 'none');

  html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
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

    // Restore visibility of the hidden elements after PDF generation
    noPrintElements.forEach(el => el.style.display = '');

    if (callback) callback(); // Notify that PDF generation is complete
  }).catch((error) => {
    console.error('Error generating PDF:', error);
    if (callback) callback(error);
  });
};

const ParentComponent = () => {
  const [isDutySlipVisible, setIsDutySlipVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const dutySlipRef = useRef(null);

  // Dummy trip data (replace with actual data)
  const trip = {
    reportingTime: '04:45',
    customer: 'Walk-in',
    customerPh: '91 97442 55513',
    driverName: 'Muzahid Pasha',
    acType: 'Yes',
    guest_url: '/path-to-guest-image.jpg', // Replace with actual image URL
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleDownload = () => {
    setIsDutySlipVisible(true); // Show DutySlip to generate PDF
    setIsImageLoaded(false); // Reset image load state

    // Wait for the image to load before generating the PDF
    const checkImageLoaded = setInterval(() => {
      if (isImageLoaded) {
        clearInterval(checkImageLoaded);
        generatePDF(() => {
          setIsDutySlipVisible(false); // Hide DutySlip after generation
        });
      }
    }, 100);
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download size={18} />
        Download PDF
      </button>

      {isDutySlipVisible && (
        <div ref={dutySlipRef} style={{ position: 'absolute', left: '-9999px' }}>
          <DutySlip data={trip} onImageLoad={handleImageLoad} />
        </div>
      )}
    </div>
  );
};

export default ParentComponent;