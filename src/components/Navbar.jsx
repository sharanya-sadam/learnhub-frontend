import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isInstructor, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isInstructor) return '/instructor/dashboard';
    return '/dashboard';
  };

  const getRoleBadge = () => {
    if (isAdmin) return <span className="badge badge-role-admin ms-2">Admin</span>;
    if (isInstructor) return <span className="badge badge-role-instructor ms-2">Instructor</span>;
    return <span className="badge badge-role-student ms-2">Student</span>;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        <Link to="/" className="brand-logo">
          <i className="bi bi-mortarboard-fill text-primary"></i>
          <span>LearnHub</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className={`nav-link fw-medium ${location.pathname === '/' ? 'active text-primary' : 'text-secondary'}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link fw-medium ${location.pathname === '/catalog' ? 'active text-primary' : 'text-secondary'}`} to="/catalog">
                Explore Courses
              </Link>
            </li>

            {isAuthenticated && isStudent && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link fw-medium ${location.pathname === '/my-courses' ? 'active text-primary' : 'text-secondary'}`} to="/my-courses">
                    My Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link fw-medium ${location.pathname === '/grades' ? 'active text-primary' : 'text-secondary'}`} to="/grades">
                    Gradebook
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && isInstructor && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link fw-medium ${location.pathname === '/instructor/courses' ? 'active text-primary' : 'text-secondary'}`} to="/instructor/courses">
                    Manage Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link fw-medium ${location.pathname === '/instructor/courses/new' ? 'active text-primary' : 'text-secondary'}`} to="/instructor/courses/new">
                    + Create Course
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link fw-medium ${location.pathname === '/admin/users' ? 'active text-primary' : 'text-secondary'}`} to="/admin/users">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link fw-medium ${location.pathname === '/admin/courses' ? 'active text-primary' : 'text-secondary'}`} to="/admin/courses">
                    All Courses
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <Link to={getDashboardPath()} className="btn btn-outline-custom btn-sm d-flex align-items-center gap-1">
                  <i className="bi bi-grid-fill"></i>
                  <span>Dashboard</span>
                </Link>

                <div className="dropdown">
                  <button
                    className="btn btn-light d-flex align-items-center gap-2 border px-2 py-1 rounded-3 dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="fw-semibold text-sm d-none d-md-inline">{user.name}</span>
                    {getRoleBadge()}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2" aria-labelledby="userDropdown">
                    <li className="px-3 py-2 border-bottom">
                      <div className="fw-bold text-dark">{user.name}</div>
                      <div className="text-muted small">{user.email}</div>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to={getDashboardPath()}>
                        <i className="bi bi-speedometer2"></i> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/profile">
                        <i className="bi bi-person"></i> My Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <button className="dropdown-item py-2 text-danger d-flex align-items-center gap-2" onClick={logout}>
                        <i className="bi bi-box-arrow-right"></i> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-custom btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary-custom btn-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
