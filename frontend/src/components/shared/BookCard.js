/**
 * components/shared/BookCard.js
 * Component hiển thị thẻ sách
 * - Tự động phát hiện route (admin/user)
 * - Hiển thị cover, title, author
 * - Xử lý lỗi ảnh
 */

'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BookCard({ book }) {
  const pathname = usePathname();

  // Tự xác định prefix route
  const basePath = pathname.startsWith("/admin") ? "/admin/books" : "/books";

  // Xử lý các format data khác nhau từ backend
  // Format 1: { id, title, author, coverImage }
  // Format 2: { bookId, bookTitle, authorName, cover }
  const bookId = book.id || book.bookId || "";
  const title = book.title || book.bookTitle || "Untitled";
  const author = book.author || book.authorName || book.authors?.[0] || "Unknown Author";
  
  // Xử lý cover image
  let coverUrl = "https://via.placeholder.com/300x450/e5e7eb/6b7280?text=No+Cover";
  
  if (book.coverImage) {
    // Nếu coverImage là URL đầy đủ
    if (book.coverImage.startsWith('http')) {
      coverUrl = book.coverImage;
    } else {
      // Nếu là đường dẫn tương đối, nối với backend URL
      coverUrl = `${process.env.NEXT_PUBLIC_API_URL}${book.coverImage}`;
    }
  } else if (book.cover) {
    coverUrl = book.cover.startsWith('http') 
      ? book.cover 
      : `${process.env.NEXT_PUBLIC_API_URL}${book.cover}`;
  }

  return (
    <Link href={`${basePath}/${bookId}`} className="group block">
      <div className="bg-[#E9E7E0] w-[200px] mx-auto">
        {/* Book Cover */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="w-full h-full border rounded-lg border-black transition-transform duration-300 group-hover:scale-105 object-cover"
            sizes="200px"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x450/e5e7eb/6b7280?text=No+Cover";
            }}
          />

          {/* Overlay Info */}
          <div className="absolute bottom-3 left-3 right-3 h-[25%] bg-black/60 flex flex-col text-center justify-center p-2 rounded-md">
            <h3 className="font-serif text-[12px] font-semibold text-white leading-snug mb-1 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-white italic line-clamp-1">{author}</p>
          </div>
        </div>

        {/* Book Info Below */}
        <div className="p-4 text-center">
          <h3 className="font-serif text-[1rem] font-semibold text-neutral-900 leading-snug mb-1 group-hover:text-gray-700 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 italic line-clamp-1">{author}</p>
        </div>
      </div>
    </Link>
  );
}