/**
 * components/user/BookCoverSection.js
 * Component hiển thị bìa sách và các action buttons
 * Yêu cầu đăng nhập để sử dụng Want to Read và Rate Book
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Star, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { userAPI, booksAPI } from "@/lib/api";

export default function BookCoverSection({ bookData, bookId }) {
  const { user, isAuthenticated } = useAuth();
  const [readingList, setReadingList] = useState("Want to Read");
  const [openList, setOpenList] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(false);

  // Load user's current rating khi component mount
  useEffect(() => {
    if (isAuthenticated && bookId) {
      loadUserRating();
    }
  }, [isAuthenticated, bookId]);

  // Load rating hiện tại của user cho sách này
  const loadUserRating = async () => {
    try {
      // TODO: Khi backend có API lấy rating của user cho book cụ thể
      // const response = await userAPI.getUserBookRating(bookId);
      // setUserRating(response.rating || 0);
      console.log('📊 Loading user rating for book:', bookId);
    } catch (error) {
      console.error('Error loading user rating:', error);
    }
  };

  const handleAddToList = async (status) => {
    if (!isAuthenticated) {
      alert("Please login to add books to your list");
      return;
    }

    try {
      setSaving(true);
      
      // Map status to backend StatusBook enum: READING, COMPLETED, WANT
      const statusMap = {
        "Want to Read": "WANT",
        "Currently Reading": "READING",
        "Already Read": "COMPLETED",
        "Favorites": "READING" // Backend không có FAVORITES, tạm map sang READING
      };
      
      const backendStatus = statusMap[status];
      
      console.log(`📚 Adding "${bookData.title}" to ${status}...`);
      console.log(`🔍 Backend status value:`, backendStatus);
      console.log(`🔍 API URL: /home/addBookByStatus/${bookId}/${backendStatus}`);
      
      // Gọi API thêm sách vào list
      await userAPI.addBookByStatus(bookId, backendStatus);
      
      // Cập nhật UI
      setReadingList(status);
      setOpenList(false);
      
      // Hiển thị thông báo thành công
      alert(`✅ Successfully added "${bookData.title}" to ${status}!`);
      
      console.log(`✅ Added "${bookData.title}" to ${status}`);
    } catch (error) {
      console.error("Error adding to list:", error);
      
      // Xử lý error message
      let errorMessage = "Failed to add book to list. Please try again.";
      
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.response?.status === 409) {
        errorMessage = "Book already exists in this list.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRating = async (rating) => {
    if (!isAuthenticated) {
      alert("⚠️ Please login to rate this book");
      return;
    }

    try {
      setRating(true);
      
      console.log(`⭐ Rating "${bookData.title}" with ${rating} stars...`);
      
      // Gọi API review book với rating
      await userAPI.reviewBook(bookId, { 
        rating: rating,
        comment: "" // Comment có thể để trống
      });
      
      // Cập nhật UI
      setUserRating(rating);
      
      // Hiển thị thông báo thành công
      alert(`✅ Successfully rated "${bookData.title}" with ${rating} star${rating > 1 ? 's' : ''}!`);
      
      console.log(`✅ Rated "${bookData.title}" with ${rating} stars`);
      
      // Optional: Reload book data để cập nhật average rating
      // window.location.reload(); // Hoặc dùng state management để refresh
    } catch (error) {
      console.error("Error rating book:", error);
      
      // Xử lý error message
      let errorMessage = "Failed to rate book. Please try again.";
      
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid rating value.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(`❌ ${errorMessage}`);
      
      // Reset rating về giá trị cũ nếu có lỗi
      // setUserRating(userRating); // Giữ nguyên rating cũ
    } finally {
      setRating(false);
    }
  };

  return (
    <div className="flex-shrink-0">
      <div className="w-64">
        {/* Cover Image */}
        <div className="relative">
          <img
            src={bookData.coverUrl}
            alt={bookData.title}
            className="w-full rounded-sm shadow-lg"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x600/e5e7eb/6b7280?text=No+Cover";
            }}
          />
          
          {/* Rating Badge */}
          {bookData.rating.average > 0 && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 shadow-md">
              <Star size={16} fill="currentColor" />
              <span>{bookData.rating.average.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {/* Read Button - Luôn hiển thị */}
          <Link
            href={bookData.fileUrl || `/books/${bookId}/read`}
            target={bookData.fileUrl ? "_blank" : "_self"}
            rel={bookData.fileUrl ? "noopener noreferrer" : ""}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <span>Read Book</span>
            <ExternalLink size={16} />
          </Link>

          {/* Reading List Dropdown - CHỈ HIỆN KHI ĐÃ LOGIN */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setOpenList((prev) => !prev)}
                disabled={saving}
                className="w-full border border-neutral-300 bg-white text-neutral-700 py-2.5 rounded-md flex items-center justify-between px-4 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium">
                  {saving ? "Saving..." : readingList}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${openList ? "rotate-180" : ""}`}
                />
              </button>

              {openList && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setOpenList(false)}
                  />
                  
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-neutral-200 rounded-md shadow-lg z-20">
                    {["Want to Read", "Currently Reading", "Already Read", "Favorites"].map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() => handleAddToList(option)}
                          disabled={saving}
                          className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors disabled:opacity-50 ${
                            option === readingList
                              ? "font-semibold text-blue-600 bg-blue-50"
                              : "text-neutral-700"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Nút Login để Add to List */
            <Link
              href="/auth/login"
              className="w-full border-2 border-blue-600 bg-white text-blue-600 py-2.5 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <Lock size={16} />
              <span>Login to Add to List</span>
            </Link>
          )}

          {/* Rating Stars - CHỈ HIỆN KHI ĐÃ LOGIN */}
          {isAuthenticated ? (
            <div className="pt-2">
              <p className="text-xs text-neutral-500 mb-2 text-center">
                {userRating > 0 ? `Your rating: ${userRating} star${userRating > 1 ? 's' : ''}` : 'Rate this book'}
              </p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    disabled={rating}
                    className="transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      size={24}
                      className={star <= userRating ? "text-yellow-400" : "text-gray-300"}
                      fill={star <= userRating ? "currentColor" : "none"}
                      stroke="currentColor"
                    />
                  </button>
                ))}
              </div>
              {rating && (
                <p className="text-xs text-neutral-400 text-center mt-2">
                  Submitting rating...
                </p>
              )}
            </div>
          ) : (
            /* Thông báo yêu cầu login để rate */
            <div className="pt-2 text-center border-t border-neutral-200">
              <div className="flex items-center justify-center gap-2 text-neutral-400 mb-2 pt-2">
                <Lock size={14} />
                <p className="text-xs">Login required to rate</p>
              </div>
              <Link
                href="/auth/login"
                className="inline-block text-sm text-blue-600 hover:underline font-medium"
              >
                Sign in to rate this book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}