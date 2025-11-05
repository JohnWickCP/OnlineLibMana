"use client";

import Link from "next/link";
import { Lock, Edit3, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { booksAPI } from "@/lib/api";

export default function BookCoverSectionAdmin({ bookData, bookId }) {
  // Không kiểm tra isAdmin ở đây vì trang chỉ cho admin truy cập
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async () => {
    const ok = window.confirm(
      "Bạn có chắc muốn xóa sách này? Hành động này không thể hoàn tác."
    );
    if (!ok) return;

    setDeleteError(null);
    setIsDeleting(true);

    try {
      await booksAPI.deleteBook(bookId);
      // success feedback and redirect
      alert("Xóa sách thành công.");
      router.push("/books");
    } catch (err) {
      console.error("Delete failed:", err);
      let msg = "Xóa sách thất bại. Vui lòng thử lại.";
      if (err?.response?.data?.message) msg = err.response.data.message;
      setDeleteError(msg);
      setIsDeleting(false);
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
              e.target.src =
                "https://via.placeholder.com/400x600/e5e7eb/6b7280?text=No+Cover";
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {isAuthenticated ? (
            <>
              {/* DELETE (replaces the previous Read button) */}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 bg-[#608075] hover:bg-[#747370] text-white py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete book"
              >
                <Trash2 size={16} />
                <span>{isDeleting ? "Deleting..." : "Delete Book"}</span>
              </button>

              {/* Edit Book */}
              <Link
                href={`/admin/books/${bookId}/edit`}
                className="w-full bg-neutral-100 text-neutral-700 py-2.5 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors border border-neutral-300"
              >
                <Edit3 size={16} />
                <span>Edit Book</span>
              </Link>

              {deleteError && (
                <p className="text-sm text-[#608075] mt-2">{deleteError}</p>
              )}
            </>
          ) : (
            <div className="pt-2 text-center border border-neutral-200 rounded-md p-3">
              <div className="flex items-center justify-center gap-2 text-neutral-400 mb-2">
                <Lock size={14} />
                <p className="text-xs">Login required to edit or delete</p>
              </div>
              <Link
                href="/auth/login"
                className="inline-block text-sm text-[#364153] hover:underline font-medium"
              >
                Sign in to continue
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}