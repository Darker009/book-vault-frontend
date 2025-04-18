import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import style from "./Style.module.css";
const BookCardSlider = ({ books }) => {
  return (
    <Swiper
      spaceBetween={10}  // Space between slides
      slidesPerView={1}  // Only one slide at a time
      navigation  // Add navigation arrows
      pagination={{ clickable: true }}  // Clickable pagination bullets
      breakpoints={{
        640: {
          slidesPerView: 1,  // For smaller screens (like mobile), show one card at a time
        },
        1024: {
          slidesPerView: 1,  // For larger screens, still show one card
        },
      }}
    >
      {books.map((book, index) => (
        <SwiperSlide key={index}>
          <div className={style.book-card}>
            <img src={book.image} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BookCardSlider;
