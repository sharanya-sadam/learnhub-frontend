import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', fullPage = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <div className="spinner-border text-primary" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-3 text-muted fw-medium">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-50 w-100 py-5">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
