import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Edit / Role Modal
  const [userToEdit, setUserToEdit] = useState(null);
  const [editRole, setEditRole] = useState('ROLE_STUDENT');
  const [editActive, setEditActive] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers({
        query: query || undefined,
        role: selectedRole || undefined,
        page: currentPage,
        size: 10,
      });
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      showToast('Failed to load user list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query, selectedRole, currentPage]);

  const handleToggleStatus = async (user) => {
    if (user.id === currentUser.id) {
      showToast('You cannot deactivate your own account', 'warning');
      return;
    }
    try {
      const updated = await adminService.setUserStatus(user.id, !user.active);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, active: updated.active } : u)));
      showToast(updated.active ? 'User activated' : 'User deactivated', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  const handleOpenEditModal = (u) => {
    setUserToEdit(u);
    setEditRole(u.role);
    setEditActive(u.active);
  };

  const handleSaveUserUpdate = async (e) => {
    e.preventDefault();
    if (!userToEdit) return;

    try {
      setIsUpdating(true);
      await adminService.updateUser(userToEdit.id, {
        role: editRole,
        active: editActive,
      });
      showToast('User updated successfully', 'success');
      setUserToEdit(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser.id) {
      showToast('You cannot delete your own administrative account', 'error');
      setUserToDelete(null);
      return;
    }

    try {
      setIsDeleting(true);
      await adminService.deleteUser(userToDelete.id);
      showToast('User deleted successfully', 'success');
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">User Management</h2>
            <p className="text-muted mb-0">View registered students, instructors, and administrators, update privileges, or manage account access.</p>
          </div>
          <div className="badge bg-light text-dark border px-3 py-2 fs-6">
            Total Users: <strong>{totalElements}</strong>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="card-custom p-3 mb-4">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by user name or email..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(0);
                  }}
                />
              </div>
            </div>

            <div className="col-12 col-md-4">
              <select
                className="form-select"
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentPage(0);
                }}
              >
                <option value="">All Roles</option>
                <option value="ROLE_STUDENT">Students</option>
                <option value="ROLE_INSTRUCTOR">Instructors</option>
                <option value="ROLE_ADMIN">Administrators</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <LoadingSpinner message="Loading user records..." />
        ) : (
          <div className="card-custom overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3">Role</th>
                    <th className="py-3 text-center">Status</th>
                    <th className="py-3">Joined Date</th>
                    <th className="py-3 text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-4">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                              style={{ width: '40px', height: '40px' }}
                            >
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{u.name}</div>
                              <div className="text-muted small">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className={`badge ${
                            u.role === 'ROLE_ADMIN'
                              ? 'badge-role-admin'
                              : u.role === 'ROLE_INSTRUCTOR'
                              ? 'badge-role-instructor'
                              : 'badge-role-student'
                          }`}>
                            {u.role.replace('ROLE_', '')}
                          </span>
                        </td>

                        <td className="text-center">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={u.id === currentUser.id}
                            className={`btn btn-sm ${u.active ? 'btn-success' : 'btn-outline-danger'}`}
                            title="Toggle account active/deactivated state"
                          >
                            {u.active ? 'Active' : 'Deactivated'}
                          </button>
                        </td>

                        <td className="text-muted small">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Initial Setup'}
                        </td>

                        <td className="text-end px-4">
                          <div className="d-flex justify-content-end gap-1">
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              className="btn btn-sm btn-light border"
                              title="Edit Role & Permissions"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              onClick={() => setUserToDelete(u)}
                              disabled={u.id === currentUser.id}
                              className="btn btn-sm btn-light border text-danger"
                              title="Delete User"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        No users found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}>
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </main>

      {/* Edit User Modal */}
      {userToEdit && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">Edit User: {userToEdit.name}</h5>
                <button type="button" className="btn-close" onClick={() => setUserToEdit(null)}></button>
              </div>
              <form onSubmit={handleSaveUserUpdate}>
                <div className="modal-body py-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <input type="text" className="form-control" value={userToEdit.email} disabled />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Assign Role</label>
                    <select
                      className="form-select rounded-3"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      <option value="ROLE_STUDENT">Student</option>
                      <option value="ROLE_INSTRUCTOR">Instructor</option>
                      <option value="ROLE_ADMIN">Administrator</option>
                    </select>
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="userActiveSwitch"
                      checked={editActive}
                      onChange={(e) => setEditActive(e.target.checked)}
                      disabled={userToEdit.id === currentUser.id}
                    />
                    <label className="form-check-label fw-semibold small" htmlFor="userActiveSwitch">
                      Account Status (Active)
                    </label>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light rounded-2" onClick={() => setUserToEdit(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-custom" disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      <ConfirmModal
        isOpen={!!userToDelete}
        title="Delete User Account"
        message={`Are you sure you want to delete user "${userToDelete?.name}" (${userToDelete?.email})? This action cannot be undone.`}
        confirmText="Yes, Delete User"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
};

export default ManageUsers;
