import { Building2, Plus } from "lucide-react";
import Header from "../components/Header";
import { InputField, Modal } from "../components/SmallComponents";
import { useEffect, useState } from "react";
import { LocalClient } from "../Api/API_Client";
import { API, Create_ADMIN } from "../Api/Endpoints";
import { toast } from "react-toastify";

const ManageAdmins = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    adminName: "",
    password: "",
    email: "",
    role: "",
  });

  // ✅ Dummy Admin Data (Replace this with API fetch later)
  const [admins, setAdmins] = useState([ ]);

  const AdminInput = [
    { id: "adminName", label: "Admin Name", placeholder: "Enter Admin name", type: "text", name: "adminName" },
    { id: "email", label: "Email", placeholder: "Enter email", type: "text", name: "email" },
    { id: "password", label: "Password", placeholder: "Password", type: "password", name: "password" },
    { id: "role", label: "Role", placeholder: "Select the role", type: "select", name: "role", option: ["ADMIN", "SUPER_ADMIN"] },
  ];
  const fetchAdmins =async()=>{
    const responce=await LocalClient.get(API.getAdmins)
    if (responce.status===200) {
      toast.success(" ADMINS FETCHED ")
      setAdmins(responce.data)
    }
  }
  useEffect(()=>{
   
    fetchAdmins()
  },[])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNo") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting data:", formData);

    try {
      const response = await LocalClient.post(Create_ADMIN, formData);

      if (response.status === 201) {
        toast.success("Admin added successfully!");
        setIsOpen(false);
        setAdmins((prevAdmins) => [...prevAdmins, response.data.admin]); // ✅ Add new admin to list
        setFormData({ adminName: "", phoneNo: "", password: "", email: "", role: "" });
      }
    } catch (error) {
      console.error("Error in form submission:", error);

      if (!error.response) {
        toast.error("No network connection. Please check your internet.");
        return;
      }

      if (error.response.status === 409) {
        toast.error(error.response.data.message);
      } else if (error.response.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
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

      {/* ✅ Admins Table (Scrollable) */}
      <div className="max-w-8xl mx-auto mt-6 bg-white rounded-xl shadow-sm p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">List of Admins</h2>

  {/* ✅ Scrollable table (Both X & Y) */}
  <div className="overflow-x-auto">
    <div className="overflow-y-auto max-h-120 border border-gray-200 rounded-lg">
      <table className="w-full border-collapse min-w-[600px]"> {/* ✅ Ensures table doesn't shrink too much */}
        {/* ✅ Sticky Header */}
        <thead className="bg-gray-100 sticky top-0 shadow-sm">
          <tr>
            <th className="px-4 py-2 text-left text-gray-700">Name</th>
            <th className="px-4 py-2 text-left text-gray-700">Email</th>
           
            <th className="px-4 py-2 text-left text-gray-700">Role</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-t">
              <td className="px-4 py-2">{admin.name}</td>
              <td className="px-4 py-2">{admin.email}</td>
            
              <td className="px-4 py-2">{admin.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>


      {/* ✅ Add Admin Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={"ADD ADMIN"}>
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
    </div>
  );
};

export default ManageAdmins;
