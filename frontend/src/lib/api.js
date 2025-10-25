import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('authToken') 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    if (isDev) {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
    }
    return Promise.reject(error);
  }
);

// AUTH APIs
export const authAPI = {
  register: async (data) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', {
        email: credentials.email || credentials.username,
        password: credentials.password,
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Login response:', response.data);
      }
      
      if (response.data && response.data.result) {
        return {
          token: response.data.result.token,
          user: {
            email: credentials.email || credentials.username,
            role: 'USER',
          },
        };
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
      return response.data;
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
      throw error;
    }
  },

  googleLogin: async () => {
    const response = await api.get('/api/auth/google');
    return response.data;
  },

  deleteAccount: async (id) => {
    const response = await api.delete(`/api/auth/${id}`);
    return response.data;
  },
};

// BOOK APIs
export const booksAPI = {
  getAllBooksWithPagination: async (page = 0, size = 24) => {
    const response = await api.get('/book/listbooks', {
      params: {
        page: page,
        size: size
      }
    });
    return response.data;
  },

  getBookById: async (id) => {
    const response = await api.get(`/book/id/${id}`);
    return response.data;
  },

  searchByTitle: async (title) => {
    const response = await api.get(`/book/${title}`);
    return response.data;
  },

  getBookRating: async (bookId) => {
    const response = await api.get(`/book/rating/${bookId}`);
    return response.data;
  },

  addBook: async (bookData) => {
    const response = await api.post('/book/addBook', bookData);
    return response.data;
  },

  editBook: async (id, bookData) => {
    const response = await api.post(`/book/editBook/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/book/delete/${id}`);
    return response.data;
  },
};

// USER APIs
export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/home/listUser');
    return response.data;
  },

  reviewBook: async (bookId, reviewData) => {
    const response = await api.post(`/home/reviewBook/${bookId}`, reviewData);
    return response.data;
  },

  addFolder: async (folderData) => {
    const response = await api.post('/home/addFBfolder', folderData);
    return response.data;
  },

  getAllFolders: async () => {
    const response = await api.get('/home/getFBfolder');
    return response.data;
  },

  addBookToFavorites: async (bookId, listId) => {
    const response = await api.post(`/home/addFB/${bookId}/favourites/${listId}`);
    return response.data;
  },

  addBookToFolder: async (folderName, bookId) => {
    const response = await api.post(`/home/addBookToFolder/${folderName}/${bookId}`);
    return response.data;
  },

  addBookByStatus: async (bookId, status) => {
    const response = await api.post(`/home/addBookByStatus/${bookId}/${status}`);
    return response.data;
  },

  getFolderById: async (listId) => {
    const response = await api.get(`/home/fb/${listId}`);
    return response.data;
  },

  getCountBook: async (status) => {
    const response = await api.get(`/home/countBook/${status}`);
    return response.data;
  },

  getBooksByStatus: async (status) => {
    const response = await api.get(`/home/books/${status}`);
    return response.data;
  },

  deleteFolder: async (folderId) => {
    const response = await api.delete(`/home/deleteFBfolder/${folderId}`);
    return response.data;
  },

  // ✅ SỬA: Đúng endpoint theo API docs
  removeBookFromFolder: async (folderId, bookId) => {
    const response = await api.delete(`/home/fb/${folderId}/${bookId}`);
    return response.data;
  },
};

// ADMIN APIs
export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
};

export default api;