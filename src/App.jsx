import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify CSS
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import { ROLES } from "./utils/auth";
import ManageCompany from "./components/ManageCompany";
import TripSheetForm from "./pages/TripsheetForm";
import { Menu } from "lucide-react";
import { useState } from "react";
import ManageDrivers from "./pages/ManageDrivers";

import TripForm from "./components/TripForm";
import TripSheet from "./components/TripSheet";
import ManageVendor from "./pages/ManageVendor";
import DutySlip from "./components/DutySlip";
import DriverView from "./pages/DriverView";
import ManageAdmins from "./pages/ManageAdmins";
import ParentComponent from "./components/ParentComponent";
import ManageCategory from "./components/ManangeCategory";


// ✅ Layout component for authenticated pages
const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar (Hidden on toggle) */}
      {isSidebarOpen && <Sidebar />}

      <div className={`flex-1 min-h-screen bg-gray-100 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Navbar */}
        <div className="bg-gray-500 text-white py-2 px-4 flex items-center shadow-md fixed w-full">
          <button className="text-white hover:bg-gray-700 p-2 rounded transition" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
        </div>

        {/* Page Content */}
        <div className="pt-12 px-4 mt-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};



function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ✅ ToastContainer should be placed at the top level */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/driver-form" element={<DriverView />} />
          <Route path="/duty-slip" element={<DutySlip/>} />
      
          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<TripSheetForm />} />
        
            <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />}>
              <Route path="/clients" element={<ManageCompany />} />
              <Route path="/tripsheet-list" element={<TripSheet />} />
              <Route path="/tripsheets" element={<TripSheetForm />} />
              <Route path="/manage-category" element={<ManageCategory/>} />
              <Route path="/vendors" element={<ManageVendor />} />
              <Route path="/driver" element={<ManageDrivers />} />
            </Route>
           
            <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN]} />}>
              <Route path="/manage-admins" element={<ManageAdmins />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
