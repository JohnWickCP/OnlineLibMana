"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/InputLogin";
import { authAPI } from "@/lib/api";
import Link from "next/link";

export default function UserRegisterForm() {
  const router = useRouter();

  // ===== STATE =====
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===== HANDLE INPUT CHANGE =====
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // ✅ Clear error/success khi user thay đổi input
    if (error) setError("");
    if (success) setSuccess("");
  };

  // ===== HANDLE SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Kiểm tra dữ liệu nhập
    if (!formData.username || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // ✅ Kiểm tra độ dài password
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    // ✅ Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log("📝 Đang đăng ký tài khoản...");

      // ✅ Gọi API register
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        screenName: formData.username,
      });

      console.log("📩 Phản hồi từ server:", response);

      // ❌ Nếu có lỗi từ API
      if (!response.success) {
        setError(response.message);
        return;
      }

      // ✅ Đăng ký thành công
      console.log("✅ Đăng ký thành công!");
      setSuccess("Vui lòng kiểm tra email để kích hoạt tài khoản của bạn.");

      // ✅ Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
      });

      // ✅ Chuyển hướng sau 2 giây
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (err) {
      console.error("❌ Lỗi không mong đợi:", err);
      setError("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* ===== ERROR MESSAGE ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fadeIn">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* ===== SUCCESS MESSAGE ===== */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg animate-fadeIn">
          <div className="flex items-start gap-3">
            <span className="text-xl">✅</span>
            <p className="text-sm font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* ===== USERNAME INPUT ===== */}
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

      {/* ===== EMAIL INPUT ===== */}
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

      {/* ===== PASSWORD INPUT ===== */}
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

      {/* ===== SUBMIT BUTTON ===== */}
      <Button type="submit" className="mt-[50px]" disabled={loading}>
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
            <span>Đang đăng ký...</span>
          </span>
        ) : (
          "Sign Up"
        )}
      </Button>

      {/* ===== LOGIN LINK ===== */}
      <p className="text-center text-gray-700 mt-6">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
        >
          Log in now
        </Link>
      </p>
    </form>
  );
}