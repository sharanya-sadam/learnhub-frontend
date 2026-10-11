import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container-custom">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-custom ${toast.type}`}>
            <i
              className={`bi ${
                toast.type === 'success'
                  ? 'bi-check-circle-fill text-success'
                  : toast.type === 'error'
                  ? 'bi-exclamation-circle-fill text-danger'
                  : 'bi-info-circle-fill text-warning'
              } fs-5`}
            ></i>
            <div className="flex-grow-1 text-sm">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-close btn-close-sm"
              style={{ fontSize: '0.75rem' }}
              aria-label="Close"
            ></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
