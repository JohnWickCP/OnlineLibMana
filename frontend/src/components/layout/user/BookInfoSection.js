/**
 * components/user/BookInfoSection.js
 * Component hiển thị thông tin chi tiết sách
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

export default function BookInfoSection({ bookData }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const shouldTruncate = bookData.description.length > 400;
  const displayDescription = showFullDescription || !shouldTruncate
    ? bookData.description
    : `${bookData.description.substring(0, 400)}...`;

  return (
    <div className="flex-1">
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-[#364153] px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide">
          Book Details
        </span>
      </div>

      <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2 leading-tight">
        {bookData.title}
      </h1>

      {bookData.subtitle && (
        <p className="text-xl text-neutral-600 mb-4 leading-relaxed">
          {bookData.subtitle}
        </p>
      )}

      <div className="mb-4">
        <span className="text-neutral-600">by </span>
        {bookData.authors.map((author, idx) => (
          <span key={idx}>
            {author.key ? (
              <Link 
                href={`/authors${author.key}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {author.name}
              </Link>
            ) : (
              <span className="text-blue-600 font-medium">{author.name}</span>
            )}
            {idx < bookData.authors.length - 1 && ", "}
          </span>
        ))}
      </div>

      {/* Rating Stats */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-neutral-600">
        {bookData.rating.average > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(bookData.rating.average) ? "text-yellow-500" : "text-gray-300"}
                  fill={i < Math.round(bookData.rating.average) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="font-medium">
              {bookData.rating.average.toFixed(1)}
            </span>
            {bookData.rating.count > 0 && (
              <span className="text-neutral-400">
                ({bookData.rating.count} ratings)
              </span>
            )}
          </div>
        )}
        
        {bookData.rating.wantToRead > 0 && (
          <span>· {bookData.rating.wantToRead} Want to read</span>
        )}
        {bookData.rating.currentlyReading > 0 && (
          <span>· {bookData.rating.currentlyReading} Currently reading</span>
        )}
        {bookData.rating.alreadyRead > 0 && (
          <span>· {bookData.rating.alreadyRead} Have read</span>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
          Description
        </h2>
        <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
          {displayDescription}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-600 hover:underline text-sm font-medium mt-2"
          >
            {showFullDescription ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Book Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b border-neutral-200">
        <div>
          <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">
            Published
          </p>
          <p className="font-semibold text-neutral-900">
            {bookData.publishDate}
          </p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">
            Publisher
          </p>
          <p className="font-semibold text-neutral-900">
            {bookData.publishersText}
          </p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">
            Language
          </p>
          <p className="font-semibold text-neutral-900">
            {bookData.languageText}
          </p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">
            Pages
          </p>
          <p className="font-semibold text-neutral-900">
            {bookData.pages}
          </p>
        </div>
      </div>

      {/* Subjects/Categories */}
      {bookData.subjects.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wide">
            Subjects
          </h3>
          <div className="flex flex-wrap gap-2">
            {bookData.subjects.slice(0, 12).map((subject, idx) => (
              console.log(subject),
              <Link
                key={idx}
                href={`#`}
                className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-sm hover:bg-neutral-200 transition-colors"
              >
                {subject}
              </Link>
            ))}
            {bookData.subjects.length > 12 && (
              <span className="px-3 py-1.5 text-neutral-500 text-sm">
                +{bookData.subjects.length - 12} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}