import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import TripSheetForm from './components/TripsheetForm';
import DriverView from './DriverView';
import { Login } from './Loginpage';
import { useAuth } from './store/ AuthProvider';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DownloadExcel from './components/DownloadExcel';


const ProtectedRoute = ({ element }) => {
  const { isAuthenticated} = useAuth();

  return isAuthenticated ? element : <Navigate to="/admin-login" />;
};

function App() {

  return (<>
     <ToastContainer position="top-right" autoClose={3000} />
  
  <Router>
      <Routes>
        {/* Admin Routes (Protected) */}
        <Route path="/admin-login" element={<Login />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
       
        <Route path="/create-trip" element={<ProtectedRoute element={<TripSheetForm/>} />} />
        {/* Public Driver Form (No Login Required) */}
        <Route path="/driver-form" element={<DriverView />} />
        <Route path="/pdf" element={<DownloadExcel/>} />
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/admin-login" />} />
      </Routes>
    </Router>
  </>
 
  );
}

export default App;
