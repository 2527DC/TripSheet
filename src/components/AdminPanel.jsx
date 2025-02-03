import React, { useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [generatedLink, setGeneratedLink] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const generateLink = async () => {
    const res = await axios.post("http://localhost:3000/generate-link", formData);
    setGeneratedLink(res.data.link);
  };

  return (
    <div>
      <h2>Generate Form</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <button onClick={generateLink}>Generate Link</button>
      {generatedLink && <p>Share this link: <a href={generatedLink}>{generatedLink}</a></p>}
    </div>
  );
};

export default AdminPanel;
