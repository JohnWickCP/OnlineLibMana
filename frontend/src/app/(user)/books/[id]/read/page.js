'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { booksAPI } from '@/lib/api';

function ReadBookContent() {
  const params = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    fetchBookInfo();
  }, [params.id]);

  useEffect(() => {
    // Countdown timer
    if (countdown > 0 && !isRedirecting) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isRedirecting) {
      handleRedirect();
    }
  }, [countdown, isRedirecting]);

  const fetchBookInfo = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getBookById(params.id);
      setBook(response);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    setIsRedirecting(true);
    // Construct Standard Ebooks URL
    const bookSlug = book?.title?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'book';
    const authorSlug = book?.authors?.[0]?.author?.key?.split('/').pop() || 'author';
    
    // Standard Ebooks format: https://standardebooks.org/ebooks/author/book-title/text/single-page
    const readUrl = `https://standardebooks.org/ebooks/${authorSlug}/${bookSlug}/text/single-page`;
    
    window.location.href = readUrl;
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ed] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ed] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-12">
        {/* Title */}
        <h1 className="text-3xl font-serif text-neutral-700 mb-8">
          You are being redirected to your book
        </h1>

        {/* Book Info */}
        <div className="mb-6">
          <p className="text-neutral-600 text-lg">
            This book is provided by{' '}
            <span className="font-semibold text-neutral-900">Standard Ebooks</span>
            , a third-party Open Library Trusted Book Provider
          </p>
        </div>

        {/* Countdown */}
        <div className="mb-8">
          <p className="text-neutral-600">
            In <span className="font-semibold text-neutral-900">{countdown}</span> seconds, 
            you will be automatically redirected to:{' '}
            <a 
              href="#"
              className="text-blue-600 hover:underline break-all"
              onClick={(e) => {
                e.preventDefault();
                handleRedirect();
              }}
            >
              https://standardebooks.org/ebooks/{book?.title?.toLowerCase().replace(/\s+/g, '-')}/text/single-page
            </a>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="text-blue-600 hover:underline font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleRedirect}
            className="text-blue-600 hover:underline font-medium"
          >
            Continue without waiting
          </button>
        </div>

        {/* Book Title (Optional) */}
        {book && (
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-500">Reading:</p>
            <p className="text-lg font-serif font-semibold text-neutral-900 mt-1">
              {book.title}
            </p>
            {book.authors && book.authors.length > 0 && (
              <p className="text-neutral-600 mt-1">
                by {book.authors.map(a => a.author?.key || a.key).join(', ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReadBookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f3ed] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    }>
      <ReadBookContent />
    </Suspense>
  );
}