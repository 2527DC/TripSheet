import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
          const [isLoading, setIsLoading] = useState(false);


          useEffect(() => {
            const user = localStorage.getItem("user"); // Check if user is logged in
            if (user) {
              navigate("/"); // Redirect if already logged in
            }
          }, []);
        

// In handleSubmit:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const success = await login(credentials.username, credentials.password);
    setIsLoading(false);
    
    if (success) {
      console.log("this is the success returns in if", success);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } else {
      console.log("this is the success returns in else", success);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all hover:shadow-xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="MLt.jpeg" 
              alt="Trip Sheet Logo" 
              className="h-18 w-36  border-2 border-white object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Trip Sheet Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Secure Login</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter password"
              />
            </div>
          </div>


<button
  type="submit"
  disabled={isLoading}
  className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
>
  {isLoading ? 'Signing In...' : 'Sign In'}
</button>
        </form>

        {/* Optional Footer */}
        <div className="mt-6 text-center">
          {/* <p className="text-sm text-gray-600">
            Forgot password?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Reset here
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;