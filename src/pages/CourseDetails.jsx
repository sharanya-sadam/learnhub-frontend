import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated, isStudent, isAdmin, isInstructor } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchCourse = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await courseService.getCourseDetails(id);
      setCourse(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentService.enroll(id);
      showToast('Successfully enrolled in course!', 'success');
      navigate(`/courses/${id}/learn`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to enroll.', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading course curriculum..." />;
  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={fetchCourse} /></div>;
  if (!course) return null;

  const isOwnerInstructor = isInstructor && course.instructor?.id === user?.id;
  const canManage = isAdmin || isOwnerInstructor;

  const objectives = course.learningObjectives ? course.learningObjectives.split(';').map(o => o.trim()).filter(Boolean) : [];

  return (
    <div>
      {/* Course Banner */}
      <div className="bg-dark text-white py-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}>
        <div className="container py-2">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge bg-primary px-3 py-2">{course.category}</span>
                <span className="badge bg-light text-dark px-3 py-2">{course.difficulty}</span>
                {!course.published && <span className="badge bg-warning text-dark px-3 py-2">Draft (Unpublished)</span>}
              </div>

              <h1 className="fw-bold mb-3 text-white">{course.title}</h1>
              <p className="lead text-light opacity-90 mb-4">{course.shortDescription}</p>

              <div className="d-flex flex-wrap align-items-center gap-4 text-light small opacity-80 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '32px', height: '32px' }}
                  >
                    {course.instructor?.name?.charAt(0) || 'I'}
                  </div>
                  <span>Instructor: <strong>{course.instructor?.name}</strong></span>
                </div>
                <div><i className="bi bi-clock me-1"></i> {course.estimatedDuration || '12 Hours'}</div>
                <div><i className="bi bi-collection-play me-1"></i> {course.moduleCount} modules &bull; {course.lessonCount} lessons</div>
                <div><i className="bi bi-people me-1"></i> {course.enrollmentCount} enrolled students</div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3">
                {course.enrolled ? (
                  <Link to={`/courses/${course.id}/learn`} className="btn btn-primary-custom px-4 py-2">
                    <i className="bi bi-play-circle-fill me-2"></i> Continue Learning ({course.progressPercentage}%)
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="btn btn-primary-custom px-4 py-2 fs-6"
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enrolling...
                      </>
                    ) : isAuthenticated ? (
                      'Enroll in Course Now'
                    ) : (
                      'Sign In to Enroll Free'
                    )}
                  </button>
                )}

                {canManage && (
                  <Link to={`/instructor/courses/${course.id}/edit`} className="btn btn-outline-light px-4 py-2">
                    <i className="bi bi-pencil me-1"></i> Edit Course Content
                  </Link>
                )}
              </div>
            </div>

            <div className="col-lg-4 text-center">
              <img
                src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                alt={course.title}
                className="img-fluid rounded-4 shadow-lg border border-3 border-white"
                style={{ maxHeight: '260px', width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Syllabus */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Left Column: Description & Syllabus */}
          <div className="col-lg-8">
            {/* Overview */}
            <div className="card-custom p-4 mb-4">
              <h4 className="fw-bold text-dark mb-3">About This Course</h4>
              <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{course.description}</p>
            </div>

            {/* Learning Objectives */}
            {objectives.length > 0 && (
              <div className="card-custom p-4 mb-4">
                <h4 className="fw-bold text-dark mb-3">What You Will Learn</h4>
                <div className="row g-3">
                  {objectives.map((obj, i) => (
                    <div key={i} className="col-md-6 d-flex gap-2">
                      <i className="bi bi-check-circle-fill text-success mt-1"></i>
                      <span className="small text-secondary">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Syllabus Breakdown */}
            <div className="card-custom p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-dark mb-0">Course Curriculum</h4>
                <span className="text-muted small">
                  {course.moduleCount} modules &bull; {course.lessonCount} lessons
                </span>
              </div>

              <div className="accordion" id="curriculumAccordion">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((m, idx) => (
                    <div key={m.id} className="accordion-item mb-2 border rounded-3 overflow-hidden">
                      <h2 className="accordion-header" id={`curriculumHeading-${m.id}`}>
                        <button
                          className="accordion-button bg-light fw-bold py-3 text-dark"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#curriculumCollapse-${m.id}`}
                          aria-expanded={idx === 0 ? 'true' : 'false'}
                          aria-controls={`curriculumCollapse-${m.id}`}
                        >
                          <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                            <span>{m.title}</span>
                            <span className="badge bg-secondary-subtle text-secondary small">
                              {m.lessons?.length || 0} lessons
                            </span>
                          </div>
                        </button>
                      </h2>
                      <div
                        id={`curriculumCollapse-${m.id}`}
                        className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}
                        aria-labelledby={`curriculumHeading-${m.id}`}
                        data-bs-parent="#curriculumAccordion"
                      >
                        <div className="accordion-body p-0">
                          <ul className="list-group list-group-flush">
                            {m.lessons && m.lessons.map((l) => (
                              <li key={l.id} className="list-group-item d-flex justify-content-between align-items-center py-3 px-3">
                                <div className="d-flex align-items-center gap-2">
                                  <i className="bi bi-play-circle text-primary"></i>
                                  <span className="small fw-medium text-dark">{l.title}</span>
                                </div>
                                <span className="text-muted small">{l.duration || '10 min'}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small">No curriculum modules added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Instructor & Prerequisites */}
          <div className="col-lg-4">
            {/* Instructor Card */}
            <div className="card-custom p-4 mb-4">
              <h5 className="fw-bold text-dark mb-3">Instructor</h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4"
                  style={{ width: '56px', height: '56px' }}
                >
                  {course.instructor?.name?.charAt(0) || 'I'}
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">{course.instructor?.name}</h6>
                  <span className="badge badge-role-instructor mt-1">Instructor</span>
                </div>
              </div>
              <p className="text-muted small mb-0">
                {course.instructor?.bio || 'Senior instructor and experienced developer providing quality education.'}
              </p>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && (
              <div className="card-custom p-4 mb-4">
                <h5 className="fw-bold text-dark mb-2">Prerequisites</h5>
                <p className="text-secondary small mb-0" style={{ whiteSpace: 'pre-line' }}>
                  {course.prerequisites}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
