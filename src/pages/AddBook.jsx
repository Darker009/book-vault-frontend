// src/pages/admin/AddBook.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../service/BookService';
import styles from '../style/AddBook.module.css';

const AddBook = () => {
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    section: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await BookService.addBook(bookData);
      setSuccess('Book added successfully!');
      setBookData({
        title: '',
        author: '',
        section: ''
      });
      // Redirect to books list after 2 seconds
      setTimeout(() => {
        navigate('/admin/books');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Book</h2>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={bookData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={bookData.author}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="section">Section:</label>
          <input
            type="text"
            id="section"
            name="section"
            value={bookData.section}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className={styles.submitButton}>
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;