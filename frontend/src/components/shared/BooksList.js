"use client";

import { useState, useEffect } from "react";
import BookCard from "@/components/shared/BookCard";
import Pagination from "@/components/shared/Pagination";
import { Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BooksList({ fetchFunction, searchQuery }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 24;

  // Fetch books khi page hoặc search thay đổi
  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage, searchQuery]);

  const fetchBooks = async (page) => {
    try {
      setLoading(true);
      console.log("📚 Fetching books - Page:", page);

      // Backend dùng 0-indexed
      const backendPage = page - 1;
      
      const result = await fetchFunction(backendPage, ITEMS_PER_PAGE);
      
      setBooks(result.data || []);
      setTotalItems(result.total || 0);
      setTotalPages(result.totalPages || Math.ceil(result.total / ITEMS_PER_PAGE));
      
      console.log("✅ Books loaded:", result.data?.length);
    } catch (error) {
      console.error("❌ Error loading books:", error);
      setBooks([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading State
  if (loading) {
    return (
      <div>
        {/* Header Info */}
        <div className="bg-[#E9E7E0] border border-dotted border-neutral-400 rounded-sm relative mx-auto max-w-7xl mt-[20px] mb-8">
          <div className="text-center px-8 py-10">
            <div className="h-10 w-96 bg-neutral-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-64 bg-neutral-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>

        {/* Loading Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-neutral-200 rounded-sm mb-3"></div>
              <div className="h-4 bg-neutral-200 rounded mb-2"></div>
              <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      

      {/* Main Content */}
      {books.length === 0 ? (
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
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors"
            >
              Refresh
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Books Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <BookCard key={book.id || index} book={book} />
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
    </>
  );
}