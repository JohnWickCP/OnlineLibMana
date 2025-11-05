"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { AuthContext } from "@/components/provider/AuthProvider";

export default function HeaderAdmin() {
  const router = useRouter();
  const { isAuthenticated, user, logout, loading } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setTimeout(() => {
        router.push("/admin/login");
      }, 300);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  // Khi nhấn logo/link Library: giữ href tĩnh để tránh hydration mismatch,
  // nhưng xử lý redirect ở client bằng onClick
  const handleLibraryClick = (e) => {
    // nếu người dùng bấm link, chặn hành vi mặc định và redirect theo auth
    e.preventDefault();

    // nếu auth vẫn đang load, không redirect ngay (có thể show spinner)
    if (loading) return;

    if (isAuthenticated) {
      router.push("/admin/dashboard");
    } else {
      router.push("/admin/login");
    }
  };

  return (
    <header className="bg-gray-700 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-8">
        {/* Logo: href tĩnh = "/admin" (server & client giống nhau) */}
        <Link
          href="/admin"
          onClick={handleLibraryClick}
          className="flex items-center text-white no-underline hover:opacity-80 transition"
        >
          <div className="font-bold tracking-widest text-[30px] leading-tight">
            ELIBRARY
          </div>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-6 text-white">
            <li>
              <Link
                href="/admin/books"
                className="uppercase hover:text-green-400 text-sm font-medium text-green-400 transition"
              >
                BOOKS
              </Link>
            </li>

            <li>
              <Link
                href="/admin/users"
                className="uppercase hover:text-green-400 text-sm font-medium transition"
              >
                USERS
              </Link>
            </li>

            {/* Nếu chưa đăng nhập thì hiện Login */}
            {!isAuthenticated ? (
              <li>
                <Link
                  href="/admin/login"
                  className="px-4 py-2 bg-gray-200 rounded-full text-black hover:bg-gray-300 transition font-medium"
                >
                  Login
                </Link>
              </li>
            ) : (
              // Nếu đã đăng nhập thì hiện Logout
              <li>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-full text-black hover:bg-gray-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}