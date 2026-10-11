import React from 'react';

const AssignmentCard = ({ assignment, onSubmitClick, onViewFeedbackClick }) => {
  const isOverdue = new Date(assignment.dueDate) < new Date();

  const getStatusBadge = () => {
    if (assignment.submissionStatus === 'GRADED') {
      return <span className="badge badge-status-graded">Graded: {assignment.studentMarks}/{assignment.maxMarks}</span>;
    }
    if (assignment.submissionStatus === 'LATE') {
      return <span className="badge badge-status-late">Submitted (Late)</span>;
    }
    if (assignment.submissionStatus === 'SUBMITTED') {
      return <span className="badge badge-status-submitted">Submitted</span>;
    }
    if (isOverdue) {
      return <span className="badge bg-danger text-white">Overdue</span>;
    }
    return <span className="badge badge-status-notsubmitted">Pending Submission</span>;
  };

  return (
    <div className="card-custom p-4 mb-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-2">
        <div>
          <h5 className="fw-bold text-dark mb-1">{assignment.title}</h5>
          <div className="text-muted small d-flex flex-wrap align-items-center gap-3">
            <span>
              <i className="bi bi-calendar-event me-1 text-primary"></i>
              Due: {new Date(assignment.dueDate).toLocaleString()}
            </span>
            <span>
              <i className="bi bi-award me-1 text-warning"></i>
              Max Marks: {assignment.maxMarks}
            </span>
            <span>
              <i className="bi bi-file-earmark-check me-1 text-secondary"></i>
              Type: {assignment.allowedSubmissionType}
            </span>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {assignment.description && (
        <p className="text-secondary small mt-2 mb-3">{assignment.description}</p>
      )}

      {assignment.instructions && (
        <div className="bg-light p-3 rounded-3 small mb-3 border">
          <div className="fw-bold text-dark mb-1">Instructions:</div>
          <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>{assignment.instructions}</div>
        </div>
      )}

      {assignment.attachmentPath && (
        <div className="mb-3">
          <a
            href={`/api/files/${assignment.attachmentPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
          >
            <i className="bi bi-paperclip"></i>
            <span>Download Instructor Attachment ({assignment.attachmentName || 'Attachment'})</span>
          </a>
        </div>
      )}

      {assignment.studentFeedback && (
        <div className="alert alert-info py-2 px-3 small rounded-3 mb-3">
          <strong>Instructor Feedback:</strong> {assignment.studentFeedback}
        </div>
      )}

      <div className="d-flex justify-content-end gap-2 pt-2 border-top">
        {onSubmitClick && (!isOverdue || assignment.allowLateSubmissions) && (
          <button
            onClick={() => onSubmitClick(assignment)}
            className={`btn btn-sm ${assignment.isSubmitted ? 'btn-outline-custom' : 'btn-primary-custom'}`}
          >
            <i className={`bi ${assignment.isSubmitted ? 'bi-pencil-square' : 'bi-upload'} me-1`}></i>
            {assignment.isSubmitted ? 'Resubmit Assignment' : 'Submit Assignment'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
