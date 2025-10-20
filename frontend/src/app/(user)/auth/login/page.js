// src/app/login/page.js
"use client";

import UserLoginForm from "@/components/auth/UserLoginForm";


export default function LoginPage() {
  return (
    <div className="min-h-[80vh] bg-[#E9E7E0] flex items-center justify-center p-20">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="bg-gray-100 p-12 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">Log In</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Log in to use your free Library card to borrow digital books
            from the nonprofit Internet Archive.
          </p>
        </div>

        {/* Right Panel */}
        <div className="bg-white p-12 md:w-1/2 flex flex-col justify-center">
          {/* Gọi form đăng nhập */}
          <UserLoginForm />
        </div>
      </div>
    </div>
  );
}
