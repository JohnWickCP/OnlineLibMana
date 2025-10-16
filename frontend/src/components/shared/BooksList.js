'use client';

import { useState, useEffect, useCallback } from 'react';
import BookCard from '@/components/shared/BookCard';
import Pagination from '@/components/shared/Pagination';
import { booksAPI } from '@/lib/api';

export default function BooksList({
  fetchFunction,
  fetchParams = {},
  title = 'Books',
  description = '',
  emptyMessage = 'No books found',
  emptyActionText = 'Browse all books',
  onEmptyAction = null,
  itemsPerPage = 24,
  showFilters = false,
  filterOptions = [],
  gridCols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  enableSort = false,
  sortOptions = [],
  className = '',
  showHeader = true,
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({
    sort: sortOptions[0]?.value || 'date_desc',
  });

  // ✅ Sửa: Wrap fetchBooks với useCallback
  const fetchBooks = useCallback(async () => {
    console.log('🚀 fetchBooks started');
    try {
      setLoading(true);
      
      // Combine params
      const params = {
        ...fetchParams,
        limit: itemsPerPage,
        offset: (pagination.currentPage - 1) * itemsPerPage,
        page: pagination.currentPage,
        ...(enableSort && { sort: filters.sort }),
      };
      
      console.log('📤 API params:', params);
      const response = await fetchFunction(params);
      console.log('📥 API response:', response);
      
      // Handle different response formats
      let booksData = [];
      let totalCount = 0;
      
      if (response.docs) {
        // Search API format
        booksData = response.docs;
        totalCount = response.numFound || booksData.length;
      } else if (response.works) {
        // Works API format
        booksData = response.works;
        totalCount = response.work_count || booksData.length;
      } else if (Array.isArray(response)) {
        // Direct array format
        booksData = response;
        totalCount = response.length;
      } else if (response.data) {
        // Backend API format
        booksData = response.data;
        totalCount = response.total || booksData.length;
      }
      
      console.log('📚 Books data:', booksData);
      
      setBooks(booksData);
      setPagination({
        currentPage: pagination.currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
        totalItems: totalCount,
      });
      
      console.log('✅ Books set successfully');
    } catch (error) {
      console.error('❌ Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, fetchParams, itemsPerPage, pagination.currentPage, enableSort, filters.sort]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#E9E7E0] ${className}`}>
      {/* Header Section */}
      {showHeader && (
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-neutral-600 mb-6">{description}</p>
            )}
            
            {/* Filters & Sort */}
            {(showFilters || enableSort) && (
              <div className="flex flex-wrap gap-4 items-center">
                {/* Filters */}
                {showFilters && filterOptions.length > 0 && (
                  <div className="flex gap-2">
                    {filterOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange({ [option.key]: option.value })}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          filters[option.key] === option.value
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Sort */}
                {enableSort && sortOptions.length > 0 && (
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange({ sort: e.target.value })}
                    className="px-4 py-2 border border-neutral-300 rounded-md bg-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
            
            {/* Results Count */}
            {!loading && (
              <p className="mt-4 text-sm text-neutral-600">
                Showing {books.length} of {pagination.totalItems} books
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          // Loading State
          <div className={`grid ${gridCols} gap-6`}>
            {[...Array(itemsPerPage)].map((_, i) => (
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
              {emptyMessage}
            </h3>
            {emptyActionText && (
              <button
                onClick={onEmptyAction || (() => window.location.href = '/books')}
                className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors"
              >
                {emptyActionText}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className={`grid ${gridCols} gap-6`}>
              {books.map((book, index) => (
                <BookCard 
                  key={book.key || book.id || book.seed?.[0] || index} 
                  book={book} 
                />
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
      </div>
    </div>
  );
}