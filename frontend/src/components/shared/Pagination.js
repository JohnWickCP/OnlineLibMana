"use client";
import { ArrowLeft, ArrowRight } from "lucide-react"; // ✅ dùng lucide-react thay vì react-icons

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
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
        className={`flex items-center gap-2 bg-teal-600 text-white font-bold px-6 py-3 rounded-md shadow 
          ${currentPage === 1 ? "opacity-50 cursor-not-allowed " : "hover:bg-teal-700 active:scale-95"}
        `}
      >
        <ArrowLeft className="w-4 h-4" /> back
      </button>

      {/* Các số trang */}
      <div className="flex items-center gap-4 text-lg">
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="text-neutral-500">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-md border hover:cursor-pointer ${
                page === currentPage
                  ? "bg-teal-600 text-white font-semibold"
                  : "hover:bg-neutral-200"
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
        className={`flex items-center gap-2 bg-teal-600 text-white font-bold px-6 py-3 rounded-md shadow 
          ${currentPage === totalPages ? "opacity-50 cursor-not-allowed " : "hover:bg-teal-700 active:scale-95"}
        `}
      >
        next <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
