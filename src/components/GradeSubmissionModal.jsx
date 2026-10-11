import React, { useState } from 'react';
import { gradeService } from '../services/gradeService';
import { useToast } from '../context/ToastContext';

const GradeSubmissionModal = ({ isOpen, submission, onClose, onGraded }) => {
  const [marks, setMarks] = useState(submission?.marksAwarded !== null && submission?.marksAwarded !== undefined ? submission.marksAwarded : '');
  const [feedback, setFeedback] = useState(submission?.feedback || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  if (!isOpen || !submission) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numericMarks = parseFloat(marks);
    if (isNaN(numericMarks)) {
      setError('Please enter a valid numeric mark.');
      return;
    }
    if (numericMarks < 0) {
      setError('Marks cannot be negative.');
      return;
    }
    if (numericMarks > submission.maxMarks) {
      setError(`Marks cannot exceed the maximum allowed (${submission.maxMarks}).`);
      return;
    }

    try {
      setSubmitting(true);
      await gradeService.gradeSubmission(submission.id, numericMarks, feedback.trim());
      showToast('Grade and feedback saved successfully!', 'success');
      onGraded();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save grade.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-bottom pb-3">
            <div>
              <h5 className="modal-title fw-bold text-dark">Grade Submission: {submission.assignmentTitle}</h5>
              <div className="text-muted small">
                Student: <strong>{submission.student?.name}</strong> ({submission.student?.email}) &bull; Max Marks: <strong>{submission.maxMarks}</strong>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} disabled={submitting} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body py-4">
              {error && <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">{error}</div>}

              {/* Student Submission Contents */}
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold small text-dark">Submitted Response:</span>
                  <span className="text-muted small">
                    {new Date(submission.submittedAt).toLocaleString()} ({submission.status})
                  </span>
                </div>

                {submission.textResponse ? (
                  <div className="p-3 bg-white rounded-2 border text-muted small mb-2" style={{ maxHeight: '180px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                    {submission.textResponse}
                  </div>
                ) : (
                  <div className="text-muted small italic mb-2">No text response provided.</div>
                )}

                {submission.filePath && (
                  <div>
                    <a
                      href={`/api/files/${submission.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                    >
                      <i className="bi bi-download"></i>
                      <span>Download Student Submission ({submission.originalFileName || 'File'})</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Grading Fields */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="marksAwarded" className="form-label fw-semibold small">
                    Marks Awarded (Out of {submission.maxMarks}) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="marksAwarded"
                    className="form-control rounded-3"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    required
                    min="0"
                    max={submission.maxMarks}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="writtenFeedback" className="form-label fw-semibold small">
                  Written Feedback & Suggestions
                </label>
                <textarea
                  id="writtenFeedback"
                  className="form-control rounded-3"
                  rows="4"
                  placeholder="Provide constructive feedback for the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-top pt-3">
              <button type="button" className="btn btn-light rounded-2 px-3" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-custom px-4" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving Grade...
                  </>
                ) : (
                  'Save Grade & Feedback'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GradeSubmissionModal;
