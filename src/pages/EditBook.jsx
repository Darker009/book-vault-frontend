import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from '../service/BookService';
import styles from '../style/EditBookStyle.module.css';

const EditBook = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    section: '',
    available: true
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const book = await BookService.getBookById(id, token);
        setBookData({
          title: book.title,
          author: book.author,
          section: book.section,
          available: book.available
        });
      } catch (err) {
        setError('Failed to load book details');
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await BookService.updateBook(id, bookData, token);
      navigate('/admin/books');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit Book</h2>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            name="title"
            value={bookData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            name="author"
            value={bookData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Section:</label>
          <input
            name="section"
            value={bookData.section}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
};

export default EditBook;