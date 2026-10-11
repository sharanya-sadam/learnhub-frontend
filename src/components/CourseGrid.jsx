import React from 'react';
import CourseCard from './CourseCard';
import LoadingSpinner from './LoadingSpinner';

const CourseGrid = ({ courses, loading, emptyMessage = 'No courses found.', enrolled = false }) => {
  if (loading) {
    return <LoadingSpinner message="Loading courses..." />;
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="card-custom text-center p-5 my-4">
        <i className="bi bi-journal-x text-muted" style={{ fontSize: '3rem' }}></i>
        <h5 className="fw-bold mt-3 text-dark">{emptyMessage}</h5>
        <p className="text-muted small mb-0">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {courses.map((course) => (
        <div key={course.id} className="col-12 col-md-6 col-lg-4">
          <CourseCard
            course={course.course ? course.course : course}
            enrolled={enrolled}
            progress={course.progressPercentage || 0}
          />
        </div>
      ))}
    </div>
  );
};

export default CourseGrid;
