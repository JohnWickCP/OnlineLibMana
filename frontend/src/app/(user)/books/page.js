'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookCard from '@/components/shared/BookCard';
import Pagination from '@/components/shared/Pagination';
import { booksAPI } from '@/lib/api';

function BooksContent() {
  const searchParams = useSearchParams();
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

  const fetchBooks = async () => {
    console.log('🚀 fetchBooks started');
    try {
      setLoading(true);
      const searchQuery = searchParams.get('search');
      console.log('🔍 Search query:', searchQuery);
      
      const params = {
        subject: 'fiction', // Thêm subject mặc định
        limit: 24,
        offset: (pagination.currentPage - 1) * 24,
      };

      console.log('📤 API params:', params);
      const response = await booksAPI.getBooks(params);
      console.log('📥 API response:', response);
      
      // Open Library API trả về { works: [], ... }
      const booksData = response.works || response.data || response.content || [];
      console.log('📚 Books data:', booksData);
      
      setBooks(booksData);
      setPagination({
        currentPage: pagination.currentPage,
        totalPages: Math.ceil((response.work_count || booksData.length) / 24),
        totalItems: response.work_count || booksData.length,
      });
      console.log('✅ Books set successfully, count:', booksData.length);
    } catch (error) {
      console.error('❌ Error fetching books:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setBooks([]);
    } finally {
      setLoading(false);
      console.log('🏁 fetchBooks completed');
    }
  };

  // ⚠️ QUAN TRỌNG: useEffect để gọi fetchBooks khi component mount
  useEffect(() => {
    console.log('🔄 useEffect triggered');
    fetchBooks();
  }, [pagination.currentPage, filters.sort, searchParams]); // Dependencies

  const handleFilterChange = (newFilters) => {
    console.log('🎛️ Filter changed:', newFilters);
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    console.log('📄 Page changed to:', page);
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 
  return (
    <div className="min-h-screen bg-[#E9E7E0]">
      {/* Header Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
            Browse Standard Ebooks
          </h1>
          <p className="text-neutral-600 mb-6">
            Free and liberated ebooks, carefully produced for the true book lover
          </p>
          
          {/* Results Count */}
          {!loading && (
            <p className="mt-4 text-sm text-neutral-600">
              Showing {books.length} of {pagination.totalItems} books
            </p>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                {[...Array(20)].map((_, i) => (
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
                <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  No books found
                </h3>
                <p className="text-neutral-500 mb-4">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => handleFilterChange({ genres: [], sort: 'date_desc' })}
                  className="px-4 py-2 bg-user-primary text-white rounded-md hover:bg-user-secondary transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Books Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {books.map((book, index) => (
                    <BookCard key={book.key || index} book={book} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
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
    <Suspense fallback={
      <div className="min-h-screen bg-[#E9E7E0]">
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
              Browse Standard Ebooks
            </h1>
            <p className="text-neutral-600">
              Loading...
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
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
    }>
      <BooksContent />
    </Suspense>
  );
}