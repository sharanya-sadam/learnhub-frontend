import React from 'react';

const LessonList = ({ modules = [], activeLessonId, onSelectLesson, onToggleComplete }) => {
  return (
    <div className="accordion accordion-flush" id="moduleAccordion">
      {modules.map((module, mIdx) => (
        <div key={module.id} className="accordion-item border rounded-3 mb-2 overflow-hidden shadow-sm">
          <h2 className="accordion-header" id={`heading-${module.id}`}>
            <button
              className="accordion-button fw-bold py-3 px-3 bg-light text-dark"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-${module.id}`}
              aria-expanded={mIdx === 0 ? 'true' : 'false'}
              aria-controls={`collapse-${module.id}`}
            >
              <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                <span className="text-truncate" style={{ maxWidth: '280px' }}>
                  {module.title}
                </span>
                <span className="badge bg-secondary-subtle text-secondary small">
                  {module.lessons?.length || 0} lessons
                </span>
              </div>
            </button>
          </h2>

          <div
            id={`collapse-${module.id}`}
            className={`accordion-collapse collapse ${mIdx === 0 ? 'show' : ''}`}
            aria-labelledby={`heading-${module.id}`}
            data-bs-parent="#moduleAccordion"
          >
            <div className="accordion-body p-0">
              <div className="list-group list-group-flush">
                {module.lessons && module.lessons.length > 0 ? (
                  module.lessons.map((lesson) => {
                    const isActive = activeLessonId === lesson.id;
                    return (
                      <div
                        key={lesson.id}
                        className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3 border-0 border-bottom ${
                          isActive ? 'bg-primary-light border-start border-4 border-primary' : ''
                        }`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSelectLesson(lesson)}
                      >
                        <div className="d-flex align-items-center gap-2 overflow-hidden">
                          <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(lesson.id);
                            }}
                            title={lesson.completed ? 'Mark uncompleted' : 'Mark completed'}
                          >
                            <i
                              className={`bi ${
                                lesson.completed
                                  ? 'bi-check-circle-fill text-success fs-5'
                                  : 'bi-circle text-muted fs-5'
                              }`}
                            ></i>
                          </button>

                          <div className="overflow-hidden">
                            <div className={`text-truncate small ${isActive ? 'fw-bold text-primary' : 'text-dark'}`}>
                              {lesson.title}
                            </div>
                            <div className="text-muted small d-flex align-items-center gap-1">
                              <i className="bi bi-clock"></i>
                              <span>{lesson.duration || '10 min'}</span>
                            </div>
                          </div>
                        </div>

                        {isActive && (
                          <span className="badge bg-primary rounded-pill small">Playing</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-muted small text-center">No lessons in this module yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonList;
