import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullPage message="Aggregating platform metrics..." />;
  if (!stats) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Platform Administration</h2>
            <p className="text-muted mb-0">System-wide overview of registered accounts, courses, and platform engagement.</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/users" className="btn btn-primary-custom d-flex align-items-center gap-2">
              <i className="bi bi-people-fill"></i>
              <span>Manage Users</span>
            </Link>
            <Link to="/admin/courses" className="btn btn-outline-custom d-flex align-items-center gap-2">
              <i className="bi bi-book-half"></i>
              <span>Course Moderation</span>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon primary">
                <i className="bi bi-people-fill"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Total Registered Users</div>
                <h3 className="fw-bold mb-0 text-dark">{stats.totalUsers}</h3>
                <div className="text-muted small mt-1">
                  {stats.totalStudents} students &bull; {stats.totalInstructors} instructors
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon success">
                <i className="bi bi-collection-play-fill"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Platform Courses</div>
                <h3 className="fw-bold mb-0 text-dark">{stats.totalCourses}</h3>
                <div className="text-muted small mt-1">
                  {stats.publishedCourses} published &bull; {stats.unpublishedCourses} drafts
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon info">
                <i className="bi bi-clipboard-check-fill"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Course Enrollments</div>
                <h3 className="fw-bold mb-0 text-dark">{stats.totalEnrollments}</h3>
                <div className="text-muted small mt-1">Active student enrollments</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon warning">
                <i className="bi bi-file-earmark-check-fill"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Submissions</div>
                <h3 className="fw-bold mb-0 text-dark">{stats.totalSubmissions}</h3>
                <div className="text-muted small mt-1">
                  {stats.gradedSubmissions} graded &bull; {stats.pendingSubmissions} pending
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Sections */}
        <div className="row g-4">
          {/* Recent Users */}
          <div className="col-lg-6">
            <div className="card-custom p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Recently Registered Users</h5>
                <Link to="/admin/users" className="text-decoration-none small text-primary fw-semibold">
                  View All Users
                </Link>
              </div>

              {stats.recentUsers && stats.recentUsers.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {stats.recentUsers.map((u) => (
                    <div key={u.id} className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center border">
                      <div className="d-flex align-items-center gap-3 overflow-hidden">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold small"
                          style={{ width: '40px', height: '40px' }}
                        >
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                          <h6 className="fw-bold text-dark text-truncate mb-0">{u.name}</h6>
                          <div className="text-muted small text-truncate">{u.email}</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge ${
                          u.role === 'ROLE_ADMIN'
                            ? 'badge-role-admin'
                            : u.role === 'ROLE_INSTRUCTOR'
                            ? 'badge-role-instructor'
                            : 'badge-role-student'
                        }`}>
                          {u.role.replace('ROLE_', '')}
                        </span>
                        <span className={`badge ${u.active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small text-center py-4">No recent users.</p>
              )}
            </div>
          </div>

          {/* Recent Courses */}
          <div className="col-lg-6">
            <div className="card-custom p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Recent Platform Courses</h5>
                <Link to="/admin/courses" className="text-decoration-none small text-primary fw-semibold">
                  Moderate Courses
                </Link>
              </div>

              {stats.recentCourses && stats.recentCourses.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {stats.recentCourses.map((c) => (
                    <div key={c.id} className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3 overflow-hidden">
                        <img
                          src={c.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                          alt={c.title}
                          className="rounded-2"
                          style={{ width: '50px', height: '38px', objectFit: 'cover' }}
                        />
                        <div className="overflow-hidden">
                          <h6 className="fw-bold text-dark text-truncate mb-1">{c.title}</h6>
                          <div className="text-muted small">
                            By {c.instructor?.name || 'Instructor'} &bull; {c.category}
                          </div>
                        </div>
                      </div>

                      <span className={`badge ${c.published ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                        {c.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small text-center py-4">No courses available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
