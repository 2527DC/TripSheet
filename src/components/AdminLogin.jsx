import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "admin123") { // Replace with actual authentication logic
      localStorage.setItem("adminToken", "some-token");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Admin Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminLogin;
