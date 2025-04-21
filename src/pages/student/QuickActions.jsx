import React from 'react';
import { FiBookOpen, FiSearch, FiClock, FiUser } from 'react-icons/fi';

const QuickActions = ({ slotsLeft, onBorrow }) => {
  const actions = [
    {
      title: 'Browse Books',
      icon: <FiBookOpen />,
      action: () => window.scrollTo(0, document.body.scrollHeight),
      color: 'bg-indigo-500'
    },
    {
      title: 'Search Library',
      icon: <FiSearch />,
      action: () => document.querySelector('.search-bar input').focus(),
      color: 'bg-purple-500'
    },
    {
      title: 'Borrow New',
      icon: <FiClock />,
      action: onBorrow,
      disabled: slotsLeft <= 0,
      color: slotsLeft > 0 ? 'bg-green-500' : 'bg-gray-400'
    },
    {
      title: 'My Profile',
      icon: <FiUser />,
      action: () => window.location.href = '/profile',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`action-btn ${action.color}`}
            onClick={action.action}
            disabled={action.disabled}
          >
            <span className="action-icon">{action.icon}</span>
            <span>{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;