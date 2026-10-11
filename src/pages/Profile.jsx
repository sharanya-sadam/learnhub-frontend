import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      await authService.updateProfile({ name: name.trim(), bio: bio.trim() });
      await refreshUser();
      showToast('Profile information updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setChangingPassword(true);
      await authService.changePassword(currentPassword, newPassword);
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">Account & Security</h2>
          <p className="text-muted mb-0">Update your public profile information or modify your authentication credentials.</p>
        </div>

        <div className="row g-4" style={{ maxWidth: '950px' }}>
          {/* Profile Info */}
          <div className="col-lg-6">
            <div className="card-custom p-4 h-100">
              <h5 className="fw-bold text-dark mb-3">Profile Information</h5>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email Address</label>
                  <input type="text" className="form-control bg-light" value={user?.email || ''} disabled />
                  <div className="form-text small text-muted">Email address cannot be changed directly.</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Full Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Bio / About Me</label>
                  <textarea
                    className="form-control rounded-3"
                    rows="4"
                    placeholder="Tell other students or instructors about your interests..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <span className="badge bg-light text-dark border p-2">
                    Role: <strong>{user?.role?.replace('ROLE_', '')}</strong>
                  </span>
                </div>

                <button type="submit" className="btn btn-primary-custom" disabled={updatingProfile}>
                  {updatingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="col-lg-6">
            <div className="card-custom p-4 h-100">
              <h5 className="fw-bold text-dark mb-3">Change Password</h5>
              {passwordError && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">{passwordError}</div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Current Password <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control rounded-3"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">New Password <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control rounded-3"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Confirm New Password <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control rounded-3"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-outline-custom" disabled={changingPassword}>
                  {changingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
