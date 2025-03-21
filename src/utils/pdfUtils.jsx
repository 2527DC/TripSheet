import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = () => {
  const input = document.getElementById('duty-slip');

  if (!input) {
    console.error('Element with id "duty-slip" not found');
    return;
  }

  // Temporarily hide elements that should not be in the PDF
  const noPrintElements = document.querySelectorAll('.no-print');
  noPrintElements.forEach(el => el.style.display = 'none');

  html2canvas(input, {
    scale: 2, // Higher scale improves quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: 'transparent', // Fix for oklch colors 
    logging: true, // Enable for debugging
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

      // Check if image height exceeds one page
      if (imgHeight > 297) {
        let yPosition = 0;
        while (yPosition < imgHeight) {
          pdf.addImage(imgData, 'PNG', 0, yPosition, imgWidth, imgHeight);
          yPosition += 297; // Move to the next page
          if (yPosition < imgHeight) pdf.addPage();
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      pdf.save('duty_slip.pdf');

      // Restore visibility of hidden elements
      noPrintElements.forEach(el => el.style.display = '');
    })
    .catch((error) => {
      console.error('Error generating PDF:', error);
    });
};
