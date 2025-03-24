import { Plus, Trash2, MoreVertical, Building2, Search, Users, Phone, ArrowLeft, Edit, Settings } from "lucide-react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { LocalClient } from "../Api/API_Client";
import { InputField, Modal } from "./SmallComponents";
import { toast } from "react-toastify";
import { API, Companys } from "../Api/Endpoints";

const ManageCompany = () => {
  const [create, setCreate] = useState(false);
  const [createCustomer, setCreateCustomer] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [data, setFormData] = useState({ companyName: "" });
  const [customerData, setCustomerData] = useState({ customerName: "", phoneNo: "" });
  const [companies, setCompanies] = useState([]);
    const [customers, setCustomers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [editCustomer,setEditCustomer]=useState(false)

  // Memoized fetch companies function
  const fetchCompanies = useCallback(async () => {
    try {
      const response = await LocalClient.get(API.companys);
      if (response.status === 200) {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies. Please try again.");
    }
  }, []);

  // Memoized fetch customers function
  const fetchCustomers = useCallback(async () => {
    if (!selectedCompany) return;

    try {
      const params = selectedCompany.id 
        ? { companyId: selectedCompany.id }
        : { companyName: selectedCompany.companyName };

      const response = await LocalClient.get(API.getCustomers, { params });
      if (response.status === 200) {
        setCustomers(response.data.customers || []);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers. Please try again.");
    }
  }, [selectedCompany]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (selectedCompany) {
      fetchCustomers();
    }
  }, [selectedCompany, fetchCustomers]);

  const filteredCompanies = useMemo(() =>
    companies.filter(company =>
      company.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [companies, searchTerm]);

  const filteredCustomers = useMemo(() =>
    customers.filter(customer =>
      customer.name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.phoneNo?.includes(customerSearchTerm)
    ), [customers, customerSearchTerm]);

  const handleAddDriver = useCallback(() => setCreate(prev => !prev), []);
  const handleAddCustomer = useCallback(() => setCreateCustomer(true), []);

  const CompanyInput = useMemo(() => [{
    id: "companyName",
    label: "Company Name",
    placeholder: "Enter company name",
    type: "text",
    name: "companyName",
  }], []);

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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCustomerInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await LocalClient.post(API.createCompany, data);
      if (response.status === 201) {
        toast.success(response.data.message);
        setCreate(false);
        const newCompany = { ...data, id: response.data.id || Date.now() }; // Assuming API returns ID
        console.error(" new company :",newCompany);
        
        setCompanies(prev => [...prev, newCompany]);
        setFormData({ name: "" });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  }, [data]);

  const handleCustomerSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!selectedCompany) {
      toast.error("Please select a company first.");
      return;
    }

    try {
      const queryParams = selectedCompany.id
        ? `companyId=${selectedCompany.id}`
        : `companyName=${encodeURIComponent(selectedCompany.name)}`;

      const response = await LocalClient.post(`${API.createCustomer}?${queryParams}`, customerData);
      if (response.status === 201) {
        toast.success("Customer added successfully");
        const newCustomer = { 
          ...customerData, 

          id: response.data.id || Date.now() // Assuming API returns ID
        };
        console.log(" this is the new Customer",newCustomer);
        
        setCustomers(prev => [...prev, newCustomer]);
        setCustomerData({ name: "", phoneNo: "" });
        setCreateCustomer(false);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }, [customerData, selectedCompany]);

  const handleDeleteCustomer = useCallback(async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {

        console.log(" this is the customer selected ",customerId);
        
        const response = await LocalClient.delete(`${API.deleteCustomer}?customerId=${customerId}`);
        if (response.status === 200) {
          toast.success("Customer deleted successfully");
          setCustomers(prev => prev.filter(customer => customer.id !== customerId));
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer. Please try again.");
      }
    }
  }, []);

  const handleManageCompany = useCallback((company) => {
    setSelectedCompany(company);

    setMenuOpen(null);
  }, []);

  const handleEditCustomer= (customer) => {
    setEditCustomer(true)
    setCustomerData({
      customerName:customer.name|| "",
      phoneNo:customer.phoneNo,
      customerId:customer.id 
    })
    console.log(" this is the selected customer to edit " ,customer);
    
  };



  const toggleMenu = useCallback((Id) => {
    setMenuOpen(prev => prev === Id ? null : Id);
  }, []);


const handleEditCustomerSubmit = useCallback(async (e) => {
  e.preventDefault();

  if (!customerData.customerName || !customerData.phoneNo) {
    console.log("Customer name and phone number are required.");
    return;
  }

  try {
    const response = await LocalClient.patch(API.editCustomer,customerData)

    if (response.status === 200) {
      toast.success("Customer updated successfully!");
    
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === customerData.customerId ? customerData : customer
        )
      );

      setCustomerData({ customerName: "", phoneNo: "" });
      setEditCustomer(false)
    }
    
  } catch (error) {
    console.error("Error updating customer:", error);

    // Handle 400 Bad Request errors
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.error || "Bad Request: Invalid input");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  
  }

 
  
}, [customerData]); // ✅ Dependencies


  if (selectedCompany) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h1>
                    <p className="text-gray-500">Manage company customers</p>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleAddCustomer}>
                <Plus size={20} /> Add New Customer
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
              />
            </div>
          </div>

          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Customers List</h2>
            </div>
            {filteredCustomers.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-6 hover:bg-gray-50">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 truncate">{customer.name || customer.customerName}</h3>
                    </div>
                    
                    <div className="flex-1 flex justify-center text-gray-700">
                      <Phone size={14} />
                      <span className="font-medium ml-2">{customer.phoneNo}</span>
                    </div>
                    
                    <div className="relative flex items-center">
                      <button onClick={() => toggleMenu(customer.id)} className="p-2 hover:bg-gray-100 rounded-full relative z-20">
                        <MoreVertical size={20} className="text-gray-600" />
                      </button>
                      {menuOpen === customer.id && (
                        <div className="absolute right-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-10 p-2 flex flex-col min-w-[120px]" style={{ top: '-100%' }}>
                          <button onClick={() => handleEditCustomer(customer)} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50">
                            <Edit size={18}  color="blue"/>
                            <span className="text-sm">Edit</span>
                          </button>
                          <button onClick={() => handleDeleteCustomer(customer.id)} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50">
                            <Trash2 size={18} color="red" />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
                <p className="text-gray-500">
                  {customerSearchTerm ? "No customers match your search." : "Start by adding your first customer."}
                </p>
              </div>
            )}
          </div>


          {createCustomer && (
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
                  <button type="button" onClick={() => setCreateCustomer(false)} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add Customer
                  </button>
                </div>
              </form>
            </Modal>
          )}
            <Modal isOpen={editCustomer}  onClose={() => setEditCustomer(false)} title="Edit Customer">
              <form onSubmit={handleEditCustomerSubmit} className="space-y-6">
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
                  <button type="button" onClick={() => setEditCustomer(false)} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </form>
            </Modal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                <p className="text-gray-500">Manage and organize your companies</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleAddDriver}>
              <Plus size={20} /> Add New Company
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Companies List</h2>
          </div>
          {filteredCompanies.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-206 overflow-y-auto">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-6 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{company.name||company.companyName}</h3>
                      {/* <p className="text-sm text-gray-500">
                        Added on {new Date().toLocaleDateString()}
                      </p> */}
                    </div>
                  </div>
                  <div className="relative">
                    <button onClick={() => toggleMenu(company.id)} className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical size={20} className="text-gray-600" />
                    </button>
                    {menuOpen === company.id && (
                      <div className="absolute right-0 mt-2 flex bg-white rounded-lg shadow-lg border border-gray-100 z-10 p-2">
                        <button onClick={() => handleManageCompany(company)} className="flex flex-col items-center px-3 py-2 text-gray-700 hover:bg-gray-50">
                          <Settings size={18} />
                          <span className="text-xs">Manage</span>
                        </button>
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
                {searchTerm ? "No companies match your search." : "Start by adding your first company."}
              </p>
            </div>
          )}
        </div>

        {create && (
          <Modal isOpen={create} onClose={() => setCreate(false)} title="Add New Company">
            <form onSubmit={handleSubmit} className="space-y-6">
              {CompanyInput.map((input) => (
                <InputField
                  key={input.id}
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
                <button type="button" onClick={() => setCreate(false)} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Company
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ManageCompany;