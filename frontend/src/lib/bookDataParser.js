/**
 * lib/bookDataParser.js
 * Helper function để parse book data từ backend
 */

export function parseBookData(book) {
  if (!book) return null;

  // Extract data từ response.result nếu có
  const data = book.result || book;

  return {
    // Basic Info
    id: data.id || data.key,
    title: data.title || "Untitled",
    subtitle: data.subtitle || "",
    
    // Authors - Backend trả về string format "Last, First"
    authors: (() => {
      if (!data.author) return [{ name: "Unknown Author", key: "" }];
      
      // Backend format: "Shelley, Mary Wollstonecraft"
      if (typeof data.author === 'string') {
        return data.author.split(',').map(name => ({
          name: name.trim(),
          key: ""
        }));
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
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      return "Unknown";
    })(),
    publishYear: (() => {
      if (data.createdAt) {
        return new Date(data.createdAt).getFullYear().toString();
      }
      return "Unknown";
    })(),
    publishers: [],
    publishersText: "Project Gutenberg", // Default publisher
    
    // Physical Info
    pages: data.pages || "N/A",
    languages: [],
    languageText: data.language ? 
      data.language.charAt(0).toUpperCase() + data.language.slice(1) : 
      "English",
    
    // Cover Image - Backend field: coverImage
    coverId: null,
    coverUrl: data.coverImage || "https://via.placeholder.com/400x600/e5e7eb/6b7280?text=No+Cover",
    
    // Categories/Subjects - Backend field: category (separated by ||)
    subjects: (() => {
      if (!data.category) return [];
      if (typeof data.category === 'string') {
        return data.category.split('||').map(s => s.trim()).filter(s => s);
      }
      if (Array.isArray(data.category)) return data.category;
      return [];
    })(),
    
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