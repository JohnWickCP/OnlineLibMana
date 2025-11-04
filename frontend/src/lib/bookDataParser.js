/**
 * lib/bookDataParser.js
 * Helper function để parse book data từ backend
 */

export function parseBookData(book) {
  if (!book) return null;

  // Nếu backend trả nguyên object trong result
  const data = book.result || book;

  // Helper: normalize subjects from various separators and types
  const normalizeSubjects = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map((s) => String(s).trim()).filter(Boolean);
    }
    // split by common separators: --, ||, ,, ;, /
    // Note: the regex covers literal "||" and "--" and common punctuation
    const parts = String(raw)
      .split(/(?:\-\-|\\\|\\\||\|\||,|;|\/)/)
      .map((s) => s.trim())
      .filter(Boolean);
    // dedupe preserving order
    const seen = new Set();
    const deduped = [];
    for (const p of parts) {
      if (!seen.has(p)) {
        seen.add(p);
        deduped.push(p);
      }
    }
    return deduped;
  };

  // Language normalization (simple)
  const normalizeLanguage = (lang) => {
    if (!lang) return "English";
    const l = String(lang).trim();
    if (!l) return "English";
    // capitalize first letter
    return l.charAt(0).toUpperCase() + l.slice(1);
  };

  // Build result object
  const subjectsFromSubjectField = normalizeSubjects(data.subject);
  const subjectsFromCategoryField = normalizeSubjects(data.category);

  const subjects = subjectsFromSubjectField.length > 0
    ? subjectsFromSubjectField
    : subjectsFromCategoryField;

  return {
    // Basic Info
    id: data.id || data.key,
    title: data.title || "Untitled",
    subtitle: data.subtitle || "",

    // Authors - Backend trả về string format "Last, First"
    authors: (() => {
      if (!data.author) return [{ name: "Unknown Author", key: "" }];

      // Backend format: "Shelley, Mary Wollstonecraft"
      if (typeof data.author === "string") {
        // If multiple authors separated by semicolon or ' and ', try to split more intelligently
        const raw = data.author;
        // try common separators
        const parts = raw.split(/(?:;| and |,)/).map((s) => s.trim()).filter(Boolean);
        return parts.map((name) => ({ name, key: "" }));
      }

      return [{ name: "Unknown Author", key: "" }];
    })(),

    authorsText: data.author || "Unknown Author",

    // Description
    description: data.description || "No description available.",

    // Publishing Info - Backend có createdAt thay vì publishDate
    publishDate: (() => {
      if (data.createdAt) {
        const date = new Date(data.createdAt);
        if (!Number.isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
      return "Unknown";
    })(),
    publishYear: (() => {
      if (data.createdAt) {
        const d = new Date(data.createdAt);
        if (!Number.isNaN(d.getTime())) return d.getFullYear().toString();
      }
      return "Unknown";
    })(),
    publishers: [],
    publishersText: data.publisher || "Project Gutenberg",

    // Physical Info
    pages: data.pages || "N/A",
    languages: [],
    languageText: normalizeLanguage(data.language),

    // Cover Image - Backend field: coverImage
    coverId: null,
    coverUrl: data.coverImage || "https://via.placeholder.com/400x600/e5e7eb/6b7280?text=No+Cover",

    // Category (primary) - keep original category as separate field
    category: data.category || null,
    // Subjects: prefer explicit 'subject' field; fallback to category
    subjects,

    // File URL for reading
    fileUrl: data.fileUrl || null,

    // Rating - Backend không có rating, set default
    rating: {
      average: data.rating?.average || data.averageRating || 0,
      count: data.rating?.count || data.ratingCount || 0,
      wantToRead: data.wantToReadCount || 0,
      currentlyReading: data.currentlyReadingCount || 0,
      alreadyRead: data.alreadyReadCount || 0,
    },
  };
}