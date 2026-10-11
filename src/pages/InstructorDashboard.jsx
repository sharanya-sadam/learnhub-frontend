import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseService';
import { gradeService } from '../services/gradeService';
import Sidebar from '../components/Sidebar';
import GradeSubmissionModal from '../components/GradeSubmissionModal';
import LoadingSpinner from '../components/LoadingSpinner';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const coursesData = await courseService.getMyTeachingCourses();
      setCourses(coursesData || []);

      // Gather submissions for these courses
      const allSubmissions = [];
      for (const c of coursesData || []) {
        try {
          const subs = await gradeService.getCourseGradebook(c.id);
          allSubmissions.push(...subs);
        } catch (e) {
          // ignore course without submissions
        }
      }
      setSubmissions(allSubmissions);
    } catch (err) {
      console.error('Failed to load instructor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner fullPage message="Loading instructor dashboard..." />;

  const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrollmentCount || 0), 0);
  const pendingSubmissions = submissions.filter((s) => s.status !== 'GRADED');
  const gradedSubmissions = submissions.filter((s) => s.status === 'GRADED');

  const handleOpenGrade = (sub) => {
    setSelectedSubmission(sub);
    setIsGradeModalOpen(true);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Instructor Studio &bull; {user?.name}</h2>
            <p className="text-muted mb-0">Manage your course curriculum, monitor enrollments, and evaluate student submissions.</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/instructor/courses/new" className="btn btn-primary-custom d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle"></i>
              <span>Create New Course</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon primary">
                <i className="bi bi-journal-richtext"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Courses Created</div>
                <h3 className="fw-bold mb-0 text-dark">{courses.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon success">
                <i className="bi bi-people-fill"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Total Enrolled Students</div>
                <h3 className="fw-bold mb-0 text-dark">{totalEnrollments}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon warning">
                <i className="bi bi-file-earmark-check"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Pending Submissions</div>
                <h3 className="fw-bold mb-0 text-dark">{pendingSubmissions.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon info">
                <i className="bi bi-award-fill"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Graded Submissions</div>
                <h3 className="fw-bold mb-0 text-dark">{gradedSubmissions.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Two Columns: Pending Submissions & Course Performance */}
        <div className="row g-4">
          {/* Pending Submissions */}
          <div className="col-lg-6">
            <div className="card-custom p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Submissions Awaiting Grading</h5>
                <span className="badge bg-warning text-dark">{pendingSubmissions.length} pending</span>
              </div>

              {pendingSubmissions.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {pendingSubmissions.map((sub) => (
                    <div key={sub.id} className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center border">
                      <div className="overflow-hidden">
                        <div className="fw-bold text-dark text-truncate">{sub.assignmentTitle}</div>
                        <div className="text-muted small">
                          Student: <strong>{sub.student?.name}</strong> &bull; {new Date(sub.submittedAt).toLocaleDateString()}
                        </div>
                        {sub.status === 'LATE' && <span className="badge badge-status-late mt-1">Submitted Late</span>}
                      </div>

                      <button onClick={() => handleOpenGrade(sub)} className="btn btn-sm btn-primary-custom ms-2 flex-shrink-0">
                        Grade Now
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-check-all fs-1 text-success mb-2"></i>
                  <p className="small mb-0">All student submissions are up to date! Great job.</p>
                </div>
              )}
            </div>
          </div>

          {/* Courses Summary */}
          <div className="col-lg-6">
            <div className="card-custom p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">My Teaching Courses</h5>
                <Link to="/instructor/courses" className="text-decoration-none small text-primary fw-semibold">
                  Manage All
                </Link>
              </div>

              {courses.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {courses.map((course) => (
                    <div key={course.id} className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3 overflow-hidden">
                        <img
                          src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                          alt={course.title}
                          className="rounded-2"
                          style={{ width: '56px', height: '42px', objectFit: 'cover' }}
                        />
                        <div className="overflow-hidden">
                          <h6 className="fw-bold text-dark text-truncate mb-1">{course.title}</h6>
                          <div className="text-muted small">
                            <span>{course.enrollmentCount} students</span> &bull; <span>{course.lessonCount} lessons</span>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 ms-2 flex-shrink-0">
                        <span className={`badge ${course.published ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                          {course.published ? 'Published' : 'Draft'}
                        </span>
                        <Link to={`/instructor/courses/${course.id}/edit`} className="btn btn-sm btn-light border">
                          <i className="bi bi-pencil"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <p className="small mb-2">You haven't created any courses yet.</p>
                  <Link to="/instructor/courses/new" className="btn btn-sm btn-primary-custom">
                    Create Your First Course
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Grade Submission Modal */}
      <GradeSubmissionModal
        isOpen={isGradeModalOpen}
        submission={selectedSubmission}
        onClose={() => setIsGradeModalOpen(false)}
        onGraded={fetchDashboardData}
      />
    </div>
  );
};

export default InstructorDashboard;
