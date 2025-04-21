import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import UserService from "../../services/UserService";
import BookService from "../../services/BookService";
import { getUser } from "../../services/tokenService";
import Slider from "react-slick";
import { FiSearch, FiBook, FiUser, FiClock, FiCheckCircle } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [studentCount, setStudentCount] = useState(0);
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userImage, setUserImage] = useState("/default-avatar.png");
  const storedUser = getUser();
  const [totalBookQuantity, setTotalBookQuantity] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [students, allBooks, borrowed] = await Promise.all([
          UserService.getCountOfStudent(),
          BookService.getAllBooks(),
          BookService.getAllBorrowedBooks()
        ]);

        const booksWithImages = await Promise.all(
          allBooks.map(async book => ({
            ...book,
            image: await BookService.getBookImage(book.id).catch(() => "/book-placeholder.png")
          }))
        );

        setStudentCount(students);
        setBooks(booksWithImages);

        setTotalBookQuantity(booksWithImages.reduce((sum, book) => sum + book.quantity, 0));
        setBorrowedBooks(borrowed);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }

      try {
        if (storedUser?.id) {
          const image = await UserService.getProfileImage(storedUser.id);
          setUserImage(image || "/default-avatar.png");
        }
      } catch (err) {
        console.error("Failed to load profile image:", err);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalBooks = books.length;
    const activeBorrowed = borrowedBooks.filter(b => !b.returned).length;
    const availableBooks = totalBooks - activeBorrowed;

    return {
      totalBooks,
      borrowedBooks: activeBorrowed,
      availableBooks
    };
  }, [books, borrowedBooks]);

  const filteredBooks = useMemo(() => {
    return books.filter(book =>
      [book.title, book.author, book.category, book.genre]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [books, searchTerm]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="dashboard-container">
      
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Welcome Admin</h1>
          <p className="subtitle">Overview of your digital library</p>
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

          <div className="user-avatar">
            <Link to="/profile">
              <img
                src={userImage}
                alt="Admin"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                  e.target.onerror = null;
                }}
                style={{ cursor: "pointer" }}
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stats-grid">
          <div className="stat-card link-card" onClick={() => navigate("/admin/students")} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate("/admin/students")}>
            <div className="stat-icon ">
              <FiUser />
            </div>
            <div>
              <h3>Total Students</h3>
              <p>{studentCount}</p>
            </div>
          </div>

          <div className="stat-card link-card" onClick={() => navigate("/books")} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate("/books")}>
            <div className="stat-icon">
              <FiBook />
            </div>
            <div>
              <h3>Total Books</h3>
              <p>{totalBookQuantity}</p> {/* Show total book quantity here */}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FiCheckCircle />
            </div>
            <div>
              <h3>Available</h3>
              <p>{totalBookQuantity - stats.borrowedBooks}</p> {/* Available books = total books - borrowed books */}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FiClock />
            </div>
            <div>
              <h3>Borrowed</h3>
              <p>{stats.borrowedBooks}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Featured Books */}
      <div className="dashboard-content">
        <div className="content-full">
          <div className="section-card">
            <h2>Featured Books</h2>


            <div className="slider-container">
              <Slider {...sliderSettings}>
                {filteredBooks.slice(0, 6).map(book => (
                  <div key={`slider-${book.id}`} className="slider-card">
                    <div className="slider-image-container">
                      <img
                        src={book.image}
                        alt={book.title}
                        onError={(e) => {
                          e.target.src = "/book-placeholder.png";
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

export default AdminDashboard;
