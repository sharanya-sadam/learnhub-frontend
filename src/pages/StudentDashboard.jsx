import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentService } from '../services/enrollmentService';
import { gradeService } from '../services/gradeService';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enrollmentData, gradeData] = await Promise.all([
          enrollmentService.getMyEnrollments(),
          gradeService.getMyGradebook(),
        ]);
        setEnrollments(enrollmentData || []);
        setGrades(gradeData || []);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner fullPage message="Loading student workspace..." />;

  const activeCourse = enrollments.length > 0 ? enrollments[0] : null;
  const totalCompletedLessons = enrollments.reduce((acc, e) => acc + (e.completedLessons || 0), 0);
  const gradedAssignments = grades.filter((g) => g.gradingStatus === 'GRADED');
  const pendingAssignments = grades.filter((g) => g.submissionStatus !== 'NOT_SUBMITTED' && g.gradingStatus === 'PENDING_GRADING');

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Welcome Banner */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Welcome back, {user?.name}! 👋</h2>
            <p className="text-muted mb-0">Track your courses, watch video lessons, and monitor your assignments.</p>
          </div>
          <Link to="/catalog" className="btn btn-primary-custom">
            <i className="bi bi-compass me-1"></i> Explore More Courses
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon primary">
                <i className="bi bi-collection-play-fill"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Enrolled Courses</div>
                <h3 className="fw-bold mb-0 text-dark">{enrollments.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon success">
                <i className="bi bi-check2-circle"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Completed Lessons</div>
                <h3 className="fw-bold mb-0 text-dark">{totalCompletedLessons}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon warning">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Pending Review</div>
                <h3 className="fw-bold mb-0 text-dark">{pendingAssignments.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon info">
                <i className="bi bi-award-fill"></i>
              </div>
              <div>
                <div className="text-muted small fw-medium">Graded Assignments</div>
                <h3 className="fw-bold mb-0 text-dark">{gradedAssignments.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning Featured Card */}
        {activeCourse && (
          <div className="card-custom p-4 mb-4" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', borderColor: '#bfdbfe' }}>
            <div className="row align-items-center g-3">
              <div className="col-md-8">
                <span className="badge bg-primary text-white mb-2">Continue Learning</span>
                <h4 className="fw-bold text-dark mb-1">{activeCourse.courseTitle}</h4>
                <p className="text-muted small mb-3">Pick up right where you left off in your modules.</p>
                <div className="d-flex align-items-center gap-3" style={{ maxWidth: '400px' }}>
                  <div className="flex-grow-1">
                    <ProgressBar value={activeCourse.progressPercentage || 0} showLabel labelPrefix="Course" />
                  </div>
                  <span className="text-muted small">
                    {activeCourse.completedLessons} / {activeCourse.totalLessons} lessons
                  </span>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <Link to={`/courses/${activeCourse.courseId}/learn`} className="btn btn-primary-custom px-4 py-2">
                  <i className="bi bi-play-circle-fill me-2"></i> Resume Lesson
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Two Columns: Enrolled Courses & Recent Grades */}
        <div className="row g-4">
          {/* Enrolled Courses */}
          <div className="col-lg-7">
            <div className="card-custom p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">My Active Courses</h5>
                <Link to="/my-courses" className="text-decoration-none small text-primary fw-semibold">
                  View All ({enrollments.length})
                </Link>
              </div>

              {enrollments.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {enrollments.slice(0, 3).map((enrollment) => (
                    <div key={enrollment.id} className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between border">
                      <div className="d-flex align-items-center gap-3 overflow-hidden">
                        <img
                          src={enrollment.courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                          alt={enrollment.courseTitle}
                          className="rounded-2"
                          style={{ width: '64px', height: '48px', objectFit: 'cover' }}
                        />
                        <div className="overflow-hidden">
                          <h6 className="fw-bold text-dark text-truncate mb-1">{enrollment.courseTitle}</h6>
                          <div className="d-flex align-items-center gap-2 small text-muted">
                            <span>{Math.round(enrollment.progressPercentage || 0)}% completed</span>
                            <span>&bull;</span>
                            <span>{enrollment.completedLessons}/{enrollment.totalLessons} lessons</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/courses/${enrollment.courseId}/learn`} className="btn btn-sm btn-outline-primary ms-3 flex-shrink-0">
                        Continue
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-journal-plus fs-2 mb-2"></i>
                  <p className="small mb-2">You have not enrolled in any courses yet.</p>
                  <Link to="/catalog" className="btn btn-sm btn-primary-custom">
                    Explore Course Catalog
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="col-lg-5">
            <div className="card-custom p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Recent Grades & Feedback</h5>
                <Link to="/grades" className="text-decoration-none small text-primary fw-semibold">
                  Full Gradebook
                </Link>
              </div>

              {grades.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {grades.slice(0, 4).map((g, idx) => (
                    <div key={idx} className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div className="fw-bold small text-dark text-truncate" style={{ maxWidth: '200px' }}>
                          {g.assignmentTitle}
                        </div>
                        {g.gradingStatus === 'GRADED' ? (
                          <span className="badge badge-status-graded">
                            {g.marksObtained} / {g.maxMarks} ({g.percentage}%)
                          </span>
                        ) : g.submissionStatus !== 'NOT_SUBMITTED' ? (
                          <span className="badge badge-status-pending">Pending Review</span>
                        ) : (
                          <span className="badge badge-status-notsubmitted">Due</span>
                        )}
                      </div>
                      <div className="text-muted small text-truncate">{g.courseName}</div>
                      {g.feedback && (
                        <div className="mt-2 p-2 bg-white rounded-2 border text-muted small fst-italic">
                          "{g.feedback}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">
                  No assignment grades recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
