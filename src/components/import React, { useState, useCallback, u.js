import React, { useState, useCallback, useMemo } from 'react';

// Modal Component (Reusable)
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// InputField Component (Cross-Platform Optimized)
export const InputField = ({ label, type, option, ...props }) => {
  const handleKeyDown = (e) => {
    if (type === "tel") {
      // Allow: backspace, delete, tab, escape, enter, arrows, home, end
      if ([
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
      ].includes(e.key)) {
        return;
      }

      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X (Windows/Linux)
      // Allow: Cmd+A, Cmd+C, Cmd+V, Cmd+X (Mac)
      if (
        (e.ctrlKey || e.metaKey) && 
        ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())
      ) {
        return;
      }

      // Block any non-numeric input
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  const handlePaste = (e) => {
    if (type === "tel") {
      const pasteData = e.clipboardData.getData('text/plain');
      if (!/^\d*$/.test(pasteData)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {type === "select" ? (
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          {...props}
        >
          <option value="" disabled>
            Select an option
          </option>
          {option?.map((opt, index) => (
            <option key={index} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          type={type}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          maxLength={type === "tel" ? 10 : undefined}
          pattern={type === "tel" ? "[0-9]{10}" : undefined}
          inputMode={type === "tel" ? "numeric" : "text"}
          {...props}
        />
      )}
    </div>
  );
};

// Main Customer Form Component
const CustomerForm = () => {
  const [createCustomer, setCreateCustomer] = useState(false);
  const [customerData, setCustomerData] = useState({
    customerName: '',
    phoneNo: ''
  });

  const CustomerInput = useMemo(() => [
    {
      id: "customerName",
      label: "Customer Name",
      placeholder: "Enter customer name",
      type: "text",
      name: "customerName",
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      placeholder: "Enter phone number",
      type: "tel",
      name: "phoneNo",
    },
  ], []);

  const handleCustomerInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  }, []);
  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted customer data:', customerData);
    setCreateCustomer(false);
    setCustomerData({ customerName: '', phoneNo: '' });
  };

  return (
    <div>
      <button 
        onClick={() => setCreateCustomer(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add Customer
      </button>

      <Modal isOpen={createCustomer} onClose={() => setCreateCustomer(false)} title="Add New Customer">
        <form onSubmit={handleCustomerSubmit} className="space-y-6">
          {CustomerInput.map((input) => (
            <InputField
              key={input.id}
              label={input.label}
              type={input.type}
              name={input.name}
              value={customerData[input.name]}
              onChange={handleCustomerInputChange}
              placeholder={input.placeholder}
              required
            />
          ))}
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setCreateCustomer(false)} 
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerForm;