import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LocalClient } from '../Api/API_Client';
import { AlertCircle, Globe, Mail, MapPin, Phone } from 'lucide-react';

const DriverView = () => {
  // State and hook declarations (unchanged)
  const [tripDetails, setTripDetails] = useState(null);
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const tripId = queryParams.get('formId');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const guestSignatureRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [data, setFormData] = useState({
    closeKm: "",
    closeHr: "",
    formId: tripId,
    totalHr: "",
    toolCharges: null,
    parkingCharges: null,
  });
  const [guestSignature, setGuestSignature] = useState(null);
  const [openKm, setOpenKm] = useState(null);
  const [rating, setRating] = useState(0);
  const openKmRef = useRef(null);
  const [view, setView] = useState(false);

  // Signature handling (unchanged)
  const handleSaveGuestSignature = async (e) => {
    e.preventDefault();
    if (guestSignatureRef.current.isEmpty()) {
      toast.warning("Please provide a signature before saving.");
      return false;
    }

    const signatureDataURL = guestSignatureRef.current.toDataURL();
    setGuestSignature(signatureDataURL);

    try {
      const response = await LocalClient.patch("/updateGuestSignature", {
        tripId,
        Guestsignature: signatureDataURL,
      });

      if (response.data.success) {
        toast.success("Guest signature saved successfully.");
        return signatureDataURL;
      } else {
        toast.error(response.data.message || "Failed to save guest signature.");
        return false;
      }
    } catch (error) {
      console.error("Error while saving guest signature:", error);
      toast.error("An error occurred while saving the signature.");
      return false;
    } finally {
      setShowGuestModal(false);
    }
  };

  // Fetch trip details (unchanged)
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (tripId) {
        try {
          const response = await LocalClient.get(`/form/${tripId}`);
          if (response.status === 200) {
            setSubmitted(response.data.data.submitted);
            setVisible(true);
            setTripDetails(response.data.data);
            console.log("Driver View data:", response.data.data);
            if (response.data.data.openKm != null) {
              setView(true);
            }
            if (response.data.data.guest_url != null) {
              setGuestSignature(response.data.data.guest_url);
            }
          }
        } catch (error) {
          console.error('Error fetching trip details:', error);
        }
      }
    };
    fetchTripDetails();
  }, [tripId]);

  // Input change handler (unchanged)
  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;
    let newValue = value;

    if (["openKm", "closeKm", "toolCharges", "parkingCharges"].includes(name)) {
      newValue = Number(value);
      if (newValue < 0 || isNaN(newValue)) newValue = 0;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? (files && files[0]) : newValue,
    }));
  };

  // Calculate trip metrics (unchanged)
  function calculateTripMetrics(openDateTime, closeDateTime) {
    const effectiveOpenKm = openKm ?? tripDetails?.openKm;
    const totalKm = data.closeKm - effectiveOpenKm;

    console.log(`Closing KM: ${data.closeKm}, Open KM: ${openKm}, Total: ${totalKm}`);

    const diffMs = closeDateTime - openDateTime;
    if (diffMs < 0) return null;

    const totalHr = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { totalKm, totalHr, totalMin };
  }

  // Form validation (unchanged)
  const validateForm = () => {
    console.log("Validating the form...");
    const requiredFields = ["closeKm", "closeHr", "closeDate"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      toast.warning("Please fill all required fields");
      return false;
    }

    if (!guestSignature) {
      toast.warning("Guest signature is required");
      return false;
    }

    const enteredOpenKm = parseInt(openKmRef.current?.value, 10);
    const effectiveOpenKm = isNaN(enteredOpenKm) ? tripDetails?.openKm : enteredOpenKm;

    if (data.closeKm < effectiveOpenKm) {
      toast.warning("Closing Km must be greater than Opening Km");
      return false;
    }

    const openDateTime = new Date(`${tripDetails?.reportingDate}T${tripDetails?.reportingTime}:00`);
    const closeDateTime = new Date(`${data.closeDate}T${data.closeHr}:00`);

    if (closeDateTime < openDateTime) {
      if (data.closeDate < tripDetails?.reportingDate) {
        toast.warning("Closing Date cannot be before Reporting Date");
      } else {
        toast.warning("Closing Time cannot be before Reporting Time");
      }
      return false;
    }

    const result = calculateTripMetrics(openDateTime, closeDateTime);
    if (!result || result.totalHr < 0) {
      toast.warning("Closing time must be later than reporting time");
      return false;
    }

    console.log(`Total KM: ${result.totalKm}`);
    console.log(`Total HR: ${result.totalHr}:${result.totalMin} hours`);
    return true;
  };

  // Form submission (unchanged)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Final submit method invoked");
    const { categoryRel } = tripDetails;
    console.log("Category for extra hr and KM:", categoryRel.KM, categoryRel.hours);

    const formData = {
      ...data,
      categoryHr: categoryRel.hours,
      categoryKm: categoryRel.KM,
    };

    console.log("Data being sent:", formData);

    try {
      const response = await LocalClient.patch("addtripsheet", formData);
      console.log("Server response:", response.data);

      if (response.status === 200) {
        toast.success("Submitted successfully!");
        setFormData({
          closeKm: "",
          closeHr: "",
          toolCharges: "",
          closeDate: "",
          parkingCharges: "",
        });
        setGuestSignature(null);
        setRating(0);
      }
    } catch (error) {
      if (error.status === 400) {
        toast.error("Form has been submitted already");
      } else {
        toast.error("Submission failed!");
      }
    }
  };

  // Rating handler (unchanged)
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setFormData((prevData) => ({
      ...prevData,
      rating: newRating,
    }));
  };

  // Update totalHr (unchanged)
  useEffect(() => {
    if (tripDetails && data.closeHr && data.closeDate) {
      const openDateTime = new Date(`${tripDetails.reportingDate}T${tripDetails.reportingTime}:00`);
      const closeDateTime = new Date(`${data.closeDate}T${data.closeHr}:00`);
      const result = calculateTripMetrics(openDateTime, closeDateTime);
      if (result) {
        setFormData((prevData) => ({
          ...prevData,
          totalHr: `${result.totalHr}:${result.totalMin}`,
          totalKm: parseFloat(result.totalKm) || 0,
        }));
      }
    }
  }, [data.closeHr, data.closeDate, tripDetails]);

  // Start duty handler (unchanged)
  const handleStartDuty = async () => {
    try {
      const kmRaw = openKmRef.current?.value;
      const kmValue = parseInt(kmRaw, 10);

      if (isNaN(kmValue)) {
        toast.error("Please enter a valid KM value.");
        return;
      }

      const response = await LocalClient.patch("/updateOpenKm", {
        tripId,
        kmValue,
      });

      const { success, message, data } = response.data;
      if (success) {
        toast.success("Duty started successfully.");
        setView(true);
        console.log("Updated data:", data);
      } else {
        toast.warning(message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error while starting duty:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error. Please try again later.");
      }
    }
  };

  // Render logic
  if (submitted) {
    return (
      <div className="flex items-center gap-2 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md shadow-sm">
        <AlertCircle size={20} className="text-yellow-500" />
        <span className="font-medium">Already submitted</span>
      </div>
    );
  }

  return (
    <>
      {visible ? (
        <>
          {view ? (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
              <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
                <header className="flex flex-col md:flex-row items-center p-6 border-b border-gray-200">
                  <img src="/MLt.jpeg" alt="MLT Logo" className="w-44 h-24 mb-4 md:mb-0 md:mr-6" />
                  <div className="text-center md:text-left flex-grow">
                    <h1 className="text-2xl font-bold text-gray-800">
                      MLT Corporate Solutions Private Limited
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-700" />
                      #766, Ground floor, 1st main road, Girinagar 2nd phase, 6th block, BSK 3rd stage,
                    </p>
                    <p className="text-gray-600">Bengaluru - 560085</p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-700" />
                      9035354198 / 99 (24/7), 9980357272, 9686375747
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-700" />
                      reservation@mitcorporate.com / info@mitcorporate.com
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-gray-700" />
                      <a
                        href="https://www.mltcorporatesolutions.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        www.mltcorporatesolutions.com
                      </a>
                    </p>
                  </div>
                </header>

                <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Booking Details</h2>
                  <div className="space-y-4">
                    <strong>MLT Corporate Solutions Private Limited</strong> <br />
                    <strong>Reporting: {tripDetails.reportingTime}</strong><br />
                    <strong>BookedBy: {tripDetails.customer}</strong><br />
                    <strong>Driver Name: {tripDetails.driverName}</strong><br />
                    <strong>Vehicle Type: {tripDetails.vehicleType}</strong><br />
                    <strong>Vehicle No: {tripDetails.vehicleNo}</strong> <br />
                  </div>
                </div>

                <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Passenger Details</h2>
                  <div className="space-y-4">
                    <strong>Passenger Name: {tripDetails.customer}</strong> <br />
                    <strong>Passenger PhNo: {tripDetails.customerPh}</strong> <br />
                    <strong>Reporting Address: {tripDetails.reportingAddress}</strong> <br />
                    <strong>Dropping Address: {tripDetails.dropAddress}</strong> <br />
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Timing Details</h2>
                      <div className="space-y-6">
                        <div className="p-4 space-y-6">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-4">Closing</h3>
                            <div className="space-y-4">
                              <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <label className="w-32 font-medium text-gray-700">KM:</label>
                                <input
                                  name="closeKm"
                                  type="number"
                                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={data.closeKm}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <label className="w-32 font-medium text-gray-700">Date:</label>
                                <input
                                  name="closeDate"
                                  type="date"
                                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={data.closeDate}
                                  onChange={handleInputChange}
                                  min={today}
                                />
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <label className="w-32 font-medium text-gray-700">Hours:</label>
                                <input
                                  name="closeHr"
                                  type="time"
                                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={data.closeHr}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                          <label className="w-32 font-medium text-gray-700">Toll Charges:</label>
                          <input
                            name="toolCharges"
                            type="number"
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.toolCharges || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                          <label className="w-32 font-medium text-gray-700">Parking Charges:</label>
                          <input
                            name="parkingCharges"
                            type="number"
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.parkingCharges || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold mb-4">Signatures</h2>
                      <div className="space-y-4">
                        <div className="border p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Guest Signature</h3>
                          {guestSignature ? (
                            <div className="mb-2">
                              <img
                                src={
                                  tripDetails.guest_url != null
                                    ? `http://localhost:3000/api/get-signature/${guestSignature}`
                                    : guestSignature
                                }
                                alt="Guest Signature"
                                className="h-20 border"
                              />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowGuestModal(true)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                              Add Guest Signature
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {showGuestModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
                          <h2 className="text-xl font-semibold mb-4">Guest Signature</h2>
                          <div className="border border-gray-300 rounded-lg bg-gray-100 mb-4">
                            <SignaturePad
                              ref={guestSignatureRef}
                              canvasProps={{ className: 'w-full', style: { height: '200px' } }}
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => guestSignatureRef.current.clear()}
                              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveGuestSignature}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                              Save Signature
                            </button>
                            <button
                              onClick={() => setShowGuestModal(false)}
                              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                              Back to Form
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold mb-4">Feedback Rating</h2>
                      <div className="flex flex-col items-center space-y-4">
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingChange(star)}
                              className={`text-3xl ${
                                star <= rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">
                          {rating === 1 && "Very Unsatisfied"}
                          {rating === 2 && "Unsatisfied"}
                          {rating === 3 && "Neutral"}
                          {rating === 4 && "Satisfied"}
                          {rating === 5 && "Very Satisfied"}
                          {rating === 0 && "Please select a rating"}
                        </div>
                      </div>
                    </div>

                    <div className="p-2 flex justify-center items-center">
                      <button
                        type="submit"
                        className="text-xl bg-green-600 p-2 rounded items-center"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Opening Details</h3>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Date:</label>
                    <input
                      type="date"
                      className="rounded-md border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-600"
                      value={tripDetails?.reportingDate || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Hours:</label>
                    <input
                      name="openHr"
                      type="time"
                      className="rounded-md border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-600"
                      value={tripDetails?.reportingTime}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">KM:</label>
                    <input
                      name="openKm"
                      type="number"
                      ref={openKmRef}
                      onChange={(e) => setOpenKm(e.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter KM"
                    />
                  </div>
                </div>
                <button
                  onClick={handleStartDuty}
                  className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Start Duty
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-xl font-semibold text-gray-700">Loading...</h1>
        </div>
      )}
    </>
  );
};

export default DriverView;