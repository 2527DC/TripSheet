import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const handleDownloadExcel = (data) => {
  console.log("Download Excel clicked");

  // Define custom headers
  const customHeaders = [
    "Driver Name", 
    "Vehicle Number", 
    "Customer Name", 
    "Customer Phone", 
    "Reporting Address", 
    "Drop Address", 
    "AC Type", 
    "Booking Status", 
    "Company", 
    "Vendor Name", 
    "Reporting Time"
  ];

  // Transform data to match the headers
  const formattedData = data.map((item) => [
    item.drivername,
    item.vehicleNo,
    item.customer,
    item.customerPh,
    item.reportingAddress,
    item.dropAddress,
    item.acType,
    item.status,
    item.company,
    item.vendorName,
    item.reportingTime
  ]);

  // Create worksheet and add custom headers
  const ws = XLSX.utils.aoa_to_sheet([customHeaders, ...formattedData]);

  // Create workbook and append worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Trigger download
  saveAs(dataBlob, "FilteredData.xlsx");
};

export default handleDownloadExcel;
