import { Plus, Trash2, MoreVertical, Building2, Search, Users, Phone, ArrowLeft, Edit, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import { LocalClient } from "../Api/API_Client";
import { InputField, Modal } from "./SmallComponents";
import { toast } from "react-toastify";
import { Companys } from "../Api/Endpoints";

const ManageCompany = () => {
  const [create, setCreate] = useState(false);
  const [createCustomer, setCreateCustomer] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [data, setFormData] = useState({
    companyName: "",
  });
  const [customerData, setCustomerData] = useState({
    customerName: "",
    phoneNo: "",
  });
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await LocalClient.get(Companys);
        if (response.status === 200) {
          setCompanies(response.data);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to fetch companies. Please try again.");
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (!selectedCompany) {
          toast.error("Please select a company first.");
          return;
        }
  
        // Determine which parameter to use
        let params = {};
        if (selectedCompany.id) {
          params.companyId = selectedCompany.id;
        } else if (selectedCompany.companyName) {
          params.companyName = selectedCompany.companyName;
        } else {
          toast.error("Invalid company selection.");
          return;
        }
  
        console.log("Fetching customers with params:", params);
  
        const response = await LocalClient.get("getCustomers", { params });
  
        if (response.status === 200) {
          console.log("This is the customers of the company:", response.data);
          setCustomers(response.data.customers || []);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to fetch customers. Please try again.");
      }
    };
  
    if (selectedCompany) {
      fetchCustomers();
    }
  }, [selectedCompany]);
  
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(" this is the customer",customers);
  

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phoneNo.includes(customerSearchTerm)
  );

  const handleAddDriver = () => {
    setCreate((prev) => !prev);
  };

  const handleAddCustomer = () => {
    setCreateCustomer(true);
  };

  const CompanyInput = [
    {
      id: "companyName",
      label: "Company Name",
      placeholder: "Enter company name",
      type: "text",
      name: "companyName",
    },
  ];

  const CustomerInput = [
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
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await LocalClient.post("createCompany", data);
      if (response.status === 201) {
        toast.success(response.data.message);
        setCreate(false);
        setFormData({ companyName: "" });
        setCompanies((prev) => [...prev, data]); // ✅ Correct for arrays

        // const updatedResponse = await LocalClient.get("getCompanies");
        // if (updatedResponse.status === 200) {
        //   setCompanies(updatedResponse.data);
        // }
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (!selectedCompany?.id && !selectedCompany?.companyName) {
        toast.error("Please select a company first.");
        return;
      }
  
      // Dynamically construct the query params
      const queryParams = selectedCompany.id
        ? `companyId=${selectedCompany.id}`
        : `companyName=${encodeURIComponent(selectedCompany.companyName)}`;
  
      // Send request with appropriate query parameter
      const response = await LocalClient.post(`createCustomer?${queryParams}`, customerData);
  
      if (response.status === 201) {
        toast.success("Customer added successfully");
        setCreateCustomer(false);
  
        console.log("This is the customer data on submit:", customerData);
  
        // Append new customer to the list without replacing the existing ones
        setCustomers((prevCustomers) => [...prevCustomers, customerData]);
  
        // Reset form
        setCustomerData({ customerName: "", phoneNo: "" });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("This is the error check:", error.response?.data?.message);
    }
  };
  

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        const response = await LocalClient.delete(`deleteCompany/${companyId}`);
        if (response.status === 200) {
          toast.success(response.data.message || "Company deleted successfully");
          setCompanies(companies.filter((company) => company.id !== companyId));
        }
      } catch (error) {
        console.error("Error deleting company:", error);
        toast.error("Failed to delete company. Please try again.");
      }
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await LocalClient.delete(`deleteCustomer/${customerId}`);
        if (response.status === 200) {
          toast.success("Customer deleted successfully");
          setCustomers(customers.filter((customer) => customer.id !== customerId));
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer. Please try again.");
      }
    }
  };

  const handleManageCompany = (company) => {
    console.log(" this  is the company " ,company);
    
    setSelectedCompany(company);
    setMenuOpen(null);
  };

  const handleEditCompany = (companyId) => {
    console.log(`Editing company with ID: ${companyId}`);
    setMenuOpen(null);
  };

  const toggleMenu = (companyId) => {
    setMenuOpen(menuOpen === companyId ? null : companyId);
  };

  if (selectedCompany) {
    return (
      <div className="min-h-screen bg-gray-50  ">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedCompany.companyName}</h1>
                    <p className="text-gray-500">Manage company customers</p>
                  </div>
                </div>
              </div>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                onClick={handleAddCustomer}
              >
                <Plus size={20} />
                Add New Customer
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

      {/* Customers List */}
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
  <div className="p-6 border-b border-gray-100">
    <h2 className="text-lg font-semibold text-gray-900">Customers List</h2>
  </div>

  {filteredCustomers.length > 0 ? (
    <div className="divide-y divide-gray-100">
      {filteredCustomers.map((customer) => (
        <div
          key={customer.id}
          className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          {/* Left Section: Icon & Name */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 truncate w-52">{customer.name}</h3> 
            {/* ✅ Limits name width and truncates long text */}
          </div>

          {/* Center Section: Fixed Phone Number */}
          <div className="flex items-center gap-2 text-gray-700 w-90  ml-8justify-center">
            <Phone size={14} />
            <span className="font-medium">{customer.phoneNo}</span>
          </div>

          {/* Right Section: Delete Button */}
          <button
            onClick={() => handleDeleteCustomer(customer.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  ) : (
    <div className="p-6 text-center">
      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
      <p className="text-gray-500">
        {customerSearchTerm ? "No customers match your search criteria." : "Start by adding your first customer."}
      </p>
    </div>
  )}
</div>

        </div>

        {/* Add Customer Modal */}
        {createCustomer && (
          <Modal isOpen={createCustomer} onClose={() => setCreateCustomer(false)} title="Add New Customer">
            <form onSubmit={handleCustomerSubmit} className="space-y-6">
              {CustomerInput.map((input, index) => (
                <InputField
                  key={index}
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
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                <p className="text-gray-500">Manage and organize your companies</p>
              </div>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
              onClick={handleAddDriver}
            >
              <Plus size={20} />
              Add New Company
            </button>
          </div>
        </div>

        {/* Search and Stats Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
          </div>
        </div>
{/* Companies List */}
<div className="bg-white rounded-xl shadow-sm">
  <div className="p-6 border-b border-gray-100">
    <h2 className="text-lg font-semibold text-gray-900">Companies List</h2>
  </div>

  {filteredCompanies.length > 0 ? (
    // Scrollable container with max height
    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
      {filteredCompanies.map((company) => (
        <div
          key={company.id}
          className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
              <p className="text-sm text-gray-500">
                Added on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => toggleMenu(company.id)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical size={20} className="text-gray-600" />
            </button>
            {menuOpen === company.id && (
              <div className="absolute right-0 mt-2 flex bg-white rounded-lg shadow-lg border border-gray-100 z-60 p-2">
                <button
                  onClick={() => handleManageCompany(company)}
                  className="flex flex-col items-center justify-center px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={18} />
                  <span className="text-xs">Manage</span>
                </button>
                {/* <button
                  onClick={() => handleEditCompany(company.id)}
                  className="flex flex-col items-center justify-center px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit size={18} />
                  <span className="text-xs">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteCompany(company.id)}
                  className="flex flex-col items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                  <span className="text-xs">Delete</span>
                </button> */}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="p-6 text-center">
      <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">No companies found</h3>
      <p className="text-gray-500">
        {searchTerm
          ? "No companies match your search criteria."
          : "Start by adding your first company."}
      </p>
    </div>
  )}
</div>
</div>

      {/* Add Company Modal */}
      {create && (
        <Modal isOpen={create} onClose={() => setCreate(false)} title="Add New Company">
          <form onSubmit={handleSubmit} className="space-y-6">
            {CompanyInput.map((input, index) => (
              <InputField
                key={index}
                label={input.label}
                type={input.type}
                name={input.name}
                value={data[input.name]}
                onChange={handleInputChange}
                placeholder={input.placeholder}
                required
              />
            ))}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCreate(false)}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Company
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManageCompany; 