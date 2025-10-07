"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { booksAPI } from "@/lib/api";

function BookDetailContent() {
  const params = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookDetail();
  }, [params.id]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      console.log("Fetching book:", params.id);

      // Lấy thông tin sách
      const response = await booksAPI.getBookById(params.id);
      console.log("Book detail:", response);
      setBook(response);
    } catch (error) {
      console.error("Error fetching book:", error);
      setError("Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9E7E0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#E9E7E0] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Book not found
          </h2>
          <Link href="/books" className="text-blue-600 hover:underline">
            ← Back to books
          </Link>
        </div>
      </div>
    );
  }

  // Xử lý dữ liệu từ Open Library API
  const title = book.title || "Untitled";
  const authors =
    book.authors?.map((a) => a.author?.key || a.key).join(", ") ||
    "Unknown Author";
  const description =
    book.description?.value || book.description || "No description available.";
  const publishDate = book.first_publish_date || book.publish_date || "Unknown";
  const publishers = book.publishers?.join(", ") || "Unknown Publisher";
  const pages = book.number_of_pages || "N/A";
  const subjects = book.subjects || [];

  // Cover image
  const coverId = book.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : "https://via.placeholder.com/400x600/e5e7eb/6b7280?text=No+Cover";

  return (
    <div className="min-h-screen bg-[#E9E7E0]">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/books"
            className="text-neutral-600 hover:text-neutral-900 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Books
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-64">
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full rounded-sm shadow-lg"
                />

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <Link
                    href={`/books/${params.id}/read`}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold block text-center"
                  >
                    Read
                  </Link>
                  <button className="w-full border-2 border-neutral-300 text-neutral-700 py-2 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    Want to Read
                  </button>
                  <button className="w-full text-neutral-600 hover:text-neutral-900 transition-colors">
                    ★ Rate this book
                  </button>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1">
              {/* Badge */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Overview
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
                {title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-neutral-600 mb-4">
                {book.subtitle || ""}
              </p>

              {/* Author */}
              <p className="text-lg mb-4">
                by{" "}
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {authors}
                </span>
              </p>

              {/* Rating & Stats */}
              <div className="flex items-center gap-6 mb-6 text-sm text-neutral-600">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★★★☆☆</span>
                  <span>3.9 (40 ratings)</span>
                </div>
                <div>· 285 Want to read</div>
                <div>· 11 Currently reading</div>
                <div>· 52 Have read</div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-neutral-700 leading-relaxed">
                  {description.length > 400
                    ? `${description.substring(0, 400)}...`
                    : description}
                </p>
              </div>

              {/* Book Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b border-neutral-200">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Publish Date</p>
                  <p className="font-semibold text-neutral-900">
                    {publishDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Publisher</p>
                  <p className="font-semibold text-neutral-900">
                    <Link href="#" className="text-blue-600 hover:underline">
                      {publishers}
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Language</p>
                  <p className="font-semibold text-neutral-900">
                    <Link href="#" className="text-blue-600 hover:underline">
                      {book.languages?.[0]?.key?.replace("/languages/", "") ||
                        "English"}
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Pages</p>
                  <p className="font-semibold text-neutral-900">{pages}</p>
                </div>
              </div>

              {/* Subjects/Tags */}
              {subjects.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                    Subjects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {subjects.slice(0, 10).map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm hover:bg-neutral-200 cursor-pointer transition-colors"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E9E7E0] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
        </div>
      }
    >
      <BookDetailContent />
    </Suspense>
  );
}
