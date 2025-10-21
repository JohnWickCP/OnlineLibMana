"use client";

import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { AuthContext } from "@/components/provider/AuthProvider";

export default function HeaderAdmin() {
  const router = useRouter();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Xóa token, user info trong localStorage, set auth = false
    router.push("/admin/login"); // Chuyển hướng về trang login admin
  };

  return (
    <header className="bg-gray-700 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-8">
        {/* Logo */}
        <Link
          href="/admin/books"
          className="flex items-center text-white no-underline"
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
                className="uppercase hover:text-green-400 text-sm font-medium text-green-400"
              >
                BOOKS
              </Link>
            </li>

            <li>
              <Link
                href="/admin/users"
                className="uppercase hover:text-green-400 text-sm font-medium"
              >
                USERS
              </Link>
            </li>

            {/* Logout button hiển thị nếu đã đăng nhập */}
            {isAuthenticated && (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-full text-black hover:bg-gray-300 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
