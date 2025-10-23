/**
 * components/shared/BookDetailStates.js
 * Loading và Error states cho book detail
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-[#E9E7E0] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
        <p className="text-neutral-600">Loading book details...</p>
      </div>
    </div>
  );
}

export function ErrorState({ error }) {
  return (
    <div className="min-h-screen bg-[#E9E7E0] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Book Not Found
        </h2>
        <p className="text-neutral-600 mb-6">
          {error || "We couldn't find the book you're looking for."}
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Books
        </Link>
      </div>
    </div>
  );
}