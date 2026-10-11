import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm mb-4" role="alert">
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
        <div>{message}</div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-sm btn-outline-danger">
          <i className="bi bi-arrow-clockwise me-1"></i> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
