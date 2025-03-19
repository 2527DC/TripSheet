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
  }).catch((error) => {
    console.error('Error generating PDF:', error);
  });
};