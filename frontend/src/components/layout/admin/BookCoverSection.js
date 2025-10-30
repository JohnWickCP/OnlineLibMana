/**
 * components/user/BookCoverSectionAdmin.js
 * Hiển thị bìa sách + nút Read và Edit
 */

"use client";

import Link from "next/link";
import { ExternalLink, Lock, Edit3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function BookCoverSectionAdmin({ bookData, bookId }) {
  const { isAuthenticated } = useAuth();

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
              {/* Read Book */}
              <Link
                href={bookData.fileUrl || `/books/${bookId}/read`}
                target={bookData.fileUrl ? "_blank" : "_self"}
                rel={bookData.fileUrl ? "noopener noreferrer" : ""}
                className="w-full bg-[#608075] text-white py-2.5 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-[#4a6e6f] transition-colors"
              >
                <span>Read Book</span>
                <ExternalLink size={16} />
              </Link>

              {/* Edit Book */}
              <Link
                href={`/admin/books/${bookId}/edit`}
                className="w-full bg-neutral-100 text-neutral-700 py-2.5 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors border border-neutral-300"
              >
                <Edit3 size={16} />
                <span>Edit Book</span>
              </Link>
            </>
          ) : (
            <div className="pt-2 text-center border border-neutral-200 rounded-md p-3">
              <div className="flex items-center justify-center gap-2 text-neutral-400 mb-2">
                <Lock size={14} />
                <p className="text-xs">Login required to read or edit</p>
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
