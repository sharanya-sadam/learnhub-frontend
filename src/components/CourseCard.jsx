import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, enrolled = false, progress = 0 }) => {
  const defaultThumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return <span className="badge bg-success-subtle text-success">Beginner</span>;
      case 'intermediate':
        return <span className="badge bg-primary-subtle text-primary">Intermediate</span>;
      case 'advanced':
        return <span className="badge bg-danger-subtle text-danger">Advanced</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary">{difficulty}</span>;
    }
  };

  return (
    <div className="card-custom card-hoverable h-100 d-flex flex-column">
      <div className="position-relative">
        <img
          src={course.thumbnailUrl || defaultThumbnail}
          alt={course.title}
          className="course-card-thumb"
          onError={(e) => { e.target.src = defaultThumbnail; }}
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className="badge bg-dark bg-opacity-75 text-white">{course.category}</span>
        </div>
        <div className="position-absolute bottom-0 end-0 m-3">
          {getDifficultyBadge(course.difficulty)}
        </div>
      </div>

      <div className="p-4 d-flex flex-column flex-grow-1">
        <h5 className="fw-bold mb-2 text-dark line-clamp-2" title={course.title}>
          <Link to={`/courses/${course.id}`} className="text-dark text-decoration-none hover-primary">
            {course.title}
          </Link>
        </h5>

        <p className="text-muted small mb-3 flex-grow-1" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {course.shortDescription || 'Master modern concepts with comprehensive modules and hands-on lessons.'}
        </p>

        {enrolled && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1 small">
              <span className="text-muted">Progress</span>
              <span className="fw-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="progress-custom" style={{ height: '6px' }}>
              <div
                className="progress-custom-bar"
                style={{ width: `${Math.round(progress)}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold small"
              style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}
            >
              {course.instructor?.name?.charAt(0) || 'I'}
            </div>
            <span className="text-muted small text-truncate" style={{ maxWidth: '120px' }}>
              {course.instructor?.name || 'Instructor'}
            </span>
          </div>

          <div className="text-muted small d-flex align-items-center gap-1">
            <i className="bi bi-play-circle text-primary"></i>
            <span>{course.lessonCount || 0} lessons</span>
          </div>
        </div>

        <div className="mt-3 pt-2">
          <Link
            to={enrolled ? `/courses/${course.id}/learn` : `/courses/${course.id}`}
            className={`btn w-100 ${enrolled ? 'btn-primary-custom' : 'btn-outline-custom'}`}
          >
            {enrolled ? (
              <>
                <i className="bi bi-play-fill me-1"></i> Continue Learning
              </>
            ) : (
              'View Details'
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
