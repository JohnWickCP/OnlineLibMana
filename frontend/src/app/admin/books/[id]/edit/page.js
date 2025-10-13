'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BooksList from '@/components/shared/BooksList';
import { booksAPI } from '@/lib/api';

function BooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');

  // Set search input from URL on mount
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchInput(searchQuery);
    }
  }, [searchParams]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit (Enter key or button click)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`books?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push('/books');
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    router.push('/books');
  };

  const searchQuery = searchParams.get('search');

  // Determine which API function to use based on search query
  const fetchFunction = searchQuery
    ? (params) => booksAPI.searchBooks(searchQuery, params)
    : (params) => booksAPI.getBooks({ ...params, subject: 'fiction' });

  return (
    <div className="min-h-screen bg-[#E9E7E0]">
      {/* Top Controls Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Add Book Button */}
            <Link href="/books/add">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-neutral-800 rounded-lg text-sm font-medium transition-all hover:bg-neutral-800 hover:text-white">
                <span className="text-lg font-bold">+</span>
                Add new Book
              </button>
            </Link>
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
              <input 
                type="text" 
                className="w-full px-4 py-3 pr-12 border-2 border-neutral-300 rounded-lg text-sm transition-colors focus:outline-none focus:border-blue-600"
                placeholder="Search books by title or author..."
                value={searchInput}
                onChange={handleSearchChange}
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Books List Component */}
      <BooksList
        fetchFunction={fetchFunction}
        fetchParams={{}}
        showHeader={false} // Ẩn hoàn toàn phần header
        emptyMessage={
          searchQuery 
            ? `No results found for "${searchQuery}". Try different keywords.`
            : 'No books found. Try adjusting your filters or search query'
        }
        emptyActionText={searchQuery ? 'Browse all books' : 'Clear Filters'}
        onEmptyAction={searchQuery ? handleClearSearch : null}
        itemsPerPage={24}
        gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4"
        enableSort={false}
        showFilters={false}
      />
    </div>
  );
}

// Wrap BooksContent trong Suspense
export default function BooksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#E9E7E0]">
        {/* Loading Top Controls */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-12 w-40 bg-neutral-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 max-w-md h-12 bg-neutral-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-4 py-8">
            <div className="h-10 w-64 bg-neutral-200 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-96 bg-neutral-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
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