import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";



export const downloadPDF = () => {
    const element = document.getElementById("trip-sheet");

    // Options for pdf creation
    const options = {
        margin:       0.5,
        filename:     "trip-sheet.pdf",
        image:        { type: "jpeg", quality: 1 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf(element, options);
};
const TripSheetPDF = ({ selectedTrip,formattedDate}) => {
    

    const [driverSignature, setDriverSignature] = useState('');
    const [guestSignature, setGuestSignature] = useState('');
    const imageUrl = "http://localhost:3000/api/get-signature/";

    const convertImageToBase64 = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("Error converting image:", error);
            return '';
        }
    };

    const loadBase64Images = async () => {
        try {
            const driverUrl = `${imageUrl}${selectedTrip.driver_url}`;
            const guestUrl = `${imageUrl}${selectedTrip.guest_url}`;
            
            const driverSig = await convertImageToBase64(driverUrl);
            const guestSig = await convertImageToBase64(guestUrl);
            
            setDriverSignature(driverSig);
            setGuestSignature(guestSig);
        } catch (error) {
            console.error("Error loading images:", error);
        }
    };

    useEffect(() => {
        if (selectedTrip) {
            loadBase64Images();
        }
    }, [selectedTrip]);
    
    return (
        <div>
            <div id="trip-sheet" className="trip-sheet mt-4">
                <div className="container mx-auto p-8">
                    <div className="row w-full border-2">
                        <div className="flex w-full">
                            <div className="flex items-center justify-center">
                                <img src="../MLt.jpeg" alt="Company Logo" className="w-[100px]" />
                            </div>
                            <div className="pr-1 border-r-1 w-[300px]">
                                <div className="text-center">
                                    <strong className="text-2xl block font-roboto">MLT</strong>
                                    <strong className="text-md block">Corporate Solutions Private Limited</strong>
                                    <p className="text-[13px] pb-2">
                                        #7, Old No. 15/1, 80ft Road, 2nd Phase, Girinagar, Bengaluru - 560 085. <br />
                                        Mob: 9900737072, 9900731202, Ph: 080-35866184
                                        E-mail: info@mltcorporate.com, Website: www.mltcorporate.com
                                    </p>
                                </div>
                            </div>
                            <div className="w-[250px] flex flex-col pb-1">
                                <span className="mr-2 pl-1 font-bold">M/s :<span className="text-sm font-normal">{"hchgfcghg chghgchchhhdk jhbjhsjndjnkdsjn dkjdskjdskjsdkjksdj"}</span> </span>
                                <span className="mr-2 pl-1 font-bold">Reporting :<span className="text-sm font-normal">{selectedTrip.reportingTime}</span> </span>
                                <span className="mr-2 pl-1 font-bold">Booked By :<span className="text-sm font-normal">{"hchgfcghg chghgchchhhdk jhbjhsjndj nkdsjn dkjdskjdskjsdkjksdj"}</span> </span>
                            </div>
                        </div>
                    </div>

                    <table className="table border-collapse w-full" style={{ border: "1px solid black",  }}>
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Log Sheet No.</th>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Vehicle Type</th>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Vehicle No.</th>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Driver's Name</th>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Particulars</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid black", padding: "5px" }}>{selectedTrip.id}</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>{selectedTrip.vehicleType}</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>{selectedTrip.vehicleNo}</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>{selectedTrip.drivername}</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>{selectedTrip.vehicleType}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className="table" style={{ border: "1px solid black", borderCollapse: "collapse",  }}>
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Date</th>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Opening Kms</th>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Opening Hrs</th>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Closing Kms</th>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Closing Hrs</th>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Total Kms</th>
                                <th style={{ border: "1px solid black", padding: "5px" }}>Guest Signature</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid black", padding: "5px" }}>{formattedDate}</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>Value 1</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>Value 1</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>Value 1</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>Value 1</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>Value 1</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>Value 1</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid black", padding: "5px" }}>&nbsp;</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>&nbsp;</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>&nbsp;</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>&nbsp;</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>&nbsp;</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>&nbsp;</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className=" flex  grid-cols-1 justify-between mt-3 pt-2">

                    <div className=" ">
                    <div className="">
                    <img src={driverSignature} id="driver-signature" alt="Driver Signature"  className="w-full" />

                            </div>
                            <h1 className="mt-2 ">Driver Signature</h1>
                    </div>
                    <div className="">
                    <div className="">
                    <img src={guestSignature} id="guest-signature" alt="Guest Signature" className="w-full" />

                            </div>
                        <h1>Guest Signature</h1>
                    </div>
                    </div>
                    
                </div>

               
            </div>
            {/* <button onClick={downloadPDF} className="btn btn-primary mt-3">Download PDF</button> */}
        </div>
    );
};

export default TripSheetPDF;





