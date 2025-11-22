"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/InputLogin";
import Link from "next/link";

export default function AdminLoginForm() {
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

  // helper: poll for cookie presence up to timeoutMs
  const waitForCookie = (name, timeoutMs = 2000) =>
    new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        if (typeof document !== "undefined" && document.cookie.includes(`${name}=`)) {
          resolve(true);
        } else if (Date.now() - start > timeoutMs) {
          resolve(false);
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await authLogin(formData.email, formData.password);

      // --- WAIT for auth cookie to be present (avoid race with middleware) ---
      // If your backend sets HttpOnly cookie, ensure authAPI.login sets that cookie.
      // We poll for 'auth_token' which AuthProvider previously sets client-side.
      await waitForCookie("auth_token", 2000);

      // then navigate
      router.push("/admin/books");
    } catch (err) {
      const status = err?.response?.status;
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;

      if (status === 401) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.");
      } else if (status === 404) {
        setError("Tài khoản không tồn tại");
      } else if (err?.code === "ECONNABORTED") {
        setError("Kết nối timeout, vui lòng thử lại");
      } else if (apiMessage) {
        setError(String(apiMessage));
      } else if (err?.message) {
        setError(String(err.message));
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại");
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