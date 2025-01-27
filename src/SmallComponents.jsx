export const InputFields = ({
    label,
    placeholder = "Enter value",
    type = "text",
    required = false,
    id,
    name,
    value,
    onChange,
  }) => {
    return (
      <div className="space-y-2">
        {/* Label for the input */}
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && "*"}
        </label>
  
        {/* Input with icon */}
        <div className="relative">
        
          <input
            id={id}
            name={name}
            type={type}
            {...(type !== "file" && { value })} // Exclude value for file inputs
            onChange={onChange}
            required={required}
            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-1 hover:ring-gray-400"
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  };