import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 my-auto text-center">
      <div className="py-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="display-1 fw-bold text-primary mb-3">404</div>
        <h3 className="fw-bold text-dark mb-2">Page Not Found</h3>
        <p className="text-muted mb-4">
          The educational resource or page you are looking for does not exist or has been moved.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/" className="btn btn-primary-custom px-4">
            <i className="bi bi-house-door me-2"></i> Return Home
          </Link>
          <Link to="/catalog" className="btn btn-outline-custom px-4">
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
