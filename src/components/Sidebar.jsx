import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, isAdmin, isInstructor, isStudent } = useAuth();

  return (
    <aside className="dashboard-sidebar">
      <div className="d-flex align-items-center gap-3 mb-4 px-2">
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm"
          style={{ width: '45px', height: '45px' }}
        >
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="overflow-hidden">
          <div className="fw-bold text-truncate">{user?.name}</div>
          <span className="badge bg-light text-secondary border">
            {isAdmin ? 'Administrator' : isInstructor ? 'Instructor' : 'Student'}
          </span>
        </div>
      </div>

      <nav className="nav flex-column">
        {isStudent && (
          <>
            <div className="text-uppercase text-muted fw-bold small px-3 mb-2" style={{ fontSize: '0.72rem' }}>
              Student Hub
            </div>
            <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/my-courses" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-collection-play"></i>
              <span>My Enrolled Courses</span>
            </NavLink>
            <NavLink to="/catalog" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-search"></i>
              <span>Explore Catalog</span>
            </NavLink>
            <NavLink to="/grades" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-award"></i>
              <span>My Gradebook</span>
            </NavLink>
          </>
        )}

        {isInstructor && (
          <>
            <div className="text-uppercase text-muted fw-bold small px-3 mb-2" style={{ fontSize: '0.72rem' }}>
              Instructor Studio
            </div>
            <NavLink to="/instructor/dashboard" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/instructor/courses" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-journal-richtext"></i>
              <span>Manage Courses</span>
            </NavLink>
            <NavLink to="/instructor/courses/new" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-plus-circle"></i>
              <span>Create New Course</span>
            </NavLink>
            <NavLink to="/catalog" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-globe"></i>
              <span>Public Catalog</span>
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <div className="text-uppercase text-muted fw-bold small px-3 mb-2" style={{ fontSize: '0.72rem' }}>
              Administration
            </div>
            <NavLink to="/admin/dashboard" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-pie-chart-fill"></i>
              <span>Overview & Stats</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-people-fill"></i>
              <span>User Management</span>
            </NavLink>
            <NavLink to="/admin/courses" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-book-half"></i>
              <span>Course Moderation</span>
            </NavLink>
            <NavLink to="/admin/enrollments" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-clipboard-check"></i>
              <span>Enrollments</span>
            </NavLink>
          </>
        )}

        <hr className="my-3 text-muted" />

        <div className="text-uppercase text-muted fw-bold small px-3 mb-2" style={{ fontSize: '0.72rem' }}>
          Account
        </div>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-person-circle"></i>
          <span>Profile & Security</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
