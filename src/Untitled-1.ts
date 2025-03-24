// import { Plus, Trash2, MoreVertical, Building2, Search, Users, Phone, ArrowLeft, Edit, Settings } from "lucide-react";
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { LocalClient } from "../Api/API_Client";
// import { InputField, Modal } from "./SmallComponents";
// import { toast } from "react-toastify";
// import { Companys } from "../Api/Endpoints";

// const ManageCompany = () => {
//   // ... existing state declarations ...

//   // Memoize filtered companies
//   const filteredCompanies = useMemo(() => 
//     companies.filter(company =>
//       company.name?.toLowerCase().includes(searchTerm.toLowerCase())
//     ), [companies, searchTerm]);

//   // Memoize filtered customers
//   const filteredCustomers = useMemo(() =>
//     customers.filter(customer =>
//       customer.name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
//       customer.phoneNo?.includes(customerSearchTerm)
//     ), [customers, customerSearchTerm]);

//   // Memoize static input configurations
//   const CompanyInput = useMemo(() => [
//     {
//       id: "companyName",
//       label: "Company Name",
//       placeholder: "Enter company name",
//       type: "text",
//       name: "companyName",
//     },
//   ], []);

//   const CustomerInput = useMemo(() => [
//     {
//       id: "customerName",
//       label: "Customer Name",
//       placeholder: "Enter customer name",
//       type: "text",
//       name: "customerName",
//     },
//     {
//       id: "phoneNumber",
//       label: "Phone Number",
//       placeholder: "Enter phone number",
//       type: "tel",
//       name: "phoneNo",
//     },
//   ], []);

//   // Memoize event handlers
//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   }, []);

//   const handleCustomerInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setCustomerData(prev => ({ ...prev, [name]: value }));
//   }, []);

//   const toggleMenu = useCallback((companyId) => {
//     setMenuOpen(current => current === companyId ? null : companyId);
//   }, []);

//   // Optimized form submission using FormData
//   const handleSubmit = useCallback(async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const submissionData = Object.fromEntries(formData.entries());
    
//     try {
//       const response = await LocalClient.post("createCompany", submissionData);
//       if (response.status === 201) {
//         toast.success(response.data.message);
//         setCreate(false);
//         // Refetch updated company list
//         const updatedResponse = await LocalClient.get(Companys);
//         setCompanies(updatedResponse.data);
//       }
//     } catch (error) {
//       // ... error handling ...
//     }
//   }, []);

//   const handleCustomerSubmit = useCallback(async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const submissionData = Object.fromEntries(formData.entries());

//     try {
//       // ... existing logic ...
//       const response = await LocalClient.post(`createCustomer?${queryParams}`, submissionData);
//       if (response.status === 201) {
//         // Add customer from response (includes server-generated id)
//         setCustomers(prev => [...prev, response.data]);
//       }
//     } catch (error) {
//       // ... error handling ...
//     }
//   }, [selectedCompany?.id, selectedCompany?.companyName]);

//   // ... rest of the component remains the same ...
// };

// export default ManageCompany;