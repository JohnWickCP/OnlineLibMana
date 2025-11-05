"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/AdminLoginForm";
import { AuthContext } from "@/components/provider/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    // Nếu auth vẫn đang kiểm tra thì chờ (không redirect)
    if (authLoading) return;

    // Nếu đã đăng nhập, chuyển đến dashboard admin
    if (isAuthenticated) {
      // replace để tránh người dùng back về trang login
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  return (
    <div className="min-h-[84vh] bg-[#E9E7E0] flex items-center justify-center p-20">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full flex flex-col md:flex-row min-h-[50vh]">
        {/* Left Panel */}
        <div className="bg-gray-100 p-12 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">Log In</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Log in with admin to use your free Library card to borrow digital
            books from the nonprofit Internet Archive.
          </p>
        </div>

        {/* Right Panel */}
        <div className="bg-white p-12 md:w-1/2 flex flex-col justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}