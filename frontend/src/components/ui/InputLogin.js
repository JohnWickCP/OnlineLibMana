// src/components/ui/Input.js
"use client";

export default function Input({
  id,
  label,
  type = "text",
  required = false,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-900 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        {...props}
        className={`shadow-md
 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none 
          focus:ring-2 focus:ring-gray-400 focus:border-transparent ${
            props.className || ""
          }`}
      />
    </div>
  );
}
