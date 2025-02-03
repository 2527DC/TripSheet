import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";

export default function FormBuilder() {
  const [formData, setFormData] = useState({
    name: "John Doe",  // Pre-filled
    email: "john@example.com", // Pre-filled
    address: "", // User will fill this
    phone: "" // User will fill this
  });
  const [generatedLink, setGeneratedLink] = useState(null);
  const sigPad = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateForm = async () => {
    const response = await axios.post("http://localhost:3000/api/generate-form", formData);
    setGeneratedLink(response.data.link);
  };

  return (
    <div>
      <h2>Fill Form</h2>
      <input type="text" name="name" value={formData.name} readOnly />
      <input type="email" name="email" value={formData.email} readOnly />
      <input type="text" name="address" value={formData.address} onChange={handleChange} />
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

      <SignatureCanvas ref={sigPad} penColor="black" canvasProps={{ width: 300, height: 100 }} />
      
      <button onClick={generateForm}>Generate Link</button>

      {generatedLink && <p>Share this link: <a href={generatedLink}>{generatedLink}</a></p>}
    </div>
  );
}
