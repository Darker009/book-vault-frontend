import api from "./api";

const BookService = {
  getAllBooks: async (token) => {
    try {
      const response = await api.get("/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch books";
    }
  },

  getBookById: async (id, token) => {
    try {
      const response = await api.get(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch book";
    }
  },

  addBook: async (book, token) => {
    try {
      const response = await api.post("/books", book, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to add book";
    }
  },

  updateBook: async (id, updatedBook, token) => {
    try {
      const response = await api.put(`/books/${id}`, updatedBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update book";
    }
  },

  deleteBook: async (id, token) => {
    try {
      const response = await api.delete(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete book";
    }
  },
  borrowBook: async (bookId, token) => {
    try {
      const response = await api.post(
        `/books/borrow/${bookId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to borrow book";
    }
  },

  returnBook: async (borrowId, token) => {
    try {
      const response = await api.post(
        `/books/return/${borrowId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to return book";
    }
  },

  getBorrowedBooks: async (token) => {
    try {
      const response = await api.get("/books/borrowed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch borrowed books";
    }
  },
  getAllStudents: async (token) => {
    const response = await api.get("/auth/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // BookService.js
  getSummaryStats: async () => {
    try {
      const response = await api.get("/stats/summary");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to load stats";
    }
  },

  getAllBorrows: async (token) => {
    const res = await api.get("/books/admin/borrowed", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  getRecommendations: async (bookId, k = 5, token) => {
    const res = await api.get(`/recommendations/${bookId}?k=${k}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  
};
export default BookService;
