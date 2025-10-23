"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import BookCard from "@/components/shared/BookCard";
import Pagination from "@/components/shared/Pagination";
import { userAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { ArrowLeft, Book, Loader2, Trash2 } from "lucide-react";

function FavoriteListContent() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const listId = params.id;

  const [folderInfo, setFolderInfo] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  // Redirect nếu chưa login
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Fetch folder info và books
  useEffect(() => {
    if (isAuthenticated && listId) {
      fetchFolderData();
    }
  }, [isAuthenticated, listId]);

  const fetchFolderData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📁 Fetching folder data:", listId);

      // Gọi API lấy folder info và books
      const response = await userAPI.getFolderById(listId);
      console.log("📥 Folder response:", response);

      // Parse response
      if (response.code === 1000 && response.result) {
        const folderData = response.result;
        
        setFolderInfo({
          id: folderData.id || listId,
          title: folderData.title || "My List",
          description: folderData.description || "",
          bookCount: folderData.books?.length || 0,
        });

        setBooks(folderData.books || []);
      } else if (response.data) {
        setFolderInfo({
          id: listId,
          title: response.data.title || "My List",
          description: response.data.description || "",
          bookCount: response.data.books?.length || 0,
        });
        setBooks(response.data.books || []);
      }

      console.log("✅ Folder data loaded");
    } catch (err) {
      console.error("❌ Error fetching folder:", err);
      
      if (err.response?.status === 404) {
        setError("List not found");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view this list");
      } else {
        setError("Failed to load list. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle remove book from list
  const handleRemoveBook = async (bookId) => {
    if (!confirm("Remove this book from the list?")) return;

    try {
      console.log("🗑️ Removing book:", bookId);
      
      // TODO: Gọi API remove book khi backend có endpoint
      // await userAPI.removeBookFromFolder(listId, bookId);
      
      // Tạm thời remove từ state
      setBooks(prev => prev.filter(book => book.id !== bookId));
      setFolderInfo(prev => ({
        ...prev,
        bookCount: prev.bookCount - 1
      }));

      alert("✅ Book removed from list");
    } catch (err) {
      console.error("❌ Error removing book:", err);
      alert("❌ Failed to remove book");
    }
  };

  // Pagination
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayBooks = books.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9E7E0] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-neutral-600">Loading your list...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#E9E7E0] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            {error}
          </h2>
          <Link
            href="/mybooks"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to My Lists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 bg-[#E9E7E0]">
      {/* Header Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/mybooks"
            className="text-neutral-600 hover:text-neutral-900 flex items-center gap-2 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to My Lists</span>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
                {folderInfo?.title}
              </h1>
              
              {folderInfo?.description && (
                <p className="text-neutral-600 mb-4 max-w-2xl">
                  {folderInfo.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Book size={16} />
                  <span>{folderInfo?.bookCount} book{folderInfo?.bookCount !== 1 ? 's' : ''}</span>
                </div>
                {totalPages > 1 && (
                  <span>• Page {currentPage} of {totalPages}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {books.length === 0 ? (
          // Empty State
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Book className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
              No books in this list yet
            </h3>
            <p className="text-neutral-500 mb-6">
              Start adding books to organize your reading collection
            </p>
            <Link
              href="/books"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {displayBooks.map((book, index) => (
                <div key={book.id || index} className="relative group">
                  <BookCard book={book} />
                  
                  {/* Remove Button - Hiện khi hover */}
                  <button
                    onClick={() => handleRemoveBook(book.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    title="Remove from list"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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

// Wrap trong Suspense
export default function FavoriteListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E9E7E0] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
            <p className="text-neutral-600">Loading...</p>
          </div>
        </div>
      }
    >
      <FavoriteListContent />
    </Suspense>
  );
}