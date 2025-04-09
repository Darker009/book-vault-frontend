import api from "./api";

const BookService = {
  getAllBooks: async (token) => {
    try {
      const response = await api.get("/books", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch books";
    }
  },

  getBookById: async (id, token) => {
    try {
      const response = await api.get(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch book";
    }
  },

  addBook: async (book, token) => {
    try {
      const response = await api.post("/books", book, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to add book";
    }
  },

  updateBook: async (id, updatedBook, token) => {
    try {
      const response = await api.put(`/books/${id}`, updatedBook, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update book";
    }
  },

  deleteBook: async (id, token) => {
    try {
      const response = await api.delete(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete book";
    }
  }
};

export default BookService;  
