import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gradeService } from '../services/gradeService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const MyGrades = () => {
  const [gradebook, setGradebook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');

  useEffect(() => {
    const fetchGradebook = async () => {
      try {
        const data = await gradeService.getMyGradebook();
        setGradebook(data || []);
      } catch (err) {
        console.error('Failed to load student gradebook:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGradebook();
  }, []);

  if (loading) return <LoadingSpinner fullPage message="Loading gradebook records..." />;

  // Unique course list for filtering
  const distinctCourses = Array.from(new Set(gradebook.map((g) => g.courseName)));

  const filteredEntries = selectedCourseFilter
    ? gradebook.filter((g) => g.courseName === selectedCourseFilter)
    : gradebook;

  // Calculate overall performance accurately without penalizing ungraded assignments with false zero
  const gradedList = filteredEntries.filter((g) => g.gradingStatus === 'GRADED' && g.marksObtained !== null);
  const totalEarnedMarks = gradedList.reduce((acc, g) => acc + parseFloat(g.marksObtained || 0), 0);
  const totalGradedMaxMarks = gradedList.reduce((acc, g) => acc + parseFloat(g.maxMarks || 0), 0);
  const overallPercentage = totalGradedMaxMarks > 0 ? ((totalEarnedMarks / totalGradedMaxMarks) * 100).toFixed(1) : null;

  const getStatusBadge = (entry) => {
    if (entry.gradingStatus === 'GRADED') {
      return <span className="badge badge-status-graded">Graded</span>;
    }
    if (entry.submissionStatus === 'LATE') {
      return <span className="badge badge-status-late">Submitted Late</span>;
    }
    if (entry.submissionStatus === 'SUBMITTED') {
      return <span className="badge badge-status-submitted">Pending Grading</span>;
    }
    return <span className="badge badge-status-notsubmitted">Not Submitted</span>;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">My Academic Gradebook</h2>
            <p className="text-muted mb-0">Review all your assignment submissions, marks obtained, percentages, and instructor feedback.</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <div className="stat-card">
              <div className="stat-icon primary">
                <i className="bi bi-card-checklist"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Total Assignments</div>
                <h3 className="fw-bold mb-0 text-dark">{filteredEntries.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="stat-card">
              <div className="stat-icon success">
                <i className="bi bi-award-fill"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Graded Submissions</div>
                <h3 className="fw-bold mb-0 text-dark">{gradedList.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="stat-card">
              <div className="stat-icon info">
                <i className="bi bi-graph-up"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Overall Graded Average</div>
                <h3 className="fw-bold mb-0 text-dark">
                  {overallPercentage !== null ? `${overallPercentage}%` : 'N/A'}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        {distinctCourses.length > 1 && (
          <div className="card-custom p-3 mb-4" style={{ maxWidth: '360px' }}>
            <label className="form-label small fw-semibold text-muted mb-1">Filter By Course:</label>
            <select
              className="form-select form-select-sm"
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
            >
              <option value="">All Enrolled Courses</option>
              {distinctCourses.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {/* Gradebook Table */}
        <div className="card-custom overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3">Assignment</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-center">Score</th>
                  <th className="py-3 text-center">Percentage</th>
                  <th className="py-3">Feedback & Notes</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="px-4 fw-semibold text-dark text-truncate" style={{ maxWidth: '200px' }}>
                        <Link to={`/courses/${entry.courseId}`} className="text-dark text-decoration-none hover-primary">
                          {entry.courseName}
                        </Link>
                      </td>
                      <td>
                        <span className="fw-medium text-dark">{entry.assignmentTitle}</span>
                        <div className="text-muted small">Max Marks: {entry.maxMarks}</div>
                      </td>
                      <td>{getStatusBadge(entry)}</td>
                      <td className="text-center">
                        {entry.marksObtained !== null ? (
                          <strong className="text-dark">{entry.marksObtained} / {entry.maxMarks}</strong>
                        ) : (
                          <span className="text-muted fst-italic">--</span>
                        )}
                      </td>
                      <td className="text-center">
                        {entry.percentage !== null ? (
                          <span className={`badge ${parseFloat(entry.percentage) >= 70 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                            {entry.percentage}%
                          </span>
                        ) : (
                          <span className="text-muted fst-italic">--</span>
                        )}
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        {entry.feedback ? (
                          <div className="p-2 bg-light rounded-2 small text-secondary border">
                            {entry.feedback}
                          </div>
                        ) : (
                          <span className="text-muted small">No feedback provided yet</span>
                        )}
                      </td>
                      <td className="text-muted small">
                        {entry.gradingDate
                          ? new Date(entry.gradingDate).toLocaleDateString()
                          : entry.submittedAt
                          ? new Date(entry.submittedAt).toLocaleDateString()
                          : new Date(entry.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No assignments found in your enrolled courses.
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

export default MyGrades;
