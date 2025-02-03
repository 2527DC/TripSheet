// FormFiller.js
import React, { useState, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import axios from 'axios';

export default function FormFiller({ formId }) {
  const [formData, setFormData] = useState({});
  const [signaturePad, setSignaturePad] = useState(null);
  const [values, setValues] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      const response = await axios.get(`http://localhost:3000/forms/${formId}`);
      setFormData(response.data);
      setValues(response.data.prefilled || {});
    };
    fetchForm();
  }, [formId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signature = signaturePad.getTrimmedCanvas().toDataURL('image/png');
    
    await axios.post(`http://localhost:3000/submit/${formId}`, {
      ...values,
      signature
    });
    alert('Form submitted successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      {formData.fields?.map((field, index) => (
        <div key={index}>
          <label>{field.label}</label>
          <input
            value={values[field.name] || ''}
            onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
            readOnly={field.prefill}
          />
        </div>
      ))}

      <div style={{ border: '1px solid black' }}>
        <SignaturePad
          penColor="black"
          canvasProps={{ width: 500, height: 200 }}
          ref={(ref) => setSignaturePad(ref)}
        />
      </div>
      <button type="button" onClick={() => signaturePad.clear()}>
        Clear Signature
      </button>
      <button type="submit">Submit Form</button>
    </form>
  );
}