/**
 * app/(user)/books/[id]/page.js
 * Trang chi tiết sách - Refactored version
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Import APIs
import { booksAPI } from "@/lib/api";

// Import utilities
import { parseBookData } from "@/lib/bookDataParser";

// Import components
import { LoadingState, ErrorState } from "@/components/shared/BookDetailStates";
import BookCoverSection from "@/components/layout/user/BookCoverSection";
import BookInfoSection from "@/components/layout/user/BookInfoSection";

/**
 * Component chính - Book Detail Content
 */
function BookDetailContent() {
  const params = useParams();
  const bookId = params.id;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookDetail();
  }, [bookId]);

  const fetchBookDetail = async () => {
    if (!bookId) {
      setError("Invalid book ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📖 Fetching book detail:", bookId);

      // Gọi API backend
      const response = await booksAPI.getBookById(bookId);
      
      console.log("✅ Book data received:", response);

      setBook(response);
    } catch (err) {
      console.error("❌ Error fetching book:", err);
      
      // Xử lý error message
      let errorMessage = "Failed to load book details";
      
      if (err.response?.status === 404) {
        errorMessage = "Book not found";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !book) {
    return <ErrorState error={error} />;
  }

  // Parse book data
  const bookData = parseBookData(book);

  if (!bookData) {
    return <ErrorState error="Invalid book data" />;
  }

  // Render main content
  return (
    <div className="min-h-screen bg-[#E9E7E0]">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/books"
            className="text-neutral-600 hover:text-neutral-900 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Books</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <BookCoverSection bookData={bookData} bookId={bookId} />
            <BookInfoSection bookData={bookData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Export main page với Suspense
 */
export default function BookDetailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BookDetailContent />
    </Suspense>
  );
}