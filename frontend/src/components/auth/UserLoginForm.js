"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/InputLogin";
import Link from "next/link";

export default function UserLoginForm() {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ Gọi authLogin từ AuthProvider
      await authLogin(formData.email, formData.password);

      router.push("/books");
    } catch (err) {
      // ✅ Xử lý lỗi chi tiết hơn
      if (err.response?.status === 401) {
        setError("Email hoặc mật khẩu không chính xác");
      } else if (err.response?.status === 404) {
        setError("Tài khoản không tồn tại");
      } else if (err.code === 'ECONNABORTED') {
        setError("Kết nối timeout, vui lòng thử lại");
      } else {
        setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Input
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        disabled={loading}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        disabled={loading}
      />

      <Button type="submit" className="mt-[50px]" disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Log In"}
      </Button>

      <p className="text-center text-gray-700 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-gray-700 hover:text-gray-900 underline font-medium"
        >
          Sign up now
        </Link>
      </p>
    </form>
  );
}
