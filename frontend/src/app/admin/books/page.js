"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { booksAPI } from "@/lib/api";
import { Search, Plus } from "lucide-react";
import BooksList from "@/components/shared/BooksList";

function AdminBooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  // Set search input from URL on mount
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearchInput(searchQuery);
    }
  }, [searchParams]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit (Enter key or button click)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(
        `/admin/books?search=${encodeURIComponent(searchInput.trim())}`
      );
    } else {
      router.push("/admin/books");
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    router.push("/admin/books");
  };

  const searchQuery = searchParams.get("search");

  // Fetch function gọi backend API
  const fetchFunction = async (page, size) => {
    try {
      let response;

      if (searchQuery && searchQuery.trim()) {
        // Tìm kiếm theo title
        console.log("🔍 Admin searching books:", searchQuery);
        response = await booksAPI.searchByTitle(searchQuery);

        // Search không có pagination, return tất cả results
        if (response.code === 1000 && response.result) {
          const books = response.result.content || response.result || [];
          return {
            data: books,
            total: books.length,
            totalPages: 1,
          };
        }
      } else {
        // Lấy tất cả sách với pagination
        console.log("📚 Admin fetching books - Page:", page, "Size:", size);
        response = await booksAPI.getAllBooksWithPagination(page, size);

        if (response.code === 1000 && response.result) {
          return {
            data: response.result.content || [],
            total: response.result.totalElements || 0,
            totalPages: response.result.totalPages || 1,
          };
        }
      }

      // Fallback
      return {
        data: [],
        total: 0,
        totalPages: 1,
      };
    } catch (error) {
      console.error("❌ Admin error fetching books:", error);
      return {
        data: [],
        total: 0,
        totalPages: 1,
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#E9E7E0]">
      {/* Header Section */}
      <div className="bg-[E9E7E0] border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Books Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your library collection</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Add Book Button */}
            <Link href="/admin/books/create">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#747370] text-white rounded-lg font-medium transition-all hover:bg-blue-700 shadow-sm hover:shadow-md">
                <Plus size={20} />
                <span>Add New Book</span>
              </button>
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-md relative"
            >
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search books by title or author..."
                value={searchInput}
                onChange={handleSearchChange}
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 border border-[#747370]"
                size={20}
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* Search Info */}
          {searchQuery && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span>Search results for:</span>
              <span className="font-semibold text-gray-900">
                {`"${searchQuery}"`}
              </span>
              <button
                onClick={handleClearSearch}
                className="ml-2 text-[##608075] hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Books List Component */}
      <div className="container mx-auto px-6 py-8">
        <BooksList fetchFunction={fetchFunction} searchQuery={searchQuery} />
      </div>
    </div>
  );
}

// Wrap trong Suspense
export default function AdminBooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[E9E7E0]">
          {/* Loading Header */}
          <div className="bg-[#E9E7E0] border-b border-gray-200">
            <div className="container mx-auto px-6 py-6">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="flex gap-4">
                <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 max-w-md h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Loading Content */}
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <AdminBooksContent />
    </Suspense>
  );
}
