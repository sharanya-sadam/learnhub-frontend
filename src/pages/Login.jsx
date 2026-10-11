import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);
      showToast(`Welcome back, ${user.name}!`, 'success');

      // Check if redirect was requested or navigate based on role
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'ROLE_INSTRUCTOR') {
        navigate('/instructor/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="container py-5 my-auto">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card-custom p-4 p-md-5">
            <div className="text-center mb-4">
              <div
                className="rounded-circle bg-primary-light text-primary d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px' }}
              >
                <i className="bi bi-mortarboard-fill fs-2 text-primary"></i>
              </div>
              <h3 className="fw-bold text-dark">Welcome to LearnHub</h3>
              <p className="text-muted small">Sign in to access your courses and learning dashboard</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small" htmlFor="loginEmail">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    id="loginEmail"
                    className="form-control rounded-end-3"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small" htmlFor="loginPassword">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="loginPassword"
                    className="form-control border-end-0"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light text-muted border-start-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-2 mb-3" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-3 border-top mt-2">
              <div className="text-center text-muted small fw-semibold mb-2">
                Quick Demo Login (Pre-configured)
              </div>
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger d-flex justify-content-between align-items-center px-3"
                  onClick={() => handleDemoFill('admin@learnhub.com', 'Admin@123')}
                >
                  <span><i className="bi bi-shield-lock-fill me-1"></i> Admin Demo</span>
                  <span className="small opacity-75">admin@learnhub.com</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary d-flex justify-content-between align-items-center px-3"
                  onClick={() => handleDemoFill('instructor@learnhub.com', 'Instructor@123')}
                >
                  <span><i className="bi bi-person-badge-fill me-1"></i> Instructor Demo</span>
                  <span className="small opacity-75">instructor@learnhub.com</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success d-flex justify-content-between align-items-center px-3"
                  onClick={() => handleDemoFill('student@learnhub.com', 'Student@123')}
                >
                  <span><i className="bi bi-mortarboard-fill me-1"></i> Student Demo</span>
                  <span className="small opacity-75">student@learnhub.com</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-4 text-muted small">
              Don't have an account?{' '}
              <Link to="/register" className="fw-semibold text-primary text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
