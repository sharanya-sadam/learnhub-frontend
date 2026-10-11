import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../services/enrollmentService';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await enrollmentService.getMyEnrollments();
        setEnrollments(data || []);
      } catch (err) {
        console.error('Failed to load enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) return <LoadingSpinner fullPage message="Loading your courses..." />;

  const filtered = enrollments.filter((e) =>
    e.courseTitle.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">My Enrolled Courses</h2>
            <p className="text-muted mb-0">Continue your lessons and track your course completion progress.</p>
          </div>
          <Link to="/catalog" className="btn btn-outline-custom">
            <i className="bi bi-search me-1"></i> Browse More Courses
          </Link>
        </div>

        {/* Filter Input */}
        {enrollments.length > 0 && (
          <div className="card-custom p-3 mb-4" style={{ maxWidth: '400px' }}>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none text-dark"
                placeholder="Filter my courses..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="row g-4">
            {filtered.map((enrollment) => (
              <div key={enrollment.id} className="col-12 col-md-6 col-xl-4">
                <div className="card-custom card-hoverable h-100 d-flex flex-column">
                  <img
                    src={enrollment.courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                    alt={enrollment.courseTitle}
                    className="course-card-thumb"
                  />
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold text-dark mb-2 text-truncate" title={enrollment.courseTitle}>
                      {enrollment.courseTitle}
                    </h5>

                    <div className="mb-3">
                      <ProgressBar
                        value={enrollment.progressPercentage || 0}
                        showLabel
                        labelPrefix="Progress"
                      />
                      <div className="text-muted small mt-1">
                        {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
                      </div>
                    </div>

                    <div className="mt-auto pt-3 border-top">
                      <Link
                        to={`/courses/${enrollment.courseId}/learn`}
                        className="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="bi bi-play-circle-fill"></i>
                        <span>Continue Learning</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-custom text-center p-5">
            <i className="bi bi-mortarboard text-muted" style={{ fontSize: '3.5rem' }}></i>
            <h4 className="fw-bold text-dark mt-3">No Enrolled Courses Found</h4>
            <p className="text-muted small mb-3">
              {filter ? 'No courses match your filter keywords.' : 'Start your journey today by enrolling in free courses.'}
            </p>
            <Link to="/catalog" className="btn btn-primary-custom px-4">
              Explore Course Catalog
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCourses;
