'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import BookCard from '@/components/shared/BookCard';
import Pagination from '@/components/shared/Pagination';
import { booksAPI } from '@/lib/api';

function BooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({
    genres: [],
    sort: 'date_desc',
  });
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const searchQuery = searchParams.get('search');
      let response;

      if (searchQuery && searchQuery.trim()) {
        const params = { limit: 24, page: pagination.currentPage };
        response = await booksAPI.searchBooks(searchQuery, params);
        const booksData = response.docs || [];
        setBooks(booksData);
        setPagination({
          currentPage: pagination.currentPage,
          totalPages: Math.ceil((response.numFound || booksData.length) / 24),
          totalItems: response.numFound || booksData.length,
        });
      } else {
        const params = { subject: 'fiction', limit: 24, offset: (pagination.currentPage - 1) * 24 };
        response = await booksAPI.getBooks(params);
        const booksData = response.works || [];
        setBooks(booksData);
        setPagination({
          currentPage: pagination.currentPage,
          totalPages: Math.ceil((response.work_count || booksData.length) / 24),
          totalItems: response.work_count || booksData.length,
        });
      }
    } catch (error) {
      console.error('❌ Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [pagination.currentPage, filters.sort, searchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      router.push(`?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/books');
    }
  };

  const handleAddBook = () => {
    alert('🆕 Opening Add New Book form...');
    // router.push('/admin/books/add'); // bật dòng này nếu có trang thêm sách
  };

  const searchQuery = searchParams.get('search');

  return (
    <div className="min-h-screen bg-[#E9E7E0]">
      {/* Header Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          {/* Title + Add Button */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Standard Ebooks'}
              </h1>
              <p className="text-neutral-600">
                {searchQuery
                  ? `Found ${pagination.totalItems} books matching your search`
                  : 'Free and liberated ebooks, carefully produced for the true book lover'}
              </p>
            </div>

            {/* Add Book Button */}
            <button
              onClick={handleAddBook}
              className="flex items-center gap-2 px-4 py-2 border-2 border-neutral-800 rounded-md hover:bg-neutral-800 hover:text-white transition"
            >
              <Plus size={18} />
              Add new book
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-md mt-6">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search books by title or author..."
              className="w-full border-2 border-neutral-300 rounded-md py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Results Count */}
          {!loading && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-neutral-600">
                Showing {books.length} of {pagination.totalItems} books
              </p>
              {searchQuery && (
                <a href="/books" className="text-sm text-blue-600 hover:underline">
                  Clear search
                </a>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-x-6 gap-y-10">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[2/3] bg-neutral-200 rounded-sm mb-3"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
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
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">No books found</h3>
                <p className="text-neutral-500 mb-4">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try different keywords.`
                    : 'Try adjusting your filters or search query'}
                </p>
                {searchQuery ? (
                  <a
                    href="/books"
                    className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors inline-block"
                  >
                    Browse all books
                  </a>
                ) : (
                  <button
                    onClick={() => handleFilterChange({ genres: [], sort: 'date_desc' })}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {books.map((book, index) => (
                    <BookCard key={book.key || book.seed?.[0] || index} book={book} />
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
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

// Wrap trong Suspense
export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E9E7E0]">
          <div className="bg-white border-b border-neutral-200">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
                Browse Standard Ebooks
              </h1>
              <p className="text-neutral-600">Loading...</p>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(20)].map((_, i) => (
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
