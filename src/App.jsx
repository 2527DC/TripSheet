// import React, { useState, useEffect } from "react";
// import { useAuth } from "./store/ AuthProvider";
// import FormCreator from "./components/FormCreator";
// import FormFiller from "./components/FormCreator";
// import FormComponent from "./components/FormComponent";
// import FormBuilder from "./components/FormComponent";




// function App() {
//   const { isAuthenticated, userRole, loading, login, logout } = useAuth();

//   // // If the app is loading, we can show a loading spinner or message
//   // if (loading) return <div>Loading...</div>;

//   // if (!isAuthenticated) {
//   //   return <Login onLogin={login} />;
//   // }

//   return (
//     // <div>
//     //   {userRole === "driver" && <DriverView />}
//     //   {userRole === "admin" && <AdminView />}
//     // </div>
//     <FormBuilder/>
//   );
// }

// export default App;


import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DriverForm from './components/DriverForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import TripSheetForm from './components/TripsheetForm';
import DriverView from './DriverView';
import { Login } from './Loginpage';
import { useAuth } from './store/ AuthProvider';
import AdminView from './AdminView';


const isAuthenticated = () => {
  return localStorage.getItem("adminToken") !== null; // Simulated authentication check
};

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated} = useAuth();

  return isAuthenticated ? element : <Navigate to="/admin-login" />;
};

function App() {

  return (
    <Router>
      <Routes>
        {/* Admin Routes (Protected) */}
        <Route path="/admin-login" element={<Login />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
       
        <Route path="/create-trip" element={<ProtectedRoute element={<TripSheetForm/>} />} />
        {/* Public Driver Form (No Login Required) */}
        <Route path="/driver-form" element={<DriverView />} />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/admin-login" />} />
      </Routes>
    </Router>
  );
}

export default App;
