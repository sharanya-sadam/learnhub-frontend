import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAllEnrollments();
        setEnrollments(data || []);
      } catch (err) {
        console.error('Failed to load enrollments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) return <LoadingSpinner fullPage message="Loading platform enrollments..." />;

  const filtered = enrollments.filter(
    (e) =>
      e.courseTitle.toLowerCase().includes(filter.toLowerCase()) ||
      e.student?.name.toLowerCase().includes(filter.toLowerCase()) ||
      e.student?.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Platform Enrollments</h2>
            <p className="text-muted mb-0">Monitor all course enrollments, active students, and progress completion rates.</p>
          </div>
          <div className="badge bg-light text-dark border px-3 py-2 fs-6">
            Total Enrollments: <strong>{enrollments.length}</strong>
          </div>
        </div>

        {/* Filter Input */}
        <div className="card-custom p-3 mb-4" style={{ maxWidth: '400px' }}>
          <div className="input-group">
            <span className="input-group-text bg-transparent border-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-none text-dark"
              placeholder="Search by student or course..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="card-custom overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3">Course</th>
                  <th className="py-3">Enrolled Date</th>
                  <th className="py-3" style={{ minWidth: '180px' }}>Progress</th>
                  <th className="py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((e) => (
                    <tr key={e.id}>
                      <td className="px-4">
                        <div className="fw-bold text-dark">{e.student?.name}</div>
                        <div className="text-muted small">{e.student?.email}</div>
                      </td>
                      <td className="fw-semibold text-dark">{e.courseTitle}</td>
                      <td className="text-muted small">
                        {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <ProgressBar value={e.progressPercentage || 0} showLabel labelPrefix="" />
                        <div className="text-muted small mt-1">
                          {e.completedLessons} / {e.totalLessons} lessons
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-success-subtle text-success">
                          {e.status || 'ACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No enrollments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageEnrollments;
