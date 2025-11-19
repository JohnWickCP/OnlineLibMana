"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { booksAPI } from "@/lib/api";
import { Search, Plus } from "lucide-react";
import BooksList from "@/components/shared/BooksList";
import useAuth from "@/hooks/useAuth";

function AdminBooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [allowRender, setAllowRender] = useState(false);

  /**
   * AUTH CHECK — Không return sớm trước hook!
   */
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/admin/login");
        setAllowRender(false);
      } else {
        setAllowRender(true);
      }
    }
  }, [loading, isAuthenticated, router]);

  /**
   * SET SEARCH INPUT FROM URL
   */
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearchInput(searchQuery);
    }
  }, [searchParams]);

  /**
   * FETCH FUNCTION (must be stable → useCallback)
   */
  const fetchFunction = useCallback(
    async (page, size) => {
      try {
        const searchQuery = searchParams.get("search");
        let response;

        if (searchQuery && searchQuery.trim()) {
          response = await booksAPI.searchByTitle(searchQuery);

          if (response.code === 1000 && response.result) {
            const books = response.result.content || response.result || [];
            return {
              data: books,
              total: books.length,
              totalPages: 1,
            };
          }
        } else {
          response = await booksAPI.getAllBooksWithPagination(page, size);

          if (response.code === 1000 && response.result) {
            return {
              data: response.result.content || [],
              total: response.result.totalElements || 0,
              totalPages: response.result.totalPages || 1,
            };
          }
        }

        return { data: [], total: 0, totalPages: 1 };
      } catch (error) {
        console.error("❌ Admin error fetching books:", error);
        return { data: [], total: 0, totalPages: 1 };
      }
    },
    [searchParams]
  );

  /**
   * STILL LOADING AUTH → SHOW SKELETON
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9E7E0]">
        <div className="container mx-auto px-6 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        </div>
      </div>
    );
  }

  /**
   * AUTH FAIL → DON'T RENDER ANYTHING
   */
  if (!allowRender) return null;

  const searchQuery = searchParams.get("search");

  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/admin/books?search=${encodeURIComponent(searchInput)}`);
    } else {
      router.push("/admin/books");
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    router.push("/admin/books");
  };

  return (
    <div className="min-h-screen bg-[#E9E7E0]">
      {/* Header Section */}
      <div className="bg-[E9E7E0] border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Books Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your library collection</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/admin/books/create">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#747370] text-white rounded-lg font-medium transition-all hover:bg-blue-700 shadow-sm hover:shadow-md">
                <Plus size={20} />
                <span>Add New Book</span>
              </button>
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-md relative"
            >
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search books by title or author..."
                value={searchInput}
                onChange={handleSearchChange}
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {searchQuery && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span>Search results for:</span>
              <span className="font-semibold text-gray-900">
                {`"${searchQuery}"`}
              </span>
              <button
                onClick={handleClearSearch}
                className="ml-2 text-[#608075] hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Books List */}
      <div className="container mx-auto px-6 py-8">
        <BooksList fetchFunction={fetchFunction} searchQuery={searchQuery} />
      </div>
    </div>
  );
}

/**
 * PAGE WRAPPED INSIDE SUSPENSE
 */
export default function AdminBooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E9E7E0]">
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

          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
