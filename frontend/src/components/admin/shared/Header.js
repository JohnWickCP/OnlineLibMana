"use client";
import { useState } from "react";
import { User } from "lucide-react"; // icon user


export default function Home() {
  // Trạng thái login (demo: false = chưa đăng nhập, true = đã đăng nhập)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="min-h-screen font-sans">
      {/* Header */}
      <header className="bg-gray-700 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
          {/* Logo */}
          <a href="#" className="flex items-center text-white no-underline">
            <div className="font-bold tracking-widest text-lg leading-tight">
              ELIBRARY
            </div>
          </a>

          {/* Navigation */}
          <nav>
            <ul className="flex items-center space-x-6 text-white">
              <li>
                <a
                  href="#"
                  className="uppercase hover:text-green-400 text-sm font-medium text-green-400"
                >
                  BOOKS
                </a>
              </li>

              {!isLoggedIn ? (
                <>
                  <li>
                    <a
                      href="#"
                      className="uppercase hover:text-green-400 text-sm font-medium"
                      onClick={() => setIsLoggedIn(true)} // Demo login
                    >
                      Users
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="px-5 py-2 rounded-full bg-gray-200 text-black font-medium hover:bg-gray-300 transition"
                      onClick={() => setIsLoggedIn(true)} // Demo sign in
                    >
                      Sign In
                    </a>
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
    </main>
  );
}
