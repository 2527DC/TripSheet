  import { useEffect, useState } from "react";
  import { useAuth } from "./store/ AuthProvider";
  import { useNavigate } from "react-router-dom";
   import { LocalClient } from "./Api/API_Client";
import { API } from "./Api/Endpoints";


  export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login,setIsAuthenticated , setUserRole} = useAuth(); // Access login from context
      const navigate = useNavigate();


      useEffect(() => {
        // Redirect user to /admin-dashboard if already authenticated
        if (localStorage.getItem("userRole")) {
          navigate("/admin-dashboard");
        }
      }, [navigate]);
    

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(`this is the mail  ${email} and this sis ther password ${password}`);
      try {
        
    const response =  await LocalClient.post(API.login, { email, password });

        if (response.data.success) {
          const { role, message } = response.data;
          localStorage.setItem('userRole', role);  // Save role in localStorage
          setIsAuthenticated(true);
          setUserRole(role);
          alert(message);  // Show success message
          navigate("/admin-dashboard", { replace: true });
          console.log(" this is the responce ", response);
        }
          } catch (error) {
            
            if (error.response) {
              // Server responded with a status code outside of the 2xx range
              if (error.response.status === 404) {
                alert('User not found. Please check your credentials.');
              } else if (error.response.status === 401) {
                alert('Incorrect password. Please try again.');
              } else {
                alert('Login failed: ' + error.response.data.message);
              }
            } else if (error.request) {
              // No response was received from the server
              console.log(" this is the error in Login Api",error);
              console.log(" this is the error in Login Api",error.response);
              
              alert('No response from the server. Please check your network connection.');
            } else {
              // Something else caused the error
              alert('An error occurred while logging in.');
            }
          }
        
        };

    const handleInputChange = (e) => {
      const { name, value } = e.target;

      if (name === "email") {
        setEmail(value);
      } else if (name === "password") {
        setPassword(value);
      }
    };

    const inputs = [
      {
        id: "Email",
        label: "Email",
        placeholder: "Email",
        type: "text",
        required: true,
        name: "email",
      },
      {
        id: "Password",
        label: "Password",
        placeholder: "Password",
        type: "password",
        required: true,
        name: "password",
      },
    ];

    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 rounded">
          <div>
            <img
              className="mx-auto h-24 w-auto"
              src="/MLt.jpeg"
              alt="MLT Logo"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              MLT Corporate Solutions
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Trip Sheet Management System
            </p>
          </div>
          <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit}>
            {/* Input Fields Container */}
            <div className="rounded-md shadow-sm p-2">
              {inputs.map((input, index) => (
                <div key={index} className="mb-4">
                  <label
                    htmlFor={input.id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {input.label}
                  </label>
                  <input
                    id={input.id}
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                    value={input.name === "email" ? email : password}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-1 hover:ring-gray-400"
                    required={input.required}
                  />
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
