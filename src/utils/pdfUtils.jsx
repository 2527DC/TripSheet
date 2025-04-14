import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
 const generatePDF = (dutyData = {}) => {
  return new Promise((resolve, reject) => {
    const input = document.getElementById('duty-slip');

    if (!input) {
      const error = new Error('Element with id "duty-slip" not found');
      console.error(error.message);
      reject(error);
      return;
    }

    // Configure html2canvas options
    html2canvas(input, {
      scale: 2, // High quality
      useCORS: true, // Handle external images
      allowTaint: true, // Allow cross-origin images
      backgroundColor: '#ffffff', // Match DutySlip background
      logging: false, // Disable in production
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add image to PDF
        if (imgHeight > 297) {
          let yPosition = 0;
          while (yPosition < imgHeight) {
            pdf.addImage(imgData, 'PNG', 0, -yPosition, imgWidth, imgHeight);
            yPosition += 297;
            if (yPosition < imgHeight) pdf.addPage();
          }
        } else {
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        }

        // Generate dynamic file name using dutyData.id or timestamp
        const fileName = dutyData.id
          ? `duty-slip-${dutyData.id}.pdf`
          : `duty-slip-${Date.now()}.pdf`;
        pdf.save(fileName);

        resolve(fileName);
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
        reject(error);
      });
  });
};

export default generatePDF