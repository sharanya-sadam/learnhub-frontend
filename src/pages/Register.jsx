import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('ROLE_STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const user = await register(name.trim(), email.trim(), password, role);
      showToast(`Welcome to LearnHub, ${user.name}! Your account has been created.`, 'success');

      if (user.role === 'ROLE_INSTRUCTOR') {
        navigate('/instructor/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your information.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-auto">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card-custom p-4 p-md-5">
            <div className="text-center mb-4">
              <div
                className="rounded-circle bg-primary-light text-primary d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px' }}
              >
                <i className="bi bi-person-plus-fill fs-2 text-primary"></i>
              </div>
              <h3 className="fw-bold text-dark">Create Your Account</h3>
              <p className="text-muted small">Join LearnHub to start learning or teaching courses</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small" htmlFor="regName">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="regName"
                  className="form-control rounded-3"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small" htmlFor="regEmail">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  id="regEmail"
                  className="form-control rounded-3"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  I want to join as: <span className="text-danger">*</span>
                </label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="radio"
                      className="btn-check"
                      name="roleOptions"
                      id="roleStudent"
                      checked={role === 'ROLE_STUDENT'}
                      onChange={() => setRole('ROLE_STUDENT')}
                    />
                    <label className={`btn w-100 p-3 rounded-3 text-start border ${role === 'ROLE_STUDENT' ? 'btn-primary-custom text-white' : 'btn-light'}`} htmlFor="roleStudent">
                      <div className="fw-bold"><i className="bi bi-mortarboard me-1"></i> Student</div>
                      <div className="small opacity-75">Enroll & learn</div>
                    </label>
                  </div>
                  <div className="col-6">
                    <input
                      type="radio"
                      className="btn-check"
                      name="roleOptions"
                      id="roleInstructor"
                      checked={role === 'ROLE_INSTRUCTOR'}
                      onChange={() => setRole('ROLE_INSTRUCTOR')}
                    />
                    <label className={`btn w-100 p-3 rounded-3 text-start border ${role === 'ROLE_INSTRUCTOR' ? 'btn-primary-custom text-white' : 'btn-light'}`} htmlFor="roleInstructor">
                      <div className="fw-bold"><i className="bi bi-person-workspace me-1"></i> Instructor</div>
                      <div className="small opacity-75">Create & teach</div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small" htmlFor="regPassword">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="regPassword"
                    className="form-control rounded-3"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small" htmlFor="regConfirmPassword">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="regConfirmPassword"
                    className="form-control rounded-3"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-2 mb-3" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Free Account'
                )}
              </button>
            </form>

            <div className="text-center mt-3 text-muted small">
              Already have an account?{' '}
              <Link to="/login" className="fw-semibold text-primary text-decoration-none">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
