// src/components/ui/Button.js
"use client";

export default function Button({
  children,
  type = "button",
  className = "",
  fullWidth = false,
  isLoading = false, // thêm prop isLoading
  ...props
}) {
  return (
    <button
      type={type}
      {...props} // các prop khác vẫn truyền bình thường
      className={`${
        fullWidth ? "w-full" : ""
      } bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 ${className}`}
      disabled={isLoading || props.disabled} // disable khi đang loading
    >
      {isLoading ? "Loading..." : children} {/* hiển thị loading nếu cần */}
    </button>
  );
}
