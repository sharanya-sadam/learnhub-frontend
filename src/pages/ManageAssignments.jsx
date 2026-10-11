import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { assignmentService } from '../services/assignmentService';
import { fileService } from '../services/fileService';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageAssignments = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    maxMarks: 100,
    dueDate: '',
    allowedSubmissionType: 'BOTH',
    allowLateSubmissions: true,
    published: true,
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Deletion Modal
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseData, assignmentData] = await Promise.all([
        courseService.getCourseDetails(id),
        assignmentService.getCourseAssignments(id),
      ]);
      setCourse(courseData);
      setAssignments(assignmentData || []);
    } catch (err) {
      showToast('Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleOpenModal = (assignment = null) => {
    setAttachmentFile(null);
    if (assignment) {
      setEditingAssignment(assignment);
      const formattedDate = assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '';
      setFormData({
        title: assignment.title,
        description: assignment.description || '',
        instructions: assignment.instructions || '',
        maxMarks: assignment.maxMarks || 100,
        dueDate: formattedDate,
        allowedSubmissionType: assignment.allowedSubmissionType || 'BOTH',
        allowLateSubmissions: assignment.allowLateSubmissions ?? true,
        published: assignment.published ?? true,
      });
    } else {
      setEditingAssignment(null);
      // Default due date to 7 days from now
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
      setFormData({
        title: '',
        description: '',
        instructions: '',
        maxMarks: 100,
        dueDate: defaultDate,
        allowedSubmissionType: 'BOTH',
        allowLateSubmissions: true,
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setModalSaving(true);
      let attachmentPath = editingAssignment?.attachmentPath || null;
      let attachmentName = editingAssignment?.attachmentName || null;

      if (attachmentFile) {
        const uploadRes = await fileService.uploadFile(attachmentFile, 'attachments');
        attachmentPath = uploadRes.filePath;
        attachmentName = uploadRes.originalName;
      }

      const payload = {
        ...formData,
        attachmentPath,
        attachmentName,
      };

      if (editingAssignment) {
        await assignmentService.updateAssignment(editingAssignment.id, payload);
        showToast('Assignment updated successfully', 'success');
      } else {
        await assignmentService.createAssignment(id, payload);
        showToast('Assignment created successfully', 'success');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save assignment', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;
    try {
      setIsDeleting(true);
      await assignmentService.deleteAssignment(assignmentToDelete.id);
      showToast('Assignment deleted successfully', 'success');
      setAssignmentToDelete(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete assignment', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading assignments..." />;
  if (!course) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <Link to="/instructor/courses" className="text-decoration-none text-muted small hover-primary mb-2 d-inline-block">
              <i className="bi bi-chevron-left me-1"></i> Back to Courses
            </Link>
            <h2 className="fw-bold text-dark mb-1">Assignments: {course.title}</h2>
            <p className="text-muted mb-0">Create graded assessments, define deadlines, and inspect student submissions.</p>
          </div>

          <button onClick={() => handleOpenModal()} className="btn btn-primary-custom d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle"></i>
            <span>Create Assignment</span>
          </button>
        </div>

        {/* Assignments Table */}
        <div className="card-custom overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3">Due Date</th>
                  <th className="py-3 text-center">Max Marks</th>
                  <th className="py-3">Submission Type</th>
                  <th className="py-3 text-center">Late Policy</th>
                  <th className="py-3 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length > 0 ? (
                  assignments.map((a) => (
                    <tr key={a.id}>
                      <td className="px-4">
                        <div className="fw-bold text-dark">{a.title}</div>
                        {a.description && <div className="text-muted small text-truncate" style={{ maxWidth: '280px' }}>{a.description}</div>}
                      </td>
                      <td className="small">
                        <i className="bi bi-calendar-event me-1 text-primary"></i>
                        {new Date(a.dueDate).toLocaleString()}
                      </td>
                      <td className="text-center fw-bold text-dark">{a.maxMarks}</td>
                      <td>
                        <span className="badge bg-light text-secondary border">{a.allowedSubmissionType}</span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${a.allowLateSubmissions ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {a.allowLateSubmissions ? 'Late Allowed' : 'Strict Deadline'}
                        </span>
                      </td>
                      <td className="text-end px-4">
                        <div className="d-flex justify-content-end gap-1">
                          <Link
                            to={`/instructor/assignments/${a.id}/submissions`}
                            className="btn btn-sm btn-outline-primary"
                            title="View & Grade Submissions"
                          >
                            <i className="bi bi-people me-1"></i> Submissions
                          </Link>
                          <button
                            onClick={() => handleOpenModal(a)}
                            className="btn btn-sm btn-light border"
                            title="Edit Assignment"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            onClick={() => setAssignmentToDelete(a)}
                            className="btn btn-sm btn-light border text-danger"
                            title="Delete Assignment"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No assignments created yet for this course. Click "Create Assignment" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Assignment Modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">
                  {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>

              <form onSubmit={handleSaveAssignment}>
                <div className="modal-body py-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Assignment Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Milestone 1: Spring Data JPA Architecture"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Brief Description</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="2"
                      placeholder="Summary of assignment requirements..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Detailed Instructions</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="4"
                      placeholder="Step-by-step submission instructions, code rubrics, test criteria..."
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Maximum Marks <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control rounded-3"
                        value={formData.maxMarks}
                        onChange={(e) => setFormData({ ...formData, maxMarks: parseFloat(e.target.value) })}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Due Date & Time <span className="text-danger">*</span></label>
                      <input
                        type="datetime-local"
                        className="form-control rounded-3"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Allowed Submission Type <span className="text-danger">*</span></label>
                      <select
                        className="form-select rounded-3"
                        value={formData.allowedSubmissionType}
                        onChange={(e) => setFormData({ ...formData, allowedSubmissionType: e.target.value })}
                      >
                        <option value="BOTH">Text & File Upload (Either/Both)</option>
                        <option value="TEXT">Text Only</option>
                        <option value="FILE">File Upload Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Instructor Attachment (Optional Starter Code / PDF)</label>
                    <input
                      type="file"
                      className="form-control rounded-3"
                      onChange={(e) => setAttachmentFile(e.target.files[0])}
                    />
                  </div>

                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="allowLateSwitch"
                      checked={formData.allowLateSubmissions}
                      onChange={(e) => setFormData({ ...formData, allowLateSubmissions: e.target.checked })}
                    />
                    <label className="form-check-label fw-semibold small" htmlFor="allowLateSwitch">
                      Accept Late Submissions (Will be tagged as 'LATE')
                    </label>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light rounded-2" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-custom px-4" disabled={modalSaving}>
                    {modalSaving ? 'Saving...' : 'Save Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!assignmentToDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${assignmentToDelete?.title}"? All student submissions and grades will also be permanently deleted.`}
        confirmText="Delete Assignment"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setAssignmentToDelete(null)}
      />
    </div>
  );
};

export default ManageAssignments;
