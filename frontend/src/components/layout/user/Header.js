"use client";
import { useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SearchBar from "./SearchBar";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleSearch = (query) => {
    if (query.trim()) {
      // Redirect đến trang books với search query
      router.push(`/books?search=${encodeURIComponent(query)}`);
    }
  };

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
                href="/books"
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

            {/* Nếu chưa đăng nhập thì hiện Login + Sign In */}
            {!isLoggedIn ? (
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
              // Nếu đã đăng nhập thì chỉ hiện biểu tượng user
              <li>
                <button 
                  onClick={() => setIsLoggedIn(false)}
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