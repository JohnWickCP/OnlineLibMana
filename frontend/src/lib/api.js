import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('authToken') 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
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

export const authAPI = {
  register: async (data) => {
    try {
      const response = await api.post('/api/auth/register', data);
      
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        const errorData = error.response.data;

        let defaultMessage = 'Đăng ký thất bại';
        
        if (statusCode === 409) {
          defaultMessage = 'Email này đã được đăng ký. Vui lòng sử dụng email khác.';
        } else if (statusCode === 400) {
          defaultMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (statusCode === 500) {
          defaultMessage = 'Lỗi server. Vui lòng thử lại sau.';
        }

        return {
          success: false,
          status: statusCode,
          data: errorData,
          message: errorData?.message || errorData?.msg || defaultMessage,
        };
      }
      
      if (error.request) {
        return {
          success: false,
          status: 0,
          message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        };
      }

      return {
        success: false,
        status: 0,
        message: error.message || 'Đăng ký thất bại. Vui lòng thử lại.',
      };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', {
        email: credentials.email || credentials.username,
        password: credentials.password,
      });
      
      if (response.data && response.data.result) {
        return {
          success: true,
          token: response.data.result.token,
          user: {
            email: credentials.email || credentials.username,
            role: 'USER',
          },
        };
      }
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      // Convert axios error into a thrown Error with useful metadata so callers
      // can handle it uniformly (AuthProvider expects thrown errors).
      if (error.response) {
        const message = error.response.data?.message || error.response.data?.msg || 'Đăng nhập thất bại';
        const err = new Error(String(message));
        err.status = error.response.status;
        err.response = error.response;
        err.code = error.code;
        throw err;
      }

      if (error.request) {
        const err = new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        err.status = 0;
        err.request = error.request;
        throw err;
      }

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

export const userAPI = {
  getAllUsers: async (page = 0, size = 20) => {
    const response = await api.get('/home/listUser', {
      params: {
        page: page,
        size: size
      }
    });
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

  removeBookFromFolder: async (folderId, bookId) => {
    const response = await api.delete(`/home/fb/${folderId}/${bookId}`);
    return response.data;
  },
};

export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
};

export default api;