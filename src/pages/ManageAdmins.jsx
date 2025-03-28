import { Building2, Plus, Trash2, Edit, KeyRound } from "lucide-react";
import Header from "../components/Header";
import { InputField, Modal } from "../components/SmallComponents";
import { useEffect, useState } from "react";
import { LocalClient } from "../Api/API_Client";
import { API, Create_ADMIN } from "../Api/Endpoints";
import { toast } from "react-toastify";

const ManageAdmins = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    adminName: "",
    password: "",
    email: "",
    role: "",
  });
  const [admins, setAdmins] = useState([]);

  const AdminInput = [
    { id: "adminName", label: "Admin Name", placeholder: "Enter Admin name", type: "text", name: "adminName" },
    { id: "email", label: "Email", placeholder: "Enter email", type: "text", name: "email" },
    { id: "password", label: "Password", placeholder: "Password", type: "password", name: "password" },
    { id: "role", label: "Role", placeholder: "Select the role", type: "select", name: "role", option: ["ADMIN", "SUPER_ADMIN"] },
  ];

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const response = await LocalClient.get(API.getAdmins);
      if (response.status === 200) {
        toast.success("Admins fetched successfully!");
        setAdmins(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch admins.");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await LocalClient.post(Create_ADMIN, formData);
      if (response.status === 201) {
        toast.success("Admin added successfully!");
        setIsOpen(false);
        setAdmins((prevAdmins) => [...prevAdmins, response.data.admin]);
        setFormData({ adminName: "", password: "", email: "", role: "" });
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Edit admin
  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      adminName: admin.name,
      email: admin.email,
      password: "", // Password typically isn't pre-filled for security
      role: admin.role,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await LocalClient.put(`${API.updateAdmin}/${selectedAdmin.id}`, formData);
      if (response.status === 200) {
        toast.success("Admin updated successfully!");
        setIsEditOpen(false);
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin.id === selectedAdmin.id ? { ...admin, ...formData } : admin
          )
        );
        setFormData({ adminName: "", password: "", email: "", role: "" });
        setSelectedAdmin(null);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Delete admin
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const response = await LocalClient.delete(`${API.deleteAdmin}/${id}`);
        if (response.status === 200) {
          toast.success("Admin deleted successfully!");
          setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id));
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  // Error handling helper
  const handleError = (error) => {
    console.error("Error:", error);
    if (!error.response) {
      toast.error("No network connection. Please check your internet.");
    } else if (error.response.status === 409) {
      toast.error(error.response.data.message);
    } else if (error.response.status === 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      {/* Header */}
      <Header
        Icon={Building2}
        tittle="Admin Management"
        discription="Manage all system administrators"
        btName="Add Admin"
        method={() => setIsOpen(true)}
      />

      {/* Admins Table */}
      <div className="max-w-8xl mx-auto mt-6 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">List of Admins</h2>
        <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-120 border border-gray-200 rounded-lg">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="bg-gray-100 sticky top-0 shadow-sm">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-gray-700">Role</th>
                  <th className="px-4 py-2 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{admin.name}</td>
                    <td className="px-4 py-2">{admin.email}</td>
                    <td className="px-4 py-2">{admin.role}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Admin"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Admin"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                            onClick={() => handleResetPassword(admin)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Reset Password"
                          >
                            <KeyRound size={18} />
                        </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Admin">
        <form onSubmit={handleSubmit} className="space-y-6">
          {AdminInput.map((input, index) => (
            <InputField
              key={index}
              label={input.label}
              type={input.type}
              name={input.name}
              value={formData[input.name]}
              onChange={handleInputChange}
              placeholder={input.placeholder}
              option={input.option}
            />
          ))}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Admin
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Admin">
        <form onSubmit={handleEditSubmit} className="space-y-6">
          {AdminInput.map((input, index) => (
            <InputField
              key={index}
              label={input.label}
              type={input.type}
              name={input.name}
              value={formData[input.name]}
              onChange={handleInputChange}
              placeholder={input.placeholder}
              option={input.option}
            />
          ))}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Admin
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageAdmins;