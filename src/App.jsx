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
import { useEffect, useRef, useState } from "react";
import ManageDrivers from "./pages/ManageDrivers";
import TripSheet from "./components/TripSheet";
import ManageVendor from "./pages/ManageVendor";
import DutySlip from "./components/DutySlip";
import DriverView from "./pages/DriverView";
import ManageAdmins from "./pages/ManageAdmins";
import ManageCategory from "./components/ManangeCategory";


// ✅ Layout component for authenticated pages

export  const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const mainContentRef = useRef(null);

  // Handle clicks outside sidebar on mobile to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth < 1024 && // Only on mobile
        sidebarOpen && // Only when sidebar is open
        mainContentRef.current &&
        mainContentRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Adjust sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Open by default on desktop
      } else {
        setSidebarOpen(false); // Closed by default on mobile
        setIsPinned(false); // Disable pinning on mobile
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isPinned={isPinned}
        setIsPinned={setIsPinned}
      />

      {/* Main Content */}
      <div
        ref={mainContentRef}
        className={`flex-1 bg-gray-100 transition-all duration-300 ease-in-out ${
          sidebarOpen && isPinned ? 'lg:ml-64' : 'lg:ml-16'
        }`}
      >
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Fleet Management</h1>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block bg-white shadow-sm p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            {/* Add additional header content here if needed (e.g., user profile, notifications) */}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
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
            
        
            <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />}>
            <Route path="/" element={<TripSheetForm />} />
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
