"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ExternalLink, Star, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { userAPI, booksAPI } from "@/lib/api";

export default function BookCoverSection({ bookData, bookId }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [readingList, setReadingList] = useState("Want to Read");
  const [openList, setOpenList] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(false);
  const [customLists, setCustomLists] = useState([]);
  const [avgRating, setAvgRating] = useState(0); // average rating to show when user hasn't rated

  // Load user's current rating khi component mount
  useEffect(() => {
    if (isAuthenticated && bookId) {
      loadUserRating();
    } else if (bookId) {
      // nếu chưa login vẫn muốn hiển thị average rating
      loadAverageRating();
    }
  }, [isAuthenticated, bookId]);

  useEffect(() => {
    const fetchCustomLists = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await userAPI.getAllFolders();
        // Backend trả { code: 1000, result: [...] }
        const folders = response?.result || [];
        setCustomLists(folders);
      } catch (error) {
        console.error("❌ Lỗi khi tải custom lists:", error);
      }
    };

    fetchCustomLists();
  }, [isAuthenticated]);

  // Load rating hiện tại của user cho sách này (nếu có), nếu không thì load average rating
  const loadUserRating = async () => {
    try {
      // Nếu backend cung cấp API user-specific rating cho 1 sách, gọi ở đây.
      // Ví dụ giả định: userAPI.getUserBookRating(bookId) => { code: 1000, result: { rating: 3 } }
      if (userAPI.getUserBookRating) {
        const resp = await userAPI.getUserBookRating(bookId);
        const r = resp?.result?.rating ?? 0;
        setUserRating(r);

        // Nếu user không có rating thì load average
        if (!r) {
          await loadAverageRating();
        }

        console.log("📊 Loaded user rating:", r);
        return;
      }

      // Fallback: nếu chưa có API user-specific, load average rating
      await loadAverageRating();
      console.log("📊 No user-specific rating API available yet.");
    } catch (error) {
      console.error("Error loading user rating:", error);
      // fallback to average rating
      await loadAverageRating();
    }
  };

  // Load average rating (hiển thị khi user chưa rate)
  const loadAverageRating = async () => {
    try {
      if (!booksAPI.getBookRating) return;
      const resp = await booksAPI.getBookRating(bookId);
      // backend có thể trả nhiều shape khác nhau
      const avg = resp?.result?.average ?? resp?.result ?? resp?.rating ?? 0;
      setAvgRating(Number(avg) || 0);
      console.log("📊 Loaded average rating:", avg);
    } catch (error) {
      console.error("Error loading average rating:", error);
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
      };

      const backendStatus = statusMap[status];

      console.log(`📚 Adding "${bookData?.title}" to ${status}...`);
      console.log(`🔍 Backend status value:`, backendStatus);
      console.log(
        `🔍 API URL: /home/addBookByStatus/${bookId}/${backendStatus}`
      );

      // Gọi API thêm sách vào list
      await userAPI.addBookByStatus(bookId, backendStatus);

      // Cập nhật UI
      setReadingList(status);
      setOpenList(false);

      // Hiển thị thông báo thành công
      alert(`✅ Successfully added "${bookData?.title}" to ${status}!`);

      console.log(`✅ Added "${bookData?.title}" to ${status}`);
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

  const handleAddToCustomList = async (folder) => {
    if (!isAuthenticated) {
      alert("Please login to add books to your folder");
      return;
    }

    try {
      setSaving(true);
      const targetBookId = bookId ?? bookData?.id;
      console.log(`📚 Thêm "${targetBookId}" vào folder "${folder.id}"...`);

      await userAPI.addBookToFavorites(targetBookId, folder.id);

      alert(`✅ Added "${bookData?.title}" to folder "${folder.title}"`);
      setOpenList(false);
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào custom list:", error);
      alert("Failed to add book to custom list.");
    } finally {
      setSaving(false);
    }
  };

  const handleRating = async (ratingValue) => {
    if (!isAuthenticated) {
      alert("⚠️ Please login to rate this book");
      return;
    }

    try {
      setRating(true);

      console.log(`⭐ Rating "${bookData?.title}" with ${ratingValue} stars...`);

      // Record a view when the user actively rates the book (if API supports)
      try {
        const targetBookId = bookId ?? bookData?.id;
        if (targetBookId && booksAPI.postViews) {
          await booksAPI.postViews(targetBookId);
          console.log("👁️ Recorded view for book (from rating):", targetBookId);
        }
      } catch (err) {
        // Non-fatal: just log
        console.warn("Unable to post view when rating:", err);
      }

      // Gọi API review book với đúng payload theo swagger: { point: number }
      await userAPI.reviewBook(bookId, { point: ratingValue });

      // Cập nhật UI: user đã rating -> show user rating
      setUserRating(ratingValue);

      // Hiển thị thông báo thành công
      alert(
        `✅ Successfully rated "${bookData?.title}" with ${ratingValue} star${
          ratingValue > 1 ? "s" : ""
        }!`
      );

      console.log(`✅ Rated "${bookData?.title}" with ${ratingValue} stars`);
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
    } finally {
      setRating(false);
    }
  };

  // Track views when user clicks "Read Book"
  const handleReadClick = async (e) => {
    // fire-and-forget postViews; don't block navigation
    try {
      const targetBookId = bookId ?? bookData?.id;
      if (targetBookId && booksAPI.postViews) {
        await booksAPI.postViews(targetBookId);
        console.log("👁️ Recorded view for book:", targetBookId);
      }
    } catch (err) {
      // Non-fatal: just log
      console.warn("Unable to post view:", err);
    }
  };

  return (
    <div className="flex-shrink-0">
      <div className="w-64">
        {/* Cover Image */}
        <div className="relative">
          <img
            src={bookData?.coverUrl}
            alt={bookData?.title ?? "Book cover"}
            className="w-full rounded-sm shadow-lg"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x600/e5e7eb/6b7280?text=No+Cover";
            }}
          />

          {/* Rating Badge (average overall rating) */}
          {(bookData?.rating?.average > 0 || avgRating > 0) && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 shadow-md">
              <Star size={16} fill="currentColor" />
              <span>
                {userRating > 0
                  ? Number(userRating).toFixed(1)
                  : (bookData?.rating?.average
                      ? Number(bookData.rating.average).toFixed(1)
                      : Number(avgRating).toFixed(1))}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Link
            href={`/books/${bookId}/read`}
            onClick={handleReadClick}
            className="w-full bg-[#608075] text-white py-2.5 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
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
                  className={`transition-transform ${
                    openList ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openList && (
                <>
                  {/* Lớp phủ để đóng dropdown khi click ra ngoài */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpenList(false)}
                  />

                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-neutral-200 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
                    {/* --- Danh sách mặc định --- */}
                    {["Want to Read", "Currently Reading", "Already Read"].map(
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

                    {/* --- Custom lists (folder của user) --- */}
                    {customLists.length > 0 && (
                      <>
                        <div className="border-t my-1" />

                        {customLists.map((folder) => (
                          <button
                            key={folder.id}
                            onClick={() => handleAddToCustomList(folder)}
                            disabled={saving}
                            className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors disabled:opacity-50 text-neutral-700`}
                          >
                            {folder.title}
                          </button>
                        ))}
                      </>
                    )}

                    {/* --- Trường hợp không có custom list --- */}
                    {customLists.length === 0 && <div className="border-t my-1" />}
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
                {userRating > 0
                  ? `Your rating: ${userRating} star${userRating > 1 ? "s" : ""}`
                  : `Average rating: ${avgRating > 0 ? avgRating.toFixed(1) : "N/A"}`}
              </p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  // Nếu user đã rate thì hiển thị dựa trên userRating,
                  // nếu chưa thì hiển thị mức trung bình làm hint (rounded)
                  const fillThreshold = userRating > 0 ? userRating : Math.round(avgRating);
                  return (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      disabled={rating}
                      className="transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        size={24}
                        className={star <= fillThreshold ? "text-yellow-400" : "text-gray-300"}
                        fill={star <= (userRating > 0 ? userRating : Math.round(avgRating)) ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    </button>
                  );
                })}
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