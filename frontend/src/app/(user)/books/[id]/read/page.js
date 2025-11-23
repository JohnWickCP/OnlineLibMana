'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { booksAPI } from '@/lib/api';

function ReadBookContent() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookInfo();
  }, [id]);

  const fetchBookInfo = async () => {
    try {
      setLoading(true);
      const res = await booksAPI.getBookById(id);
      console.log('✅ Fetched book info:', res);
      setBook(res.result);
    } catch (err) {
      console.error('❌ Error fetching book info:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔥 Convert link Gutenberg → link HTML online readable
   * Ví dụ:
   * Input:  https://www.gutenberg.org/ebooks/2489.epub.images
   * Output: https://www.gutenberg.org/cache/epub/2489/pg2489-images.html
   */
  const convertToGutenbergHtml = (url) => {
    if (!url) return null;

    // Lấy ID sách từ URL
    const match = url.match(/\/(\d+)[^/]*$/);
    const bookId = match ? match[1] : null;
    if (!bookId) return null;

    return `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}-images.html`;
  };

  const buildFallbackUrl = () => {
    const titleSlug =
      book?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      'book';

    const authorSlug =
      book?.author
        ?.toLowerCase()
        .split(' ')[0]
        .replace(/[^a-z0-9]+/g, '') || 'author';

    return `https://standardebooks.org/ebooks/${authorSlug}/${titleSlug}/text/single-page`;
  };

  // Build target URL
  const buildTargetUrl = () => {
    if (book?.fileUrl) {
      const gutenbergHtml = convertToGutenbergHtml(book.fileUrl);
      if (gutenbergHtml) return gutenbergHtml;
      return book.fileUrl;
    }
    return buildFallbackUrl();
  };

  const handleRedirect = () => {
    const targetUrl = buildTargetUrl();
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ed] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-700">
        <p>Book not found.</p>
      </div>
    );
  }

  const targetUrl = buildTargetUrl();

  return (
    <div className="min-h-screen bg-[#f5f3ed] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-10 text-center">
        <h1 className="text-3xl font-serif text-neutral-800 mb-6">
          Ready to read your book
        </h1>

        <p className="text-neutral-600 text-lg mb-4">
          This book is provided by{' '}
          <span className="font-semibold text-neutral-900">
            {book.fileUrl ? 'Project Gutenberg' : 'Standard Ebooks'}
          </span>
          .
        </p>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {targetUrl}
        </a>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRedirect}
            className="bg-[#608075] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[#4a635c] transition-colors"
          >
            Read now
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 text-left">
          <p className="text-sm text-neutral-500">Reading:</p>
          <p className="text-lg font-serif font-semibold text-neutral-900 mt-1">
            {book.title}
          </p>
          {book.author && (
            <p className="text-neutral-600 mt-1">by {book.author}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReadBookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f3ed] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
        </div>
      }
    >
      <ReadBookContent />
    </Suspense>
  );
}
