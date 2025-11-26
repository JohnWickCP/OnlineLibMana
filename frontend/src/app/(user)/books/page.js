"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BookCard from "@/components/shared/BookCard";
import Pagination from "@/components/shared/Pagination";
import { booksAPI } from "@/lib/api";
import Link from "next/link";

function BooksContent() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 24;
  
  const [filters, setFilters] = useState({
    genres: [],
    sort: "date_desc",
  });

  // ===== FETCH SÁCH VỚI PAGINATION =====
  const fetchBooks = async (page = 1) => {
    console.log("🚀 fetchBooks started - Page:", page);
    try {
      setLoading(true);
      const searchQuery = searchParams.get("search");
      console.log("🔍 Search query from URL:", searchQuery);

      let response;
      let booksData = [];
      let total = 0;
      let pages = 1;

      if (searchQuery && searchQuery.trim()) {
        // ===== TÌM KIẾM (Chưa có pagination cho search) =====
        console.log("📖 Using searchByTitle API with query:", searchQuery);
        response = await booksAPI.searchByTitle(searchQuery);
        console.log("📥 Search API response:", response);

        if (response.code === 1000 && response.result) {
          booksData = response.result.content || response.result || [];
          total = booksData.length;
          pages = 1;
        } else if (response.data) {
          booksData = Array.isArray(response.data) ? response.data : [response.data];
          total = booksData.length;
          pages = 1;
        } else if (Array.isArray(response)) {
          booksData = response;
          total = booksData.length;
          pages = 1;
        }
      } else {
        // ===== LẤY TẤT CẢ SÁCH VỚI PAGINATION =====
        console.log("📚 Using getAllBooks API with pagination");
        
        // Backend dùng page 0-indexed, frontend dùng 1-indexed
        const backendPage = page - 1;
        
        response = await booksAPI.getAllBooksWithPagination(backendPage, ITEMS_PER_PAGE);
        console.log("📥 GetAll API response:", response);

        if (response.code === 1000 && response.result) {
          // Response format từ backend:
          // {
          //   content: [...],
          //   totalElements: 100,
          //   totalPages: 50,
          //   ...
          // }
          const result = response.result;
          booksData = result.content || [];
          total = result.totalElements || 0;
          pages = result.totalPages || 1;
        } else if (response.data) {
          booksData = Array.isArray(response.data) ? response.data : [];
          total = booksData.length;
          pages = Math.ceil(total / ITEMS_PER_PAGE);
        } else if (Array.isArray(response)) {
          booksData = response;
          total = booksData.length;
          pages = Math.ceil(total / ITEMS_PER_PAGE);
        }
      }

      console.log("📊 Processed data:", {
        booksCount: booksData.length,
        totalItems: total,
        totalPages: pages,
        currentPage: page
      });

      setBooks(booksData);
      setTotalItems(total);
      setTotalPages(pages);

      console.log("✅ Books loaded successfully");
    } catch (error) {
      console.error("❌ Error fetching books:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setBooks([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH KHI PAGE HOẶC SEARCH THAY ĐỔI =====
  useEffect(() => {
    console.log("🔄 useEffect triggered - fetching books...");
    fetchBooks(currentPage);
  }, [currentPage, filters.sort, searchParams]);

  const handleFilterChange = (newFilters) => {
    console.log("🎛️ Filter changed:", newFilters);
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    console.log("📄 Page changed to:", page);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const searchQuery = searchParams.get("search");

  return (
    <div className="min-h-screen pt-6 bg-[#E9E7E0]">
      {/* Header Section */}
      <div className="bg-[#F9F8F4] border border-dotted border-neutral-400 rounded-sm relative mx-auto max-w-7xl mt-[20px] mb-8">
        <div className="text-center px-8 py-10 text-neutral-800">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Browse Standard Ebooks"}
          </h1>

          <p className="text-neutral-600 mb-6">
            {searchQuery
              ? `Found ${totalItems} books matching your search`
              : "Free and liberated ebooks, carefully produced for the true book lover"}
          </p>

          {/* Results Count */}
          {!loading && (
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-neutral-600">
              <p className="mt-2">
                Showing {books.length} of {totalItems} books
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </p>
              {searchQuery && (
                <Link
                  href="/books"
                  className="mt-2 text-blue-700 underline hover:text-blue-900"
                >
                  Clear search
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Books Grid */}
          <main className="flex-1">
            {loading ? (
              // Loading State
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-x-6 gap-y-10">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[2/3] bg-neutral-200 rounded-sm mb-3"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
              // Empty State
              <div className="text-center py-16">
                <svg
                  className="w-16 h-16 mx-auto text-neutral-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  No books found
                </h3>
                <p className="text-neutral-500 mb-4">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try different keywords.`
                    : "Try adjusting your filters or search query"}
                </p>
                {searchQuery ? (
                  <Link
                    href="/books"
                    className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors inline-block"
                  >
                    Browse all books
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      handleFilterChange({ genres: [], sort: "date_desc" })
                    }
                    className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Books Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {books.map((book, index) => (
                    <BookCard
                      key={book.id || index}
                      book={book}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Wrap BooksContent trong Suspense
export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E9E7E0]">
          <div className="bg-white border-b border-neutral-200">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
                Browse Elib
              </h1>
              <p className="text-neutral-600">Loading...</p>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-neutral-200 rounded-sm mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}