import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-top py-5 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="brand-logo mb-3">
              <i className="bi bi-mortarboard-fill text-primary"></i>
              <span>LearnHub</span>
            </Link>
            <p className="text-muted small mt-2">
              LearnHub is an enterprise-grade full-stack Learning Management System designed to empower students, instructors, and educational institutions with seamless learning and grading workflows.
            </p>
            <div className="d-flex gap-3 text-secondary fs-5 mt-3">
              <a href="#github" className="text-secondary hover-primary"><i className="bi bi-github"></i></a>
              <a href="#linkedin" className="text-secondary hover-primary"><i className="bi bi-linkedin"></i></a>
              <a href="#twitter" className="text-secondary hover-primary"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-dark">Platform</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
              <li><Link to="/catalog" className="text-muted text-decoration-none">Course Catalog</Link></li>
              <li><Link to="/login" className="text-muted text-decoration-none">Sign In</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none">Register Account</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-dark">Demo Credentials</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-1 mb-0">
              <li><span className="badge bg-danger-subtle text-danger me-1">Admin</span> admin@learnhub.com / Admin@123</li>
              <li><span className="badge bg-primary-subtle text-primary me-1">Instructor</span> instructor@learnhub.com / Instructor@123</li>
              <li><span className="badge bg-success-subtle text-success me-1">Student</span> student@learnhub.com / Student@123</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-dark">Architecture</h6>
            <div className="d-flex flex-wrap gap-1">
              <span className="badge bg-light text-dark border">React 18</span>
              <span className="badge bg-light text-dark border">Vite</span>
              <span className="badge bg-light text-dark border">Spring Boot 3</span>
              <span className="badge bg-light text-dark border">Spring Security</span>
              <span className="badge bg-light text-dark border">JWT</span>
              <span className="badge bg-light text-dark border">Hibernate JPA</span>
              <span className="badge bg-light text-dark border">MySQL</span>
            </div>
          </div>
        </div>

        <div className="border-top pt-3 d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
          <div>&copy; {new Date().getFullYear()} LearnHub LMS. All rights reserved.</div>
          <div className="mt-2 mt-md-0">
            <span>Built with precision for modern online education.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
