import { useState } from "react";
import { useAuth } from "./store/ AuthProvider";


export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // Access login from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password); // Call dynamic login from context
    } catch (error) {
      setError(error.message); // Display the error from login attempt
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
