import React, { useState, useEffect } from "react";
import DriverView from "./DriverView";
import AdminView from "./AdminView";
import { Login } from "./Loginpage";
import { useAuth } from "./store/ AuthProvider";


function App() {
  const { isAuthenticated, userRole, loading, login, logout } = useAuth();

  // If the app is loading, we can show a loading spinner or message
  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <div>
      {userRole === "driver" && <DriverView />}
      {userRole === "admin" && <AdminView />}
    </div>
  );
}

export default App;
