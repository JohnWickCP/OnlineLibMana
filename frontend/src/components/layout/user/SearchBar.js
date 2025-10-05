"use client"
import React, { useState } from 'react';

// Icon Menu tự vẽ bằng SVG
function MenuIcon({ size = 20, className = "" }) {
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
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
}

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
  placeholder = "Search books...",
  onSearch,
  showMenu = true,
  className = ""
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      console.log('Tìm kiếm:', searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`flex items-center bg-gray-100 rounded-full px-4 py-2.5 transition-all ${
          isFocused ? 'ring-2 ring-green-400 bg-white shadow-md' : 'hover:bg-gray-200'
        }`}
      >
        {showMenu && (
          <button 
            type="button"
            className="p-1 hover:bg-gray-300 rounded-full transition-colors mr-3 flex items-center justify-center"
            aria-label="Menu"
          >
            <MenuIcon size={18} className="text-gray-600" />
          </button>
        )}

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

        <button
          type="button"
          onClick={handleSearch}
          className="p-1 hover:bg-gray-300 rounded-full transition-colors ml-2 flex items-center justify-center"
          aria-label="Tìm kiếm"
        >
          <SearchIcon size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Demo kết quả tìm kiếm */}
      {searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <p className="text-sm text-gray-600">
            Đang tìm kiếm: <span className="font-semibold text-gray-800">{searchQuery}</span>
          </p>
        </div>
      )}
    </div>
  );
}