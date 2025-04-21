import api from './api';

export const arrayBufferToDataUrl = (arrayBuffer) =>
  new Promise((resolve, reject) => {
    const blob = new Blob([arrayBuffer]);
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

const BookService = {
//used
  addBook: async (formData) => {
    try {
      const { data } = await api.post('/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    } catch (err) {
      return handleError(err, 'Failed to add book');
    }
  },

  //used
  updateBook: async (bookId, bookData) => {
    try {
      const res = await api.put(`/books/${bookId}`, bookData);
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to update book');
    }
  },

  //used
  deleteBook: async (bookId) => {
    try {
      const res = await api.delete(`/books/${bookId}`);
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to delete book');
    }
  },

  //used
  getBookById: async (bookId) => {
    try {
      const res = await api.get(`/books/${bookId}`);
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to fetch book by ID');
    }
  },

  //used
  getAllBooks: async () => {
    try {
      const res = await api.get('/books');
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to fetch all books');
    }
  },

  //used
  getBookImage: async (bookId) => {
    try {
      const res = await api.get(`/books/${bookId}/image`, {
        responseType: 'arraybuffer'
      });
      return await arrayBufferToDataUrl(res.data);
    } catch (err) {
      console.error(`Failed to fetch image for book ${bookId}:`, err);
      return null;
    }
  },

  //used
  borrowBook: async (bookId) => {
    try {
      const res = await api.post(`/books/borrow/${bookId}`);
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to borrow book');
    }
  },

  //used
  returnBook: async (borrowId) => {
    try {
      const res = await api.post(`/books/return/${borrowId}`);
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to return book');
    }
  },

 // used
  getMyBorrowedBooks: async () => {
    try {
      const res = await api.get('/books/borrowed');
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to fetch borrowed books');
    }
  },

 

  //used
  getAllBorrowedBooks: async () => {
    try {
      const res = await api.get('/books/admin/borrowed');
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to fetch all borrowed books');
    }
  },

  //used
  getActiveBorrowedBooks: async () => {
    try {
      const res = await api.get('/books/admin/borrowed/active');
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to fetch active borrowed books');
    }
  },

 

  //used
  getOverdueBooks: async () => {
    try {
      const res = await api.get('/books/admin/borrowed/overdue');
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to fetch overdue books');
    }
  },


  //used
  getBookStatistics: async () => {
    try {
      const res = await api.get('/books/statistics');
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to fetch book statistics');
    }
  },

  //used
  getTotalBooksCount: async () => {
    try {
      const res = await api.get('/books/count');
      return res.data;
    } catch (err) {
      return handleError(err, 'Failed to fetch total books count');
    }
  },

 
};

export default BookService;
