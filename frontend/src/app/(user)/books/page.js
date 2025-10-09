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
      // Lấy search query từ URL
      const searchQuery = searchParams.get('search');
      console.log('🔍 Search query from URL:', searchQuery);
      
      let response;
      
      if (searchQuery && searchQuery.trim()) {
        // Nếu có search query, dùng searchBooks API
        console.log('Using searchBooks API');
        const params = {
          limit: 24,
          page: pagination.currentPage,
        };
        console.log('📤 Search API params:', params);
        response = await booksAPI.searchBooks(searchQuery, params);
        console.log('📥 Search API response:', response);
        
        // Search API trả về { docs: [], numFound: ... }
        const booksData = response.docs || [];
        console.log('📚 Books data from search:', booksData);
        
        setBooks(booksData);
        setPagination({
          currentPage: pagination.currentPage,
          totalPages: Math.ceil((response.numFound || booksData.length) / 24),
          totalItems: response.numFound || booksData.length,
        });
      } else {
        // Không có search query, dùng getBooks API (hiển thị sách mặc định)
        console.log('Using getBooks API (default)');
        const params = {
          subject: 'fiction',
          limit: 24,
          offset: (pagination.currentPage - 1) * 24,
        };
        console.log('📤 API params:', params);
        response = await booksAPI.getBooks(params);
        console.log('📥 API response:', response);
        
        // getBooks API trả về { works: [], work_count: ... }
        const booksData = response.works || [];
        console.log('📚 Books data:', booksData);
        
        setBooks(booksData);
        setPagination({
          currentPage: pagination.currentPage,
          totalPages: Math.ceil((response.work_count || booksData.length) / 24),
          totalItems: response.work_count || booksData.length,
        });
      }
      
      console.log('✅ Books set successfully');
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

  // ⚠️ QUAN TRỌNG: useEffect để gọi fetchBooks khi component mount hoặc search params thay đổi
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

  const searchQuery = searchParams.get('search');

  return (
    <div className="min-h-screen bg-[#E9E7E0]">
      {/* Header Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Standard Ebooks'}
          </h1>
          <p className="text-neutral-600 mb-6">
            {searchQuery 
              ? `Found ${pagination.totalItems} books matching your search`
              : 'Free and liberated ebooks, carefully produced for the true book lover'
            }
          </p>
          
          {/* Results Count */}
          {!loading && (
            <div className="flex items-center justify-between">
              <p className="mt-4 text-sm text-neutral-600">
                Showing {books.length} of {pagination.totalItems} books
              </p>
              {searchQuery && (
                <a 
                  href="/books"
                  className="text-sm text-blue-600 hover:underline"
                >
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
              // Loading State
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
              // Empty State
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  No books found
                </h3>
                <p className="text-neutral-500 mb-4">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try different keywords.`
                    : 'Try adjusting your filters or search query'
                  }
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
                {/* Books Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {books.map((book, index) => (
                    <BookCard key={book.key || book.seed?.[0] || index} book={book} />
                  ))}
                </div>

                {/* Pagination */}
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

// Wrap BooksContent trong Suspense
export default function BooksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#E9E7E0]">
        <div className="bg-white border-b border-neutral-200 ">
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