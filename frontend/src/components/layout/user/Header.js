"use client";

import { useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import SearchBar from "./SearchBar";

export default function UserHeader() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSearch = (query) => {
    if (query.trim()) {
      router.push(`/books?search=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  console.log("isAuthenticated:", isAuthenticated);

  return (
    <header className="bg-gray-700 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-10">
        {/* Logo */}
        <Link href="/books" className="flex items-center text-white no-underline">
          <div className="font-bold tracking-widest text-[30px] leading-tight">
            ELIBRARY
          </div>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-6 text-white">
            <li>
              <Link
                href="/mybooks"
                className="uppercase hover:text-green-400 text-sm font-medium text-green-400"
              >
                MyBooks
              </Link>
            </li>

            <SearchBar
              placeholder="Search books..."
              onSearch={handleSearch}
              showMenu={true}
            />

            {/* ✅ SỬA: Lật ngược logic - !isAuthenticated (chưa login) thì hiện Login/Sign In */}
            {!isAuthenticated ? (
              <>
                <li>
                  <Link
                    href="/auth/login"
                    className="uppercase hover:text-green-400 text-sm font-medium"
                  >
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="px-5 py-2 rounded-full bg-gray-200 text-black font-medium hover:bg-gray-300 transition inline-block"
                  >
                    Sign In
                  </Link>
                </li>
              </>
            ) : (
              // ✅ isAuthenticated (đã login) thì hiện Logout button
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