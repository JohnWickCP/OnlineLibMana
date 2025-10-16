"use client";
import { useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div className="min-h-auto font-sans">
      {/* Header */}
      <header className="bg-gray-700 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-8">
          {/* Logo */}
          <Link href="/admin/books" className="flex items-center text-white no-underline">
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

              {!isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/admin/users"
                      className="uppercase hover:text-green-400 text-sm font-medium"
                    >
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="px-5 py-2 rounded-full bg-gray-200 text-black font-medium hover:bg-gray-300 transition"
                    >
                      Sign In
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-full text-black hover:bg-gray-300 transition">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
