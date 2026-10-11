import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { fileService } from '../services/fileService';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const EditCourse = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Beginner',
    thumbnailUrl: '',
    learningObjectives: '',
    prerequisites: '',
    estimatedDuration: '10 Hours',
    published: false,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setInitialLoading(true);
        const data = await courseService.getCourseDetails(id);
        setFormData({
          title: data.title || '',
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          category: data.category || 'Web Development',
          difficulty: data.difficulty || 'Beginner',
          thumbnailUrl: data.thumbnailUrl || '',
          learningObjectives: data.learningObjectives || '',
          prerequisites: data.prerequisites || '',
          estimatedDuration: data.estimatedDuration || '10 Hours',
          published: data.published || false,
        });
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);
      let thumbUrl = formData.thumbnailUrl;

      if (thumbnailFile) {
        const uploadResult = await fileService.uploadFile(thumbnailFile, 'thumbnails');
        thumbUrl = `/api/files/${uploadResult.filePath}`;
      }

      await courseService.updateCourse(id, {
        ...formData,
        thumbnailUrl: thumbUrl || null,
      });

      showToast('Course updated successfully!', 'success');
      navigate('/instructor/courses');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update course.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) return <LoadingSpinner fullPage message="Loading course settings..." />;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <Link to="/instructor/courses" className="text-decoration-none text-muted small hover-primary mb-2 d-inline-block">
              <i className="bi bi-chevron-left me-1"></i> Back to Courses
            </Link>
            <h2 className="fw-bold text-dark mb-1">Edit Course Settings</h2>
            <p className="text-muted mb-0">Update metadata, categories, objectives, or publication status.</p>
          </div>

          <div className="d-flex gap-2">
            <Link to={`/instructor/courses/${id}/lessons`} className="btn btn-outline-primary d-flex align-items-center gap-1">
              <i className="bi bi-collection-play"></i>
              <span>Manage Modules & Lessons</span>
            </Link>
            <Link to={`/instructor/courses/${id}/assignments`} className="btn btn-outline-secondary d-flex align-items-center gap-1">
              <i className="bi bi-file-earmark-check"></i>
              <span>Assignments</span>
            </Link>
          </div>
        </div>

        <div className="card-custom p-4 p-md-5" style={{ maxWidth: '850px' }}>
          {error && (
            <div className="alert alert-danger py-2 px-3 small rounded-3 mb-4 d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-circle-fill"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="courseTitle" className="form-label fw-semibold small">
                Course Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="courseTitle"
                name="title"
                className="form-control rounded-3"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="courseShortDesc" className="form-label fw-semibold small">
                Short Summary (Max 500 chars)
              </label>
              <textarea
                id="courseShortDesc"
                name="shortDescription"
                className="form-control rounded-3"
                rows="2"
                value={formData.shortDescription}
                onChange={handleChange}
                maxLength="500"
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="courseDesc" className="form-label fw-semibold small">
                Detailed Course Description
              </label>
              <textarea
                id="courseDesc"
                name="description"
                className="form-control rounded-3"
                rows="5"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label htmlFor="courseCategory" className="form-label fw-semibold small">
                  Category
                </label>
                <select
                  id="courseCategory"
                  name="category"
                  className="form-select rounded-3"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                </select>
              </div>

              <div className="col-md-4">
                <label htmlFor="courseDifficulty" className="form-label fw-semibold small">
                  Difficulty
                </label>
                <select
                  id="courseDifficulty"
                  name="difficulty"
                  className="form-select rounded-3"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="col-md-4">
                <label htmlFor="courseDuration" className="form-label fw-semibold small">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  id="courseDuration"
                  name="estimatedDuration"
                  className="form-control rounded-3"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="courseThumbnailUrl" className="form-label fw-semibold small">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  id="courseThumbnailUrl"
                  name="thumbnailUrl"
                  className="form-control rounded-3"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="courseThumbnailFile" className="form-label fw-semibold small">
                  Or Replace with Local Image File
                </label>
                <input
                  type="file"
                  id="courseThumbnailFile"
                  className="form-control rounded-3"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="courseObjectives" className="form-label fw-semibold small">
                Learning Objectives (Semicolon separated)
              </label>
              <textarea
                id="courseObjectives"
                name="learningObjectives"
                className="form-control rounded-3"
                rows="2"
                value={formData.learningObjectives}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="coursePrereqs" className="form-label fw-semibold small">
                Prerequisites
              </label>
              <input
                type="text"
                id="coursePrereqs"
                name="prerequisites"
                className="form-control rounded-3"
                value={formData.prerequisites}
                onChange={handleChange}
              />
            </div>

            <div className="form-check form-switch mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="publishSwitch"
                name="published"
                checked={formData.published}
                onChange={handleChange}
              />
              <label className="form-check-label fw-semibold small" htmlFor="publishSwitch">
                Course is Published and Visible in Public Catalog
              </label>
            </div>

            <div className="d-flex justify-content-end gap-3 pt-3 border-top">
              <Link to="/instructor/courses" className="btn btn-light rounded-2 px-4">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary-custom px-4" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditCourse;
