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
  const [avgRating, setAvgRating] = useState(0);

  // ALWAYS load average rating so badge (top-right) can show it.
  // Then, if authenticated, try to load user's own rating (but do NOT use average in the rating UI).
  useEffect(() => {
    if (!bookId) return;
    loadAverageRating();
    if (isAuthenticated) loadUserRating();
  }, [isAuthenticated, bookId, user]);

  useEffect(() => {
    const fetchCustomLists = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await userAPI.getAllFolders();
        const folders = response?.result || [];
        setCustomLists(folders);
      } catch (error) {
        console.error("❌ Lỗi khi tải custom lists:", error);
      }
    };
    fetchCustomLists();
  }, [isAuthenticated]);

  const loadAverageRating = async () => {
    try {
      if (!booksAPI.getBookRating) return;
      const resp = await booksAPI.getBookRating(bookId);
      const avg =
        resp?.result?.average ??
        resp?.result ??
        resp?.rating ??
        resp?.average ??
        0;
      setAvgRating(Number(avg) || 0);
    } catch (error) {
      console.error("Error loading average rating:", error);
    }
  };

  // Load only user's rating (if exists). Do not set avg here.
  const loadUserRating = async () => {
    try {
      if (!userAPI.getReviewBook) return;
      const resp = await userAPI.getReviewBook(bookId);
      const result = resp?.result ?? resp?.data ?? resp;

      const extractPoint = (obj) => {
        if (obj == null) return null;
        if (typeof obj === "number") return obj;
        if (typeof obj === "string" && !isNaN(Number(obj))) return Number(obj);
        return obj?.point ?? obj?.rating ?? obj?.rate ?? obj?.score ?? null;
      };

      // result is number -> user's rating
      if (typeof result === "number" || (typeof result === "string" && !isNaN(Number(result)))) {
        const p = extractPoint(result);
        if (p !== null) {
          setUserRating(Number(p));
          return;
        }
      }

      // result is an object
      if (result && !Array.isArray(result) && typeof result === "object") {
        const p = extractPoint(result);
        if (p !== null) {
          setUserRating(Number(p));
          return;
        }
        const nestedP = extractPoint(result?.result ?? result?.data);
        if (nestedP !== null) {
          setUserRating(Number(nestedP));
          return;
        }
      }

      // result is an array -> find current user's review or single-element fallback
      if (Array.isArray(result) && result.length > 0) {
        const uid = user?.id ?? user?._id ?? user?.userId ?? user?.email ?? null;
        let found = null;
        if (uid) {
          found = result.find((r) => {
            const rUser = r?.user ?? r?.userId ?? r?.author ?? r?.user_id ?? null;
            let rUid = null;
            if (rUser) {
              rUid =
                typeof rUser === "object"
                  ? rUser?.id ?? rUser?._id ?? rUser?.userId ?? rUser?.email
                  : rUser;
            }
            return rUid && String(rUid) === String(uid);
          });
        }
        if (!found && result.length === 1) found = result[0];
        const p = extractPoint(found);
        if (p !== null) {
          setUserRating(Number(p));
          return;
        }
      }

      // If no user rating found, leave userRating as 0
    } catch (error) {
      console.error("Error loading user rating:", error);
    }
  };

  const handleAddToList = async (status) => {
    if (!isAuthenticated) {
      alert("Please login to add books to your list");
      return;
    }
    try {
      setSaving(true);
      const statusMap = {
        "Want to Read": "WANT",
        "Currently Reading": "READING",
        "Already Read": "COMPLETED",
      };
      const backendStatus = statusMap[status];
      await userAPI.addBookByStatus(bookId, backendStatus);
      setReadingList(status);
      setOpenList(false);
      alert(`✅ Successfully added "${bookData?.title}" to ${status}!`);
    } catch (error) {
      console.error("Error adding to list:", error);
      let errorMessage = "Failed to add book to list. Please try again.";
      if (error.response?.status === 401) errorMessage = "Session expired. Please login again.";
      else if (error.response?.status === 409) errorMessage = "Book already exists in this list.";
      else if (error.response?.data?.message) errorMessage = error.response.data.message;
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
      await userAPI.reviewBook(bookId, { point: ratingValue });
      setUserRating(ratingValue);
      // refresh average badge if you want the aggregate to update
      await loadAverageRating();
      alert(`✅ Successfully rated "${bookData?.title}" with ${ratingValue} star${ratingValue > 1 ? "s" : ""}!`);
    } catch (error) {
      console.error("Error rating book:", error);
      let errorMessage = "Failed to rate book. Please try again.";
      if (error.response?.status === 401) errorMessage = "Session expired. Please login again.";
      else if (error.response?.status === 400) errorMessage = "Invalid rating value.";
      else if (error.response?.data?.message) errorMessage = error.response.data.message;
      alert(`❌ ${errorMessage}`);
    } finally {
      setRating(false);
    }
  };

  const handleReadClick = async (e) => {
    try {
      const targetBookId = bookId ?? bookData?.id;
      if (targetBookId && booksAPI.postViews) await booksAPI.postViews(targetBookId);
    } catch (err) {
      console.warn("Unable to post view:", err);
    }
  };

  return (
    <div className="flex-shrink-0">
      <div className="w-64">
        {/* Cover & Average badge */}
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

          {/* Badge luôn hiển thị AVERAGE rating */}
          {(bookData?.rating?.average > 0 || avgRating > 0) && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 shadow-md">
              <Star size={16} fill="currentColor" />
              <span>
                {bookData?.rating?.average
                  ? Number(bookData.rating.average).toFixed(1)
                  : Number(avgRating).toFixed(1)}
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

          {/* Reading List Dropdown */}
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
                  <div className="fixed inset-0 z-10" onClick={() => setOpenList(false)} />
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-neutral-200 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
                    {["Want to Read", "Currently Reading", "Already Read"].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAddToList(option)}
                        disabled={saving}
                        className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors disabled:opacity-50 ${
                          option === readingList ? "font-semibold text-blue-600 bg-blue-50" : "text-neutral-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}

                    {customLists.length > 0 && (
                      <>
                        <div className="border-t my-1" />
                        {customLists.map((folder) => (
                          <button key={folder.id} onClick={() => handleAddToCustomList(folder)} disabled={saving} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors disabled:opacity-50 text-neutral-700">
                            {folder.title}
                          </button>
                        ))}
                      </>
                    )}

                    {customLists.length === 0 && <div className="border-t my-1" />}
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="w-full border-2 border-blue-600 bg-white text-blue-600 py-2.5 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <Lock size={16} />
              <span>Login to Add to List</span>
            </Link>
          )}

          {/* RATING AREA: CHỈ HIỂN THỊ RATING DO NGƯỜI DÙNG ĐÁNH GIÁ */}
          {isAuthenticated ? (
            <div className="pt-2">
              <p className="text-xs text-neutral-500 mb-2 text-center">
                {userRating > 0 ? `Your rating: ${userRating} star${userRating > 1 ? "s" : ""}` : `You haven't rated this book yet`}
              </p>

              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  // only use userRating to determine filled stars; if userRating === 0 => show all unfilled
                  const fillThreshold = userRating > 0 ? userRating : 0;
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
                        fill={star <= fillThreshold ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    </button>
                  );
                })}
              </div>

              {rating && (
                <p className="text-xs text-neutral-400 text-center mt-2">Submitting rating...</p>
              )}

              {userRating > 0 && (
                <div className="text-center mt-3">
                  <button
                    onClick={async () => {
                      if (!confirm("Remove your rating for this book?")) return;
                      try {
                        await userAPI.deleteRating(bookId);
                        setUserRating(0);
                        await loadAverageRating();
                        alert("⭐ Your rating has been cleared!");
                      } catch (error) {
                        console.error("❌ Error clearing rating:", error);
                        alert("Failed to clear rating. Please try again.");
                      }
                    }}
                    className="text-xs text-[#364153] hover:underline"
                  >
                    Clear rating
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-2 text-center border-t border-neutral-200">
              <div className="flex items-center justify-center gap-2 text-neutral-400 mb-2 pt-2">
                <Lock size={14} />
                <p className="text-xs">Login required to rate</p>
              </div>
              <Link href="/auth/login" className="inline-block text-sm text-blue-600 hover:underline font-medium">
                Sign in to rate this book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}