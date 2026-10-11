import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignmentService } from '../services/assignmentService';
import { submissionService } from '../services/submissionService';
import Sidebar from '../components/Sidebar';
import GradeSubmissionModal from '../components/GradeSubmissionModal';
import LoadingSpinner from '../components/LoadingSpinner';

const ViewSubmissions = () => {
  const { id } = useParams(); // assignmentId
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, GRADED
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  const fetchSubmissionsData = async () => {
    try {
      setLoading(true);
      const [assignmentData, subsData] = await Promise.all([
        assignmentService.getAssignmentById(id),
        submissionService.getAssignmentSubmissions(id),
      ]);
      setAssignment(assignmentData);
      setSubmissions(subsData || []);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionsData();
  }, [id]);

  const handleOpenGradeModal = (sub) => {
    setSelectedSubmission(sub);
    setIsGradeModalOpen(true);
  };

  if (loading) return <LoadingSpinner fullPage message="Loading submissions..." />;
  if (!assignment) return null;

  const filteredList = submissions.filter((s) => {
    if (filter === 'PENDING') return s.status !== 'GRADED';
    if (filter === 'GRADED') return s.status === 'GRADED';
    return true;
  });

  const getStatusBadge = (sub) => {
    if (sub.status === 'GRADED') {
      return <span className="badge badge-status-graded">Graded ({sub.marksAwarded}/{sub.maxMarks})</span>;
    }
    if (sub.status === 'LATE') {
      return <span className="badge badge-status-late">Late Submission</span>;
    }
    return <span className="badge badge-status-submitted">Pending Grading</span>;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <Link to={`/instructor/courses/${assignment.courseId}/assignments`} className="text-decoration-none text-muted small hover-primary mb-2 d-inline-block">
              <i className="bi bi-chevron-left me-1"></i> Back to Assignments
            </Link>
            <h2 className="fw-bold text-dark mb-1">Submissions: {assignment.title}</h2>
            <p className="text-muted mb-0">
              Course: <strong>{assignment.courseTitle}</strong> &bull; Max Marks: <strong>{assignment.maxMarks}</strong> &bull; Total Submissions: <strong>{submissions.length}</strong>
            </p>
          </div>

          {/* Filter Pills */}
          <div className="btn-group shadow-sm">
            <button
              className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
              onClick={() => setFilter('ALL')}
            >
              All ({submissions.length})
            </button>
            <button
              className={`btn btn-sm ${filter === 'PENDING' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
              onClick={() => setFilter('PENDING')}
            >
              Pending ({submissions.filter((s) => s.status !== 'GRADED').length})
            </button>
            <button
              className={`btn btn-sm ${filter === 'GRADED' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
              onClick={() => setFilter('GRADED')}
            >
              Graded ({submissions.filter((s) => s.status === 'GRADED').length})
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="card-custom overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3">Submission Details</th>
                  <th className="py-3">Submitted At</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-center">Marks</th>
                  <th className="py-3 text-end px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length > 0 ? (
                  filteredList.map((sub) => (
                    <tr key={sub.id}>
                      <td className="px-4">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold small"
                            style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                          >
                            {sub.student?.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{sub.student?.name}</div>
                            <div className="text-muted small">{sub.student?.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {sub.textResponse && (
                          <div className="text-muted small text-truncate" style={{ maxWidth: '240px' }} title={sub.textResponse}>
                            <i className="bi bi-file-text me-1 text-primary"></i>
                            {sub.textResponse}
                          </div>
                        )}
                        {sub.filePath && (
                          <div className="mt-1">
                            <a
                              href={`/api/files/${sub.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none small text-primary d-inline-flex align-items-center gap-1"
                            >
                              <i className="bi bi-download"></i>
                              <span>{sub.originalFileName || 'Attachment'}</span>
                            </a>
                          </div>
                        )}
                      </td>

                      <td className="small text-muted">
                        {new Date(sub.submittedAt).toLocaleString()}
                        {sub.submissionVersion > 1 && (
                          <span className="badge bg-light text-muted ms-1">v{sub.submissionVersion}</span>
                        )}
                      </td>

                      <td>{getStatusBadge(sub)}</td>

                      <td className="text-center fw-bold text-dark">
                        {sub.marksAwarded !== null ? (
                          <span className="text-success">{sub.marksAwarded} / {sub.maxMarks}</span>
                        ) : (
                          <span className="text-muted fst-italic">--</span>
                        )}
                      </td>

                      <td className="text-end px-4">
                        <button
                          onClick={() => handleOpenGradeModal(sub)}
                          className={`btn btn-sm ${sub.status === 'GRADED' ? 'btn-outline-custom' : 'btn-primary-custom'}`}
                        >
                          <i className="bi bi-check2-square me-1"></i>
                          {sub.status === 'GRADED' ? 'Update Grade' : 'Grade'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No submissions found matching this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Grade Submission Modal */}
      <GradeSubmissionModal
        isOpen={isGradeModalOpen}
        submission={selectedSubmission}
        onClose={() => setIsGradeModalOpen(false)}
        onGraded={fetchSubmissionsData}
      />
    </div>
  );
};

export default ViewSubmissions;
