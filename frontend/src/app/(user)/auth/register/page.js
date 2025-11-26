"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/UserRegisterForm";
import { AuthContext } from "@/components/provider/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    // Nếu auth vẫn đang kiểm tra thì chờ
    if (authLoading) return;

    // Nếu đã đăng nhập thì chuyển hướng đến /books (replace để không quay lại trang register)
    if (isAuthenticated) {
      router.replace("/books");
    }
  }, [isAuthenticated, authLoading, router]);

  return (
    <div className="min-h-[80vh] bg-[#E9E7E0] flex items-center justify-center p-20">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="bg-gray-100 p-12 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">Register</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Welcome to Elib
          </p>
        </div>

        {/* Right Panel */}
        <div className="bg-white p-12 md:w-1/2 flex flex-col justify-center">
          {/* Gọi form đăng ký tách riêng */}
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}