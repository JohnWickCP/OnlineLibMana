/**
 * hooks/useBooks.js
 * Custom hooks để quản lý sách
 * - Fetch danh sách sách
 * - Fetch chi tiết sách
 * - Search sách
 * - Get rating
 */

import { useState, useEffect } from 'react';
import { booksAPI } from '@/lib/api';

/**
 * useBooks Hook
 * Lấy danh sách tất cả sách từ backend
 * 
 * @returns {Object} { books, loading, error, refetch }
 * 
 * @example
 * const { books, loading, error } = useBooks();
 */
export const useBooks = () => {
  // State lưu danh sách sách
  const [books, setBooks] = useState([]);
  
  // State loading
  const [loading, setLoading] = useState(true);
  
  // State lỗi
  const [error, setError] = useState(null);

  /**
   * Hàm fetch danh sách sách
   */
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📚 Đang tải danh sách sách...');
      
      // Gọi API lấy tất cả sách
      const response = await booksAPI.getAllBooks();
      
      // Response có thể là array hoặc object
      const booksData = Array.isArray(response) 
        ? response 
        : response.data || response.content || [];
      
      setBooks(booksData);
      console.log('✅ Đã tải', booksData.length, 'cuốn sách');
    } catch (err) {
      console.error('❌ Lỗi khi tải sách:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách sách');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hàm refetch - tải lại danh sách
   */
  const refetch = () => {
    fetchBooks();
  };

  // Tự động fetch khi component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,      // Danh sách sách
    loading,    // Trạng thái loading
    error,      // Thông báo lỗi
    refetch,    // Hàm reload
  };
};

/**
 * useBookDetail Hook
 * Lấy chi tiết một cuốn sách và rating của nó
 * 
 * @param {string|number} bookId - ID của sách
 * @returns {Object} { book, rating, loading, error, refetch }
 * 
 * @example
 * const { book, rating, loading } = useBookDetail(bookId);
 */
export const useBookDetail = (bookId) => {
  // State lưu thông tin sách
  const [book, setBook] = useState(null);
  
  // State lưu rating
  const [rating, setRating] = useState(null);
  
  // State loading
  const [loading, setLoading] = useState(true);
  
  // State lỗi
  const [error, setError] = useState(null);

  /**
   * Hàm fetch chi tiết sách
   */
  const fetchBook = async () => {
    // Nếu không có bookId thì không fetch
    if (!bookId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('📖 Đang tải chi tiết sách:', bookId);
      
      // Fetch book detail và rating song song (parallel)
      const [bookData, ratingData] = await Promise.all([
        booksAPI.getBookById(bookId),
        booksAPI.getBookRating(bookId).catch(() => null), // Rating có thể không có, không throw error
      ]);

      setBook(bookData);
      setRating(ratingData);
      console.log('✅ Đã tải chi tiết sách');
    } catch (err) {
      console.error('❌ Lỗi khi tải chi tiết sách:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải thông tin sách');
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hàm refetch
   */
  const refetch = () => {
    fetchBook();
  };

  // Tự động fetch khi bookId thay đổi
  useEffect(() => {
    fetchBook();
  }, [bookId]);

  return {
    book,       // Thông tin sách
    rating,     // Rating của sách
    loading,    // Trạng thái loading
    error,      // Thông báo lỗi
    refetch,    // Hàm reload
  };
};

/**
 * useBookSearch Hook
 * Tìm kiếm sách theo title với debounce
 * 
 * @param {string} query - Từ khóa tìm kiếm
 * @param {Object} options - { enabled: boolean, delay: number }
 * @returns {Object} { results, loading, error }
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const { results, loading } = useBookSearch(searchTerm);
 */
export const useBookSearch = (query, options = {}) => {
  const { enabled = true, delay = 500 } = options;
  
  // State lưu kết quả tìm kiếm
  const [results, setResults] = useState([]);
  
  // State loading
  const [loading, setLoading] = useState(false);
  
  // State lỗi
  const [error, setError] = useState(null);

  useEffect(() => {
    // Không search nếu disabled hoặc query rỗng
    if (!enabled || !query || query.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Debounce search - đợi user ngừng gõ
    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Đang tìm kiếm sách:', query);
        
        // Gọi API search
        const response = await booksAPI.searchByTitle(query);
        
        // Response có thể là array hoặc object
        const resultsData = Array.isArray(response) 
          ? response 
          : response.data || [];
        
        setResults(resultsData);
        console.log('✅ Tìm thấy', resultsData.length, 'cuốn sách');
      } catch (err) {
        console.error('❌ Lỗi khi tìm kiếm:', err);
        setError(err.response?.data?.message || err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);

    // Cleanup timeout khi query thay đổi hoặc component unmount
    return () => clearTimeout(timeoutId);
  }, [query, enabled, delay]);

  return {
    results,    // Kết quả tìm kiếm
    loading,    // Trạng thái loading
    error,      // Thông báo lỗi
  };
};

export default useBooks;