import React from 'react';
import { FiBook, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const StatsCards = ({ stats }) => {
  const cards = [
    { 
      title: 'Total Books', 
      value: stats.totalBooks,
      icon: <FiBook />,
      color: 'bg-indigo-100 text-indigo-600'
    },
    { 
      title: 'Borrowed', 
      value: stats.borrowed,
      icon: <FiClock />,
      color: 'bg-yellow-100 text-yellow-600'
    },
    { 
      title: 'Available', 
      value: stats.available,
      icon: <FiCheckCircle />,
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: 'Slots Left', 
      value: stats.slotsLeft,
      icon: <FiAlertCircle />,
      color: stats.slotsLeft > 0 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className={`stat-card ${card.color}`}>
          <div className="stat-icon">{card.icon}</div>
          <div>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;