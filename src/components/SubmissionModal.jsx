import React, { useState } from 'react';
import { fileService } from '../services/fileService';
import { submissionService } from '../services/submissionService';
import { useToast } from '../context/ToastContext';

const SubmissionModal = ({ isOpen, assignment, onClose, onSubmitted }) => {
  const [textResponse, setTextResponse] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  if (!isOpen || !assignment) return null;

  const requiresText = assignment.allowedSubmissionType === 'TEXT' || assignment.allowedSubmissionType === 'BOTH';
  const requiresFile = assignment.allowedSubmissionType === 'FILE' || assignment.allowedSubmissionType === 'BOTH';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (assignment.allowedSubmissionType === 'TEXT' && !textResponse.trim()) {
      setError('Please provide a text response.');
      return;
    }

    if (assignment.allowedSubmissionType === 'FILE' && !selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    if (assignment.allowedSubmissionType === 'BOTH' && !textResponse.trim() && !selectedFile) {
      setError('Please provide either a text response or a file upload.');
      return;
    }

    try {
      setUploading(true);
      let filePath = null;
      let originalFileName = null;

      if (selectedFile) {
        // Upload file locally
        const uploadResult = await fileService.uploadFile(selectedFile, 'submissions');
        filePath = uploadResult.filePath;
        originalFileName = uploadResult.originalName;
      }

      await submissionService.submitAssignment(assignment.id, {
        textResponse: textResponse.trim() || null,
        filePath,
        originalFileName,
      });

      showToast('Assignment submitted successfully!', 'success');
      onSubmitted();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit assignment. Please try again.';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-bottom pb-3">
            <div>
              <h5 className="modal-title fw-bold text-dark">{assignment.title}</h5>
              <div className="text-muted small">Max Marks: {assignment.maxMarks} &bull; Type: {assignment.allowedSubmissionType}</div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} disabled={uploading} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body py-4">
              {error && <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">{error}</div>}

              {requiresText && (
                <div className="mb-3">
                  <label htmlFor="textResponse" className="form-label fw-semibold small">
                    Text Response {assignment.allowedSubmissionType === 'TEXT' && <span className="text-danger">*</span>}
                  </label>
                  <textarea
                    id="textResponse"
                    className="form-control rounded-3"
                    rows="6"
                    placeholder="Type or paste your assignment response or code here..."
                    value={textResponse}
                    onChange={(e) => setTextResponse(e.target.value)}
                  ></textarea>
                </div>
              )}

              {requiresFile && (
                <div className="mb-3">
                  <label htmlFor="submissionFile" className="form-label fw-semibold small">
                    Upload Attachment (Zip, PDF, Code, Video) {assignment.allowedSubmissionType === 'FILE' && <span className="text-danger">*</span>}
                  </label>
                  <input
                    type="file"
                    id="submissionFile"
                    className="form-control rounded-3"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <div className="form-text small text-muted">
                    Files are securely stored in your local server repository (Max: 100MB).
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer border-top pt-3">
              <button type="button" className="btn btn-light rounded-2 px-3" onClick={onClose} disabled={uploading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-custom px-4" disabled={uploading}>
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Now'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
