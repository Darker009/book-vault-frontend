import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BookSlider = ({ books }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(books.length, 3),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(books.length, 2),
          slidesToScroll: 1,
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

  return (
    <div className="book-slider">
      <Slider {...settings}>
        {books.map(book => (
          <div key={book.id} className="slider-card">
            <img src={book.image || '/book-placeholder.png'} alt={book.title} />
            <div className="slider-content">
              <h4>{book.title}</h4>
              <p>{book.author}</p>
              <span className="badge">{book.category}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BookSlider;