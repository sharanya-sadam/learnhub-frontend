import React from 'react';

const ConfirmModal = ({ isOpen, title = 'Confirm Action', message, confirmText = 'Confirm', confirmVariant = 'danger', onConfirm, onCancel, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold text-dark">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel} disabled={loading} aria-label="Close"></button>
          </div>
          <div className="modal-body py-3">
            <p className="text-secondary mb-0">{message}</p>
          </div>
          <div className="modal-footer border-top-0 pt-0">
            <button type="button" className="btn btn-light rounded-2 px-3 fw-medium" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-${confirmVariant} rounded-2 px-3 fw-medium`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
