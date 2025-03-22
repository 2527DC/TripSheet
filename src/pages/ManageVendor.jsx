import { Plus } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LocalClient } from '../Api/API_Client';
import { toast } from 'react-toastify';
import { Modal, InputField } from '../components/SmallComponents';

const ManageVendor = () => {
  const [create, setCreate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendors, setVendors] = useState([]);

  const [formData, setFormData] = useState({
    vendorName: "",
    vendorPh: ""
  });

  // Fetch vendors on mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await LocalClient.get("getVendors"); 
        if (response.status === 200) {
          setVendors(response.data || []);
          toast.success('Vendors Fetched Successfully');
        }
      } catch (error) {
        toast.error('Failed to fetch vendors');
        console.error("Error fetching vendors:", error);
      }
    }
    fetchVendors();
  }, []);


  // Memoize input fields to prevent re-creation on each render
  const DriverdetailsInput = useMemo(() => [
    { id: "vendorName", label: "Vendor Name", placeholder: "Vendor Name", type: "text", name: "vendorName" },
    { id: "phoneNo", label: "Phone No", placeholder: "Phone No", type: "tel", name: "vendorPh" },
  ], []);

  const handleAddVendor = useCallback(() => {
    setIsModalOpen(true);
    setCreate((prev) => !prev);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type } = e.target;

    let newValue = value;
    if (type === "tel") {
      newValue = newValue.replace(/\D/g, "").slice(0, 10); // Restrict to 10 digits, prevent non-numeric input
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await LocalClient.post("createVendor", formData);
      if (response.status === 201) {
        toast.success(response.data.message);
        setCreate(false);
        setIsModalOpen(false);
        setFormData({ vendorName: "", vendorPh: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Manage Vendors</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleAddVendor}
          >
            <Plus size={18} />
            Add Vendor
          </button>
        </div>

        {/* Vendor List Table */}
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Vendor List</h3>
          {vendors.length > 0 ? (
            <div className="overflow-x-auto max-h-146 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendors.map((vendor, index) => (
                    <tr key={vendor.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vendor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vendor.phoneNo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No vendors found.</p>
          )}
        </div>
      </div>

      {/* Modal for Adding Vendor */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Vendor">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {DriverdetailsInput.map((input) => (
              <InputField
                key={input.id}
                label={input.label}
                type={input.type}
                name={input.name}
                value={formData[input.name]}
                onChange={handleInputChange}
                placeholder={input.placeholder}
                required
              />
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageVendor;
