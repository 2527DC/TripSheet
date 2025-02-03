import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";

const FormComponent = ({ prefilledData, formId }) => {
  const [formData, setFormData] = useState({
    name: prefilledData.name || "",
    email: prefilledData.email || "",
    age: "", // User will fill this
    signature: null,
  });

  const sigCanvas = useRef(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Clear signature
  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  // Save Signature
  const saveSignature = () => {
    setFormData({ ...formData, signature: sigCanvas.current.toDataURL() });
  };

  // Submit form
  const handleSubmit = async () => {
    await axios.post("http://localhost:3000/submit-form", {
      formId,
      ...formData,
    });
    alert("Form Submitted!");
  };

  return (
    <div>
      <h2>Form</h2>
      <label>Name:</label>
      <input type="text" value={formData.name} disabled />

      <label>Email:</label>
      <input type="email" value={formData.email} disabled />

      <label>Age:</label>
      <input type="text" name="age" value={formData.age} onChange={handleChange} />

      <h3>Signature</h3>
      <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ width: 300, height: 100, className: "signatureCanvas" }} />
      <button onClick={clearSignature}>Clear</button>
      <button onClick={saveSignature}>Save Signature</button>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FormComponent;
