'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BookCard({ book }) {
  const pathname = usePathname();

  // ✅ Tự xác định prefix route
  const basePath = pathname.startsWith("/admin") ? "/admin/books" : "/books";

  const coverId = book.cover_id || book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : "https://via.placeholder.com/300x450/e5e7eb/6b7280?text=No+Cover";

  const title = book.title || "Untitled";
  const authors = book.authors
    ? book.authors.map((a) => a.name).join(", ")
    : book.author_name?.join(", ") || "Unknown Author";

  const bookKey = book.key || book.id || "";
  const bookId = bookKey.replace("/works/", "");

  return (
    <Link href={`${basePath}/${bookId}`} className="group block">
      <div className="bg-[#E9E7E0] w-[200px] mx-auto">
        {/* Book Cover */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full border rounded-lg border-black transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x450/e5e7eb/6b7280?text=No+Cover";
            }}
          />

          {/* Overlay Info */}
          <div className="absolute bottom-3 left-3 right-3 h-[25%] bg-black/60 flex flex-col text-center justify-center p-2 rounded-md">
            <h3 className="font-serif text-[12px] font-semibold text-white leading-snug mb-1">
              {title}
            </h3>
            <p className="text-sm text-white italic">{authors}</p>
          </div>
        </div>

        {/* Book Info Below */}
        <div className="p-4 text-center">
          <h3 className="font-serif text-[1rem] font-semibold text-neutral-900 leading-snug mb-1 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 italic">{authors}</p>
          {book.first_publish_year && (
            <p className="text-xs text-neutral-500 mt-1">
              {book.first_publish_year}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
