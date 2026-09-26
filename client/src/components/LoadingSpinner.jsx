import React from 'react';

const LoadingSpinner = ({ message = 'Loading content...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{ color: '#78716C', fontSize: '0.95rem', fontWeight: '500' }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
