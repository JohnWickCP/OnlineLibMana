/*
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xóa token và redirect về login
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const booksAPI = {
  // Lấy danh sách sách với filters
  getBooks: async (params = {}) => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  // Lấy chi tiết một cuốn sách
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Tìm kiếm sách
  searchBooks: async (query, params = {}) => {
    const response = await api.get('/books/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  // Lấy sách mới thêm
  getRecentBooks: async (limit = 12) => {
    const response = await api.get('/books/recent', { params: { limit } });
    return response.data;
  },

  // Lấy sách nổi bật
  getFeaturedBooks: async () => {
    const response = await api.get('/books/featured');
    return response.data;
  },
};


export const authorsAPI = {
  // Lấy danh sách tác giả
  getAuthors: async () => {
    const response = await api.get('/authors');
    return response.data;
  },

  // Lấy sách theo tác giả
  getBooksByAuthor: async (slug, params = {}) => {
    const response = await api.get(`/authors/${slug}/books`, { params });
    return response.data;
  },
};

export default api;
*/ 
import axios from 'axios';

const API_BASE_URL = 'https://openlibrary.org';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - có thể thêm token nếu cần (Open Library không yêu cầu auth)
api.interceptors.request.use(
  (config) => {
    // Open Library API không cần token, nhưng giữ logic này cho tương lai
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.error('🔒 Unauthorized access');
    }
    if (error.response?.status === 404) {
      console.error('🔍 Resource not found');
    }
    if (error.response?.status >= 500) {
      console.error('🔥 Server error');
    }
    return Promise.reject(error);
  }
);

// API functions
export const booksAPI = {
  /**
   * Lấy danh sách sách theo subject (thể loại)
   * @param {Object} params - { subject: 'fiction', limit: 12, offset: 0 }
   */
  getBooks: async (params = {}) => {
    console.log('📚 getBooks called with params:', params);
    try {
      const { subject = 'fiction', limit = 12, offset = 0 } = params;
      const response = await api.get(`/subjects/${subject}.json`, {
        params: { limit, offset }
      });
      console.log('📖 getBooks response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getBooks error:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết một cuốn sách theo work key
   * @param {string} id - Work key (vd: '/works/OL45804W')
   */
  getBookById: async (id) => {
    // Nếu id không có '/works/' prefix thì thêm vào
    const workKey = id.startsWith('/works/') ? id : `/works/${id}`;
    const response = await api.get(`${workKey}.json`);
    return response.data;
  },

  /**
   * Lấy thông tin edition của sách
   * @param {string} id - Edition key (vd: 'OL7353617M')
   */
  getBookEdition: async (id) => {
    const editionKey = id.startsWith('/books/') ? id : `/books/${id}`;
    const response = await api.get(`${editionKey}.json`);
    return response.data;
  },

  /**
   * Tìm kiếm sách
   * @param {string} query - Từ khóa tìm kiếm
   * @param {Object} params - { limit: 12, page: 1, author: '', title: '' }
   */
  searchBooks: async (query, params = {}) => {
    console.log('🔍 searchBooks called with query:', query, 'params:', params);
    try {
      const { limit = 12, page = 1, author = '', title = '' } = params;
      const offset = (page - 1) * limit;
      
      const response = await api.get('/search.json', {
        params: {
          q: query,
          limit,
          offset,
          ...(author && { author }),
          ...(title && { title })
        }
      });
      console.log('🔎 searchBooks response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ searchBooks error:', error);
      throw error;
    }
  },

  /**
   * Tìm kiếm sách theo tiêu đề
   * @param {string} title - Tên sách
   * @param {number} limit - Số lượng kết quả
   */
  searchByTitle: async (title, limit = 12) => {
    const response = await api.get('/search.json', {
      params: { title, limit }
    });
    return response.data;
  },

  /**
   * Tìm kiếm sách theo ISBN
   * @param {string} isbn - ISBN number
   */
  searchByISBN: async (isbn) => {
    const response = await api.get('/search.json', {
      params: { isbn }
    });
    return response.data;
  },

  /**
   * Lấy sách mới thêm (trending books)
   * @param {number} limit - Số lượng sách
   */
  getRecentBooks: async (limit = 12) => {
    console.log('🆕 getRecentBooks called with limit:', limit);
    try {
      // Open Library không có endpoint "recent", dùng trending subjects thay thế
      const response = await api.get('/subjects/bestseller.json', {
        params: { limit }
      });
      console.log('📚 getRecentBooks response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getRecentBooks error:', error);
      throw error;
    }
  },

  /**
   * Lấy sách nổi bật (featured/trending)
   * @param {string} subject - Thể loại (vd: 'bestseller', 'trending', 'fiction')
   */
  getFeaturedBooks: async (subject = 'bestseller') => {
    console.log('⭐ getFeaturedBooks called with subject:', subject);
    try {
      const response = await api.get(`/subjects/${subject}.json`, {
        params: { limit: 12 }
      });
      console.log('✨ getFeaturedBooks response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getFeaturedBooks error:', error);
      throw error;
    }
  },

  /**
   * Lấy sách theo thể loại cụ thể
   * @param {string} subject - Thể loại (vd: 'science_fiction', 'romance', 'history')
   * @param {number} limit - Số lượng sách
   */
  getBooksBySubject: async (subject, limit = 12) => {
    const response = await api.get(`/subjects/${subject}.json`, {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Lấy thông tin cover ảnh của sách
   * @param {string} coverId - Cover ID
   * @param {string} size - Kích thước: 'S', 'M', 'L'
   */
  getCoverUrl: (coverId, size = 'M') => {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  },
};

export const authorsAPI = {
  /**
   * Lấy thông tin tác giả
   * @param {string} authorKey - Author key (vd: 'OL23919A' hoặc '/authors/OL23919A')
   */
  getAuthor: async (authorKey) => {
    const key = authorKey.startsWith('/authors/') ? authorKey : `/authors/${authorKey}`;
    const response = await api.get(`${key}.json`);
    return response.data;
  },

  /**
   * Lấy danh sách tác giả (tìm kiếm theo tên)
   * @param {string} name - Tên tác giả
   */
  getAuthors: async (name = '') => {
    const response = await api.get('/search/authors.json', {
      params: { q: name, limit: 20 }
    });
    return response.data;
  },

  /**
   * Lấy sách theo tác giả
   * @param {string} authorKey - Author key
   * @param {Object} params - { limit: 12, offset: 0 }
   */
  getBooksByAuthor: async (authorKey, params = {}) => {
    const { limit = 12, offset = 0 } = params;
    const key = authorKey.startsWith('/authors/') ? authorKey : `/authors/${authorKey}`;
    
    const response = await api.get(`${key}/works.json`, {
      params: { limit, offset }
    });
    return response.data;
  },

  /**
   * Tìm kiếm tác giả
   * @param {string} query - Từ khóa tìm kiếm
   */
  searchAuthors: async (query) => {
    const response = await api.get('/search/authors.json', {
      params: { q: query }
    });
    return response.data;
  },
};

export default api;