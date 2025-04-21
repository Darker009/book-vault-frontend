import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import BookService from '../../services/BookService';
import UserService from '../../services/UserService';
import { getUser } from '../../services/tokenService'
import { FiBook, FiSearch, FiUser, FiBell, FiClock, FiCheckCircle } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userImage, setUserImage] = useState('/default-avatar.png');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedBooks: 0,
    availableBooks: 0,
    slotsLeft: 3
  });
  const storedUser = getUser();
  const userId = storedUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allBooks, borrowed] = await Promise.all([
          BookService.getAllBooks(),
          BookService.getMyBorrowedBooks()
        ]);

        // Get book images with error handling
        const booksWithImages = await Promise.all(
          allBooks.map(async book => ({
            ...book,
            image: await BookService.getBookImage(book.id).catch(() => '/book-placeholder.png')
          }))
        );

        const activeBorrowed = borrowed.filter(b => !b.returned);
        setBooks(booksWithImages);
        setBorrowedBooks(borrowed);
        setStats({
          totalBooks: allBooks.length,
          borrowedBooks: activeBorrowed.length,
          availableBooks: allBooks.length - activeBorrowed.length,
          slotsLeft: Math.max(0, 3 - activeBorrowed.length)
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserImage = async () => {
      if (user?.id) {
        try {
          const image = await UserService.getProfileImage(userId);
          setUserImage(image || '/default-avatar.png');
        } catch (error) {
          console.error('Failed to fetch user image:', error);
          setUserImage('/default-avatar.png');
        }
      }
    };

    fetchUserImage();
  }, [user?.id]);

  const handleReturn = async (borrowId) => {
    try {
      await BookService.returnBook(borrowId);
      const updated = await BookService.getMyBorrowedBooks();
      const activeBorrowed = updated.filter(b => !b.returned);

      setBorrowedBooks(updated);
      setStats(prev => ({
        ...prev,
        borrowedBooks: activeBorrowed.length,
        availableBooks: books.length - activeBorrowed.length,
        slotsLeft: Math.max(0, 3 - activeBorrowed.length)
      }));
    } catch (error) {
      console.error('Return failed:', error);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await BookService.borrowBook(bookId);
      const updated = await BookService.getMyBorrowedBooks();
      const activeBorrowed = updated.filter(b => !b.returned);

      setBorrowedBooks(updated);
      setStats(prev => ({
        ...prev,
        borrowedBooks: activeBorrowed.length,
        availableBooks: books.length - activeBorrowed.length,
        slotsLeft: Math.max(0, 3 - activeBorrowed.length)
      }));
    } catch (error) {
      alert('Failed to borrow book. You might have reached your limit or already borrowed it.');
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = [book.title, book.author, book.category, book.genre]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));

      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'borrowed') {
        return matchesSearch && borrowedBooks.some(b => b.book?.id === book.id && !b.returned);
      }
      if (activeTab === 'available') {
        return matchesSearch && !borrowedBooks.some(b => b.book?.id === book.id && !b.returned);
      }
      return matchesSearch;
    });
  }, [books, searchTerm, activeTab, borrowedBooks]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Welcome back, {user?.name || 'Student'}</h1>
          <p className="subtitle">Here's what's happening in your library</p>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link to="/profile">
            <div className="user-avatar">
              <img
                src={userImage}
                alt={user?.name || 'User'}
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                  e.target.onerror = null;
                }}
              />
            </div>
          </Link>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100 text-blue-600">
            <FiBook />
          </div>
          <div>
            <h3>Total Books</h3>
            <p>{stats.totalBooks}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green-100 text-green-600">
            <FiCheckCircle />
          </div>
          <div>
            <h3>Available</h3>
            <p>{stats.availableBooks}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100 text-yellow-600">
            <FiClock />
          </div>
          <div>
            <h3>Borrowed</h3>
            <p>{stats.borrowedBooks}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple-100 text-purple-600">
            <FiUser />
          </div>
          <div>
            <h3>Slots Left</h3>
            <p>{stats.slotsLeft}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Left Column - Books List */}
        <div className="content-left">
          <div className="section-card">
            <div className="section-header">
              <h2><FiBook /> My Books</h2>
              <div className="tabs">
                <button
                  className={activeTab === 'all' ? 'active' : ''}
                  onClick={() => setActiveTab('all')}
                >
                  All
                </button>
                <button
                  className={activeTab === 'borrowed' ? 'active' : ''}
                  onClick={() => setActiveTab('borrowed')}
                >
                  Borrowed
                </button>
                <button
                  className={activeTab === 'available' ? 'active' : ''}
                  onClick={() => setActiveTab('available')}
                >
                  Available
                </button>
              </div>
            </div>

            <div className="books-grid">
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => {
                  const isBorrowed = borrowedBooks.some(b => b.book?.id === book.id && !b.returned);
                  const borrowRecord = borrowedBooks.find(b => b.book?.id === book.id && !b.returned);

                  return (
                    <div key={book.id} className="book-card">
                      <div className="book-image-container">
                        <img
                          src={book.image}
                          alt={book.title}
                          onError={(e) => {
                            e.target.src = '/book-placeholder.png';
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      <div className="book-details">
                        <h3>{book.title}</h3>
                        <p className="author">{book.author}</p>
                        <div className="book-meta">
                          <span className="category">{book.category}</span>
                          <span className={`status ${isBorrowed ? 'borrowed' : 'available'}`}>
                            {isBorrowed ? 'Borrowed' : 'Available'}
                          </span>
                        </div>
                        {isBorrowed ? (
                          <button
                            className="return-btn"
                            onClick={() => handleReturn(borrowRecord.id)}
                          >
                            Return Book
                          </button>
                        ) : (
                          <button
                            className="borrow-btn"
                            disabled={stats.slotsLeft <= 0}
                            onClick={() => handleBorrow(book.id)}
                          >
                            {stats.slotsLeft <= 0 ? 'No Slots Left' : 'Borrow'}
                          </button>
                        )}

                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <p>No books found matching your search</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Featured Books Slider */}
        <div className="content-right">
          <div className="section-card">
            <h2>Featured Books</h2>
            <div className="slider-container">
              <Slider {...sliderSettings}>
                {books.slice(0, 6).map(book => (
                  <div key={`slider-${book.id}`} className="slider-card">
                    <div className="slider-image-container">
                      <img
                        src={book.image}
                        alt={book.title}
                        onError={(e) => {
                          e.target.src = '/book-placeholder.png';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="slider-content">
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                      <span className="category-badge">{book.category}</span>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;