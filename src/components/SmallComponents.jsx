import { X } from "lucide-react";

 export const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
          {title && <h2 className="text-xl font-bold mb-6">{title}</h2>}
          {children}
        </div>
      </div>
    );
  };
  
  export const InputField = ({ label, type, option, ...props }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
  
      {type === "select" ? (
        // ✅ Render a select dropdown if type is "select"
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          {...props}
        >
          <option value="" disabled>
            Select an option
          </option>
          {option?.map((opt, index) => (
            <option key={index} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        // ✅ Render a normal input field otherwise
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          type={type}
          {...props}
        />
      )}
    </div>
  );
  