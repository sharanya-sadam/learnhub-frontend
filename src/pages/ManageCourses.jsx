import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getMyTeachingCourses();
      setCourses(data || []);
    } catch (err) {
      showToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTogglePublish = async (course) => {
    try {
      const updated = await courseService.setPublishStatus(course.id, !course.published);
      setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, published: updated.published } : c)));
      showToast(updated.published ? 'Course published to catalog!' : 'Course set to draft mode.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update publication status.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    try {
      setIsDeleting(true);
      await courseService.deleteCourse(courseToDelete.id);
      showToast('Course deleted successfully', 'success');
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id));
      setCourseToDelete(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete course', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading courses..." />;

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(filter.toLowerCase()) ||
    c.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Manage Courses</h2>
            <p className="text-muted mb-0">Organize modules, edit course settings, and monitor publication status.</p>
          </div>
          <Link to="/instructor/courses/new" className="btn btn-primary-custom d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle"></i>
            <span>Add New Course</span>
          </Link>
        </div>

        {/* Filter Input */}
        <div className="card-custom p-3 mb-4" style={{ maxWidth: '400px' }}>
          <div className="input-group">
            <span className="input-group-text bg-transparent border-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-none text-dark"
              placeholder="Search by course title or category..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Table */}
        <div className="card-custom overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Difficulty</th>
                  <th className="py-3 text-center">Lessons</th>
                  <th className="py-3 text-center">Students</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={c.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                            alt={c.title}
                            className="rounded-2"
                            style={{ width: '48px', height: '36px', objectFit: 'cover' }}
                          />
                          <div>
                            <Link to={`/courses/${c.id}`} className="fw-bold text-dark text-decoration-none hover-primary">
                              {c.title}
                            </Link>
                            <div className="text-muted small">{c.estimatedDuration || '12 Hours'}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-secondary border">{c.category}</span></td>
                      <td><span className="badge bg-light text-dark border">{c.difficulty}</span></td>
                      <td className="text-center fw-semibold text-secondary">{c.lessonCount}</td>
                      <td className="text-center fw-semibold text-primary">{c.enrollmentCount}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleTogglePublish(c)}
                          className={`btn btn-sm ${c.published ? 'btn-success' : 'btn-outline-warning'}`}
                          title="Click to toggle publish status"
                        >
                          {c.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="text-end px-4">
                        <div className="d-flex justify-content-end gap-1">
                          <Link
                            to={`/instructor/courses/${c.id}/lessons`}
                            className="btn btn-sm btn-outline-primary"
                            title="Manage Modules & Lessons"
                          >
                            <i className="bi bi-collection-play me-1"></i> Lessons
                          </Link>
                          <Link
                            to={`/instructor/courses/${c.id}/assignments`}
                            className="btn btn-sm btn-outline-secondary"
                            title="Manage Assignments"
                          >
                            <i className="bi bi-file-earmark-check me-1"></i> Assignments
                          </Link>
                          <Link
                            to={`/instructor/courses/${c.id}/edit`}
                            className="btn btn-sm btn-light border"
                            title="Edit Details"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => setCourseToDelete(c)}
                            className="btn btn-sm btn-light border text-danger"
                            title="Delete Course"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No courses found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!courseToDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${courseToDelete?.title}"? All associated modules, lessons, assignments, and submissions will also be deleted.`}
        confirmText="Yes, Delete Course"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCourseToDelete(null)}
      />
    </div>
  );
};

export default ManageCourses;
