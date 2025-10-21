/**
 * components/auth/UserRegisterForm.js
 * Form đăng ký tài khoản User
 * - Gọi API register backend
 * - Lưu token vào localStorage
 * - Redirect đến /dashboard sau khi đăng ký thành công
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/InputLogin";
import { authAPI } from "@/lib/api";
import { Link } from "lucide-react";

export default function UserRegisterForm() {
  const router = useRouter();
  
  // ===== STATE =====
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===== HANDLE INPUT CHANGE =====
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error khi user gõ
    if (error) setError("");
  };

  // ===== HANDLE SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Kiểm tra độ dài password
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log("📝 Đang đăng ký tài khoản...");

      // Gọi API register
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        screenName: formData.username, // Dùng username làm screenName
      });

      // Kiểm tra response có token và user không
      if (!response.token || !response.user) {
        throw new Error("Phản hồi từ server không hợp lệ");
      }

      // Lưu token và user info vào localStorage
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_info", JSON.stringify(response.user));

      console.log("✅ Đăng ký thành công:", response.user.email);

      // Redirect đến /dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Lỗi đăng ký:", err);
      
      // Hiển thị error message
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        "Đăng ký thất bại. Email có thể đã được sử dụng.";
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Username Input - Ô đầu tiên */}
      <Input
        id="username"
        label="Username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        required
        disabled={loading}
        placeholder="Enter your username"
      />

      {/* Email Input */}
      <Input
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        disabled={loading}
        placeholder="Enter your email"
      />

      {/* Password Input */}
      <Input
        id="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        disabled={loading}
        placeholder="At least 6 characters"
      />

      {/* Submit Button - cách ô password 50px */}
      <Button 
        type="submit" 
        className="mt-[50px]"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Đang đăng ký...
          </span>
        ) : (
          "Sign Up"
        )}
      </Button>

      <p className="text-center text-gray-700 mt-6">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-gray-700 hover:text-gray-900 underline font-medium"
        >
          Log in now
        </Link>
      </p>
    </form>
  );
}