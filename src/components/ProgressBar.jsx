import React from 'react';

const ProgressBar = ({ value = 0, max = 100, height = 8, showLabel = false, labelPrefix = '' }) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className="w-100">
      {showLabel && (
        <div className="d-flex justify-content-between align-items-center mb-1 text-sm">
          <span className="text-muted small">{labelPrefix} Progress</span>
          <span className="fw-bold small text-primary">{percentage}%</span>
        </div>
      )}
      <div className="progress-custom" style={{ height: `${height}px` }}>
        <div
          className="progress-custom-bar"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
