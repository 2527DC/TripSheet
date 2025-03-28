import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Function to format date as "DD-MM-YYYY"
const formatDate = (isoDate) => {
  if (!isoDate) return ""; // Handle null/undefined dates

  const dateObj = new Date(isoDate);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`; // Output: "18-02-2025"
};

const handleDownloadExcel = (data) => {
  console.log("Download Excel clicked",data);

  // Define custom headers
  const customHeaders = [
    "TripID",
    "Date",
    "Status",
    "Vendor Name",
    "Customer",
    "Driver Name",
    "Vehicle Number",
    "Vehicle Type",
    "Passenger Name",
    "Passenger Phone",
    "Reporting Address",
    "Drop Address",
    "Category",
    "AC Type",
    "Reporting Time",
    "Open Km",
    "Close Km",
    "Total Km",
    "Open Hr",
    "Close Hr",
    "Closeing Date",
    "Total Hr",
    "Extar Km",
    "Extar Hm",
    "Parking Charges",
    "Toll Charges",

  ];

  // Transform data to match the headers, with formatted date
  const formattedData = data.map((item) => [
    item.id,
    formatDate(item.createdAt), // Convert date here
    item.status,
    item.vendorName,
    item.company,
    item.driverName,
    item.vehicleNo,
    item.vehicleType,
    item.customer,
    item.customerPh,
    item.reportingAddress,
    item.dropAddress,
    item.category,
    item.acType,
    item.reportingTime,
    item.openKm,
    item.closeKm,
    item.totalKm,
    item.openHr,
    item.closeHr,
    item.closingDate,
    item.totalHr,
    item.extraKm,
    item.extraHr,
    item.parkingCharges===null?"NaN":item.parkingCharges,
    item.toolCharges,
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
