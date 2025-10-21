/**
 * hooks/useBookshelf.js
 * Custom hook để quản lý kệ sách cá nhân (bookshelf)
 * - Lấy sách theo trạng thái (reading, want_to_read, finished)
 * - Thêm sách vào kệ
 * - Xóa sách khỏi kệ
 * - Thống kê
 */

import { useState, useEffect, useCallback } from 'react';
import { userAPI } from '@/lib/api';

/**
 * useBookshelf Hook
 * Quản lý tất cả các kệ sách của user
 * 
 * @returns {Object} {
 *   shelves: { read, reading, wantToRead },
 *   statistics: { totalRead, totalReading, totalWantToRead },
 *   loading,
 *   error,
 *   refresh,
 *   addToShelf,
 *   removeFromShelf
 * }
 * 
 * @example
 * const { shelves, loading, addToShelf } = useBookshelf();
 */
export const useBookshelf = () => {
  // ===== STATE =====
  // State lưu các kệ sách
  const [shelves, setShelves] = useState({
    read: [],         // Đã đọc xong (finished)
    reading: [],      // Đang đọc (reading)
    wantToRead: [],   // Muốn đọc (want_to_read)
  });
  
  // State loading
  const [loading, setLoading] = useState(true);
  
  // State lỗi
  const [error, setError] = useState(null);
  
  // State refreshing (không show loading khi refresh)
  const [refreshing, setRefreshing] = useState(false);

  /**
   * ===== FETCH TẤT CẢ CÁC KỆ SÁCH =====
   * Gọi API lấy sách theo 3 trạng thái
   */
  const fetchAllShelves = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📚 Đang tải các kệ sách...');
      
      // Gọi song song 3 API để lấy sách theo trạng thái
      const [finishedBooks, readingBooks, wantToReadBooks] = await Promise.all([
        userAPI.getBooksByStatus('finished'),
        userAPI.getBooksByStatus('reading'),
        userAPI.getBooksByStatus('want_to_read'),
      ]);
      
      // Cập nhật state
      setShelves({
        read: finishedBooks || [],
        reading: readingBooks || [],
        wantToRead: wantToReadBooks || [],
      });
      
      console.log('✅ Đã tải các kệ sách:', {
        read: finishedBooks?.length || 0,
        reading: readingBooks?.length || 0,
        wantToRead: wantToReadBooks?.length || 0,
      });
    } catch (err) {
      console.error('❌ Lỗi khi tải kệ sách:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải kệ sách');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ===== REFRESH =====
   * Tải lại dữ liệu (không show loading spinner)
   */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllShelves();
    setRefreshing(false);
  }, [fetchAllShelves]);

  /**
   * ===== THÊM SÁCH VÀO KỆ =====
   * Thêm sách với trạng thái cụ thể
   * 
   * @param {string|number} bookId - ID của sách
   * @param {string} status - 'reading' | 'want_to_read' | 'finished'
   * @returns {Promise<Object>} { success: boolean, error?: string }
   */
  const addToShelf = useCallback(async (bookId, status) => {
    try {
      console.log(`📖 Đang thêm sách ${bookId} vào kệ ${status}...`);
      
      // Gọi API thêm sách
      await userAPI.addBookByStatus(bookId, status);
      
      // Refresh để cập nhật UI
      await refresh();
      
      console.log('✅ Đã thêm sách vào kệ');
      return { success: true };
    } catch (err) {
      console.error('❌ Lỗi khi thêm sách vào kệ:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || err.message || 'Không thể thêm sách vào kệ'
      };
    }
  }, [refresh]);

  /**
   * ===== XÓA SÁCH KHỎI KỆ =====
   * TODO: Backend cần có API xóa sách
   * 
   * @param {string|number} bookId - ID của sách
   * @returns {Promise<Object>} { success: boolean, error?: string }
   */
  const removeFromShelf = useCallback(async (bookId) => {
    try {
      console.log(`🗑️ Đang xóa sách ${bookId} khỏi kệ...`);
      
      // TODO: Gọi API xóa sách khi backend có endpoint
      // await userAPI.removeBook(bookId);
      
      // Tạm thời chỉ refresh
      await refresh();
      
      console.log('✅ Đã xóa sách khỏi kệ');
      return { success: true };
    } catch (err) {
      console.error('❌ Lỗi khi xóa sách khỏi kệ:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || err.message || 'Không thể xóa sách khỏi kệ'
      };
    }
  }, [refresh]);

  /**
   * ===== KIỂM TRA SÁCH CÓ TRONG KỆ KHÔNG =====
   * 
   * @param {string|number} bookId - ID của sách
   * @returns {boolean}
   */
  const isInShelf = useCallback((bookId) => {
    return (
      shelves.read.some(b => b.id === bookId) ||
      shelves.reading.some(b => b.id === bookId) ||
      shelves.wantToRead.some(b => b.id === bookId)
    );
  }, [shelves]);

  /**
   * ===== LẤY TRẠNG THÁI CỦA SÁCH =====
   * 
   * @param {string|number} bookId - ID của sách
   * @returns {string|null} 'finished' | 'reading' | 'want_to_read' | null
   */
  const getBookStatus = useCallback((bookId) => {
    if (shelves.read.some(b => b.id === bookId)) return 'finished';
    if (shelves.reading.some(b => b.id === bookId)) return 'reading';
    if (shelves.wantToRead.some(b => b.id === bookId)) return 'want_to_read';
    return null;
  }, [shelves]);

  /**
   * ===== TÍNH THỐNG KÊ =====
   * 
   * @returns {Object} { totalRead, totalReading, totalWantToRead, totalBooks }
   */
  const getStatistics = useCallback(() => {
    return {
      totalRead: shelves.read.length,
      totalReading: shelves.reading.length,
      totalWantToRead: shelves.wantToRead.length,
      totalFavorites: 0, // TODO: Thêm khi có API favorites
      totalBooks: shelves.read.length + shelves.reading.length + shelves.wantToRead.length,
    };
  }, [shelves]);

  // ===== INITIAL FETCH =====
  // Tự động fetch khi component mount
  useEffect(() => {
    fetchAllShelves();
  }, [fetchAllShelves]);

  // ===== RETURN =====
  return {
    // Data
    shelves,                  // Các kệ sách
    statistics: getStatistics(), // Thống kê
    
    // States
    loading,                  // Đang loading
    error,                    // Thông báo lỗi
    refreshing,               // Đang refresh
    
    // Methods
    refresh,                  // Tải lại dữ liệu
    addToShelf,              // Thêm sách vào kệ
    removeFromShelf,         // Xóa sách khỏi kệ
    isInShelf,               // Kiểm tra sách có trong kệ
    getBookStatus,           // Lấy trạng thái sách
  };
};

export default useBookshelf;