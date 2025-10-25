"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BookCard from "@/components/shared/BookCard";
import Pagination from "@/components/shared/Pagination";
import { userAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, Clock } from "lucide-react";

// Status configuration
const STATUS_CONFIG = {
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle,
    color: "green",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    description: "Books you've finished reading",
  },
  READING: {
    label: "Currently Reading",
    icon: BookOpen,
    color: "blue",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    description: "Books you're reading right now",
  },
  WANT: {
    label: "Want to Read",
    icon: Clock,
    color: "orange",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    description: "Books you want to read in the future",
  },
};

export default function BooksByStatusPage() {
  const params = useParams();
  const router = useRouter();
  const status = params.status?.toUpperCase();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 20;

  // Validate status
  const statusConfig = STATUS_CONFIG[status];
  const StatusIcon = statusConfig?.icon;

  // ===== FETCH SÁCH THEO STATUS VỚI PAGINATION =====
  const fetchBooksByStatus = async (page = 1) => {
    if (!statusConfig) {
      setError("Invalid status");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📚 Fetching books with status:", status, "Page:", page);

      // Backend dùng page 0-indexed
      const backendPage = page - 1;

      // Gọi API với pagination
      const response = await userAPI.getBooksByStatus(status);
      console.log("📥 API Response:", response);

      if (response.code === 1000 && response.result) {
        const result = response.result;

        // Response có pagination structure
        setBooks(result.content || []);
        setTotalItems(result.totalElements || 0);
        setTotalPages(result.totalPages || 1);
      } else if (Array.isArray(response)) {
        // Fallback: response trả về array trực tiếp
        setBooks(response);
        setTotalItems(response.length);
        setTotalPages(1);
      } else {
        setBooks([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("❌ Error fetching books by status:", err);
      setError(err.response?.data?.message || "Failed to load books");
      setBooks([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLE PAGE CHANGE =====
  const handlePageChange = (page) => {
    console.log("📄 Page changed to:", page);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== FETCH KHI PAGE HOẶC STATUS THAY ĐỔI =====
  useEffect(() => {
    if (status && statusConfig) {
      setCurrentPage(1); // Reset về trang 1 khi đổi status
      fetchBooksByStatus(1);
    }
  }, [status]);

  useEffect(() => {
    if (status && statusConfig && currentPage > 1) {
      fetchBooksByStatus(currentPage);
    }
  }, [currentPage]);

  // ===== INVALID STATUS =====
  if (!statusConfig) {
    return (
      <div className="min-h-screen pt-6 bg-[#E9E7E0]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Invalid Status
            </h3>
            <p className="text-red-700 mb-4">
              Status must be one of: COMPLETED, READING, or WANT
            </p>
            <button
              onClick={() => router.push("/mybooks")}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Back to My Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="min-h-screen pt-6 bg-[#E9E7E0]">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[2/3] bg-neutral-200 rounded-sm mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error) {
    return (
      <div className="min-h-screen pt-6 bg-[#E9E7E0]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Failed to load books
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => router.push("/mybooks")}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Back to My Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 bg-[#E9E7E0]">
      {/* Header Section */}
      <div className="bg-[#F9F8F4] border border-dotted border-neutral-400 rounded-sm relative mx-auto max-w-7xl mt-[20px] mb-8">
        <div className="px-8 py-10 text-neutral-800">
          {/* Back Button */}
          <Link
            href="/mybooks"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Books</span>
          </Link>

          {/* Status Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 ${statusConfig.bgColor} rounded-lg flex items-center justify-center`}
              >
                <StatusIcon className={`w-8 h-8 ${statusConfig.iconColor}`} />
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
                  {statusConfig.label}
                </h1>
                <p className="text-neutral-600">
                  {totalItems} {totalItems === 1 ? "book" : "books"}
                  {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-neutral-600 italic">{statusConfig.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {books.length === 0 && !loading ? (
          // Empty State
          <div className="text-center py-16 bg-white rounded-lg border border-neutral-200">
            <StatusIcon className={`w-16 h-16 mx-auto text-neutral-300 mb-4`} />
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
              {`No books in "${statusConfig.label}"`}
            </h3>
            <p className="text-neutral-500 mb-6">
              {status === "READING" && "Start reading a book to see it here"}
              {status === "COMPLETED" && "Books you finish will appear here"}
              {status === "WANT" && "Add books you want to read to this list"}
            </p>
            <Link
              href="/books"
              className="px-6 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors inline-block"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
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
      </div>
    </div>
  );
}
