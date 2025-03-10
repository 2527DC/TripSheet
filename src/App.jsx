

import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import { ROLES } from './utils/auth';
import ManageCompany from './components/ManageCompany';
import TripSheetForm from './components/TripsheetForm';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import ManageDrivers from './components/ManageDrivers';
import DriverView from './DriverView';
import TripForm from './components/TripForm';
import TripSheet from './components/TripSheet';
import ManageVendor from './components/ManageVendor';

// Layout component for authenticated pages

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar (Hidden on toggle) */}
      {isSidebarOpen && <Sidebar />}

      <div className={`flex-1  min-h-screen bg-gray-100 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Navbar */}
        <div className="bg-gray-500 text-white py-2 px-4 flex items-center shadow-md fixed w-full">
          <button
            className="text-white hover:bg-gray-700 p-2 rounded transition"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
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


// Placeholder components
const Clients = () => <h1 className="text-2xl font-bold">Clients</h1>;
const Vehicles = () => <h1 className="text-2xl font-bold">Vehicles</h1>;
const Bookings = () => <h1 className="text-2xl font-bold">Bookings</h1>;
const Vendors = () => <h1 className="text-2xl font-bold">Vendors</h1>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/driver-form" element={<DriverView />} />
          <Route path="/check" element={<TripForm/>} />
             {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />}>
                <Route path="/clients" element={<ManageCompany />} />
                <Route path="/tripsheet-list" element={<TripSheet/>} />
                <Route path="/tripsheets" element={<TripSheetForm />} />

              </Route>
              <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VENDOR]} />}>
                <Route path="/driver" element={<ManageDrivers />} />
              </Route>
              <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN]} />}>
                <Route path="/vendors" element={<ManageVendor />} />
              </Route>
            </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
