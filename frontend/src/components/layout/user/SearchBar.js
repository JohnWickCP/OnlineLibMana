"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";



// Icon Search tự vẽ bằng SVG
function SearchIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );
}

export default function SearchBar({
  placeholder = "Search books by title, author, or ISBN...",
  onSearch,
  showMenu = true,
  className = "",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (onSearch) {
        // Nếu có prop onSearch, dùng nó
        onSearch(searchQuery);
      } else {
        // Redirect đến trang books với query parameter
        router.push(`/books?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center bg-gray-100 rounded-full px-4 h-10 transition-all ${
          isFocused
            ? "ring-2 ring-inset ring-green-400 bg-white shadow-md"
            : "hover:bg-gray-200"
        }`}
      >
        

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-sm"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-300 rounded-full transition-colors mr-1 flex items-center justify-center"
            aria-label="Clear"
          >
            <span className="text-gray-600 text-lg">×</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleSearch}
          className="p-1 hover:bg-gray-300 rounded-full transition-colors ml-2 flex items-center justify-center"
          aria-label="Search"
        >
          <SearchIcon size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
