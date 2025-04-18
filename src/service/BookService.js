import api from "./api";

const BookService = {
  // Fetch all books
  getAllBooks: async () => {
    try {
      const response = await api.get("/books");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch books";
    }
  },

  // Get book details by ID
  getBookById: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch book";
    }
  },

  // Add a new book (Admin only)
  addBook: async (book) => {
    try {
      const response = await api.post("/books", book);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to add book";
    }
  },

  // Update existing book by ID (Admin only)
  updateBook: async (id, updatedBook) => {
    try {
      const response = await api.put(`/books/${id}`, updatedBook);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update book";
    }
  },

  // Delete a book by ID (Admin only)
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete book";
    }
  },

  // Borrow a book by bookId (Student)
  borrowBook: async (bookId) => {
    try {
      const response = await api.post(`/books/borrow/${bookId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to borrow book";
    }
  },

  // Return a book by borrowId (Student)
  returnBook: async (borrowId) => {
    try {
      const response = await api.post(`/books/return/${borrowId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to return book";
    }
  },

  // Get active borrowed books based on role
  getBorrowedBooks: async (role) => {
    try {
      const endpoint =
        role === "ROLE_ADMIN"
          ? "/books/admin/borrowed/active"
          : "/books/borrowed";
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch borrowed books";
    }
  },

  // Get all registered students (Admin)
  getAllStudents: async () => {
    try {
      const response = await api.get("/auth/students");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch students";
    }
  },

  // Fetch dashboard summary statistics (Admin)
  getSummaryStats: async () => {
    try {
      const response = await api.get("/stats/summary");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to load stats";
    }
  },

  // Get all borrow records (Admin)
  getAllBorrows: async () => {
    try {
      const response = await api.get("/books/admin/borrowed");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch borrow records";
    }
  },

  // Get book recommendations based on bookId
  getRecommendations: async (bookId, k = 5) => {
    try {
      const response = await api.get(`/recommendations/${bookId}?k=${k}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch recommendations";
    }
  },
};

export default BookService;
