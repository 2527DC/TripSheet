import React, { useState } from "react";
import DriverView from "./DriverView";
import AdminView from "./AdminView";

function DriverComponent() {
  return <h1>Welcome, Driver!</h1>;
}

function AdminComponent() {
  return <h1>Welcome, Admin!</h1>;
}

function Login({ onLogin }) {
  const handleLogin = (role) => {
    onLogin(role);
  };

  return (
    <div className="login">
      <h1>Login Page</h1>
      <button onClick={() => handleLogin("driver")}>Login as Driver</button>
      <button onClick={() => handleLogin("admin")}>Login as Admin</button>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setRole(userRole);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      {role === "driver" && <DriverView />}
      {role === "admin" && <AdminView/>}
    </div>
  );
} 

export default App;
