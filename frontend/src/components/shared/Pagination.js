"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Số trang hiển thị tối đa (không kể dấu ...)

    // Trường hợp 1: Tổng số trang <= 7 → Hiển thị tất cả
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Luôn có trang 1
    pages.push(1);

    // Trường hợp 2: currentPage ở đầu (1, 2, 3, 4)
    if (currentPage <= 3) {
      pages.push(2, 3, 4, 5);
      pages.push("...");
      pages.push(totalPages);
    }
    // Trường hợp 3: currentPage ở cuối
    else if (currentPage >= totalPages - 2) {
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        if (i > 1) pages.push(i);
      }
    }
    // Trường hợp 4: currentPage ở giữa
    else {
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-6 py-8 text-neutral-800">
      {/* Nút Back */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 bg-teal-600 text-white font-bold px-6 py-3 rounded-md shadow transition-all
          ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-teal-700 active:scale-95"
          }
        `}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Các số trang */}
      <div className="flex items-center gap-2 text-lg">
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="text-neutral-500 px-2">
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] px-4 py-2 rounded-md border transition-all ${
                page === currentPage
                  ? "bg-teal-600 text-white font-semibold border-teal-600 shadow-md"
                  : "border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 bg-teal-600 text-white font-bold px-6 py-3 rounded-md shadow transition-all
          ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-teal-700 active:scale-95"
          }
        `}
      >
        Next <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}