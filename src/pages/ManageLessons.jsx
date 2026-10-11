import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { moduleService } from '../services/moduleService';
import { lessonService } from '../services/lessonService';
import { fileService } from '../services/fileService';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageLessons = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Module modal state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleOrder, setModuleOrder] = useState(1);

  // Lesson modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    duration: '10:00',
    videoUrl: '',
    displayOrder: 1,
    published: true,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [resourceFile, setResourceFile] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'module'|'lesson', item: object }
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseDetails(id);
      setCourse(data);
    } catch (err) {
      showToast('Failed to load course curriculum', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  // Open Module Modal
  const handleOpenModuleModal = (module = null) => {
    if (module) {
      setEditingModule(module);
      setModuleTitle(module.title);
      setModuleDescription(module.description || '');
      setModuleOrder(module.displayOrder || 1);
    } else {
      setEditingModule(null);
      setModuleTitle('');
      setModuleDescription('');
      setModuleOrder((course?.modules?.length || 0) + 1);
    }
    setIsModuleModalOpen(true);
  };

  // Save Module
  const handleSaveModule = async (e) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;

    try {
      setModalSaving(true);
      if (editingModule) {
        await moduleService.updateModule(editingModule.id, {
          title: moduleTitle.trim(),
          description: moduleDescription,
          displayOrder: moduleOrder,
        });
        showToast('Module updated successfully', 'success');
      } else {
        await moduleService.createModule(id, {
          title: moduleTitle.trim(),
          description: moduleDescription,
          displayOrder: moduleOrder,
        });
        showToast('Module added successfully', 'success');
      }
      setIsModuleModalOpen(false);
      fetchCourseData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save module', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  // Open Lesson Modal
  const handleOpenLessonModal = (moduleId, lesson = null) => {
    setSelectedModuleId(moduleId);
    setVideoFile(null);
    setResourceFile(null);

    if (lesson) {
      setEditingLesson(lesson);
      setLessonData({
        title: lesson.title,
        description: lesson.description || '',
        duration: lesson.duration || '10:00',
        videoUrl: lesson.videoUrl || '',
        displayOrder: lesson.displayOrder || 1,
        published: lesson.published ?? true,
      });
    } else {
      setEditingLesson(null);
      const parentMod = course?.modules?.find((m) => m.id === moduleId);
      setLessonData({
        title: '',
        description: '',
        duration: '10:00',
        videoUrl: '',
        displayOrder: (parentMod?.lessons?.length || 0) + 1,
        published: true,
      });
    }
    setIsLessonModalOpen(true);
  };

  // Save Lesson
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonData.title.trim()) return;

    try {
      setModalSaving(true);
      let localVideoPath = editingLesson?.localVideoPath || null;
      let resourcePath = editingLesson?.resourcePath || null;
      let resourceName = editingLesson?.resourceName || null;

      if (videoFile) {
        const videoRes = await fileService.uploadFile(videoFile, 'videos');
        localVideoPath = videoRes.filePath;
      }

      if (resourceFile) {
        const resResult = await fileService.uploadFile(resourceFile, 'resources');
        resourcePath = resResult.filePath;
        resourceName = resResult.originalName;
      }

      const payload = {
        ...lessonData,
        localVideoPath,
        resourcePath,
        resourceName,
      };

      if (editingLesson) {
        await lessonService.updateLesson(editingLesson.id, payload);
        showToast('Lesson updated successfully', 'success');
      } else {
        await lessonService.createLesson(selectedModuleId, payload);
        showToast('Lesson created successfully', 'success');
      }

      setIsLessonModalOpen(false);
      fetchCourseData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save lesson', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  // Delete Confirm Execution
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      if (deleteTarget.type === 'module') {
        await moduleService.deleteModule(deleteTarget.item.id);
        showToast('Module deleted', 'success');
      } else {
        await lessonService.deleteLesson(deleteTarget.item.id);
        showToast('Lesson deleted', 'success');
      }
      setDeleteTarget(null);
      fetchCourseData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete item', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading course modules..." />;
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
            <h2 className="fw-bold text-dark mb-1">Curriculum: {course.title}</h2>
            <p className="text-muted mb-0">Organize modules, upload video lectures, and attach downloadable materials.</p>
          </div>

          <button onClick={() => handleOpenModuleModal()} className="btn btn-primary-custom d-flex align-items-center gap-2">
            <i className="bi bi-folder-plus"></i>
            <span>Add Module</span>
          </button>
        </div>

        {/* Modules List */}
        {course.modules && course.modules.length > 0 ? (
          <div className="d-flex flex-column gap-4">
            {course.modules.map((m, mIdx) => (
              <div key={m.id} className="card-custom p-4">
                {/* Module Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 pb-3 border-bottom mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary text-white">Module {mIdx + 1}</span>
                      <h5 className="fw-bold text-dark mb-0">{m.title}</h5>
                    </div>
                    {m.description && <p className="text-muted small mb-0 mt-1">{m.description}</p>}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      onClick={() => handleOpenLessonModal(m.id)}
                      className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                    >
                      <i className="bi bi-plus-lg"></i> Add Lesson
                    </button>
                    <button
                      onClick={() => handleOpenModuleModal(m)}
                      className="btn btn-sm btn-light border"
                      title="Edit Module"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'module', item: m })}
                      className="btn btn-sm btn-light border text-danger"
                      title="Delete Module"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>

                {/* Lessons in Module */}
                {m.lessons && m.lessons.length > 0 ? (
                  <div className="list-group list-group-flush rounded-3 border">
                    {m.lessons.map((lesson, lIdx) => (
                      <div
                        key={lesson.id}
                        className="list-group-item d-flex justify-content-between align-items-center p-3"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <span className="text-muted small fw-bold" style={{ width: '24px' }}>
                            {mIdx + 1}.{lIdx + 1}
                          </span>
                          <i className="bi bi-camera-video text-primary fs-5"></i>
                          <div>
                            <div className="fw-bold text-dark small">{lesson.title}</div>
                            <div className="text-muted small d-flex gap-2">
                              <span><i className="bi bi-clock me-1"></i>{lesson.duration || '10 min'}</span>
                              {lesson.localVideoPath ? (
                                <span className="text-success"><i className="bi bi-hdd-fill me-1"></i>Local Video File</span>
                              ) : lesson.videoUrl ? (
                                <span className="text-primary"><i className="bi bi-link-45deg me-1"></i>Video URL</span>
                              ) : null}
                              {lesson.resourcePath && (
                                <span className="text-secondary"><i className="bi bi-paperclip me-1"></i>Attachment</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <button
                            onClick={() => handleOpenLessonModal(m.id, lesson)}
                            className="btn btn-sm btn-light border"
                            title="Edit Lesson"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'lesson', item: lesson })}
                            className="btn btn-sm btn-light border text-danger"
                            title="Delete Lesson"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-light rounded-3 text-muted small border">
                    No lessons in this module yet. Click "Add Lesson" above to add your first lecture.
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card-custom text-center p-5">
            <i className="bi bi-collection text-muted" style={{ fontSize: '3rem' }}></i>
            <h4 className="fw-bold text-dark mt-3">Curriculum is Empty</h4>
            <p className="text-muted small mb-3">Add modules to organize your video lessons and course materials.</p>
            <button onClick={() => handleOpenModuleModal()} className="btn btn-primary-custom px-4">
              <i className="bi bi-folder-plus me-2"></i> Add First Module
            </button>
          </div>
        )}
      </main>

      {/* Module Modal */}
      {isModuleModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">{editingModule ? 'Edit Module' : 'Add New Module'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModuleModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSaveModule}>
                <div className="modal-body py-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Module Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Module 1: Foundations & Architecture"
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="3"
                      placeholder="Summary of what this module covers..."
                      value={moduleDescription}
                      onChange={(e) => setModuleDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Display Order</label>
                    <input
                      type="number"
                      className="form-control rounded-3"
                      value={moduleOrder}
                      onChange={(e) => setModuleOrder(parseInt(e.target.value, 10))}
                      min="1"
                    />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light rounded-2" onClick={() => setIsModuleModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-custom" disabled={modalSaving}>
                    {modalSaving ? 'Saving...' : 'Save Module'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {isLessonModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsLessonModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSaveLesson}>
                <div className="modal-body py-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Lesson Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. 1.1 Introduction to Spring Boot"
                      value={lessonData.title}
                      onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description / Notes</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="3"
                      placeholder="Lesson summary and key topics..."
                      value={lessonData.description}
                      onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Estimated Duration</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. 15:30"
                        value={lessonData.duration}
                        onChange={(e) => setLessonData({ ...lessonData, duration: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Display Order</label>
                      <input
                        type="number"
                        className="form-control rounded-3"
                        value={lessonData.displayOrder}
                        onChange={(e) => setLessonData({ ...lessonData, displayOrder: parseInt(e.target.value, 10) })}
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Video Options */}
                  <div className="card bg-light p-3 rounded-3 mb-3 border">
                    <h6 className="fw-bold small text-dark mb-2">Video Stream Source</h6>
                    <div className="mb-3">
                      <label className="form-label small text-muted">Video Stream URL (MP4 or Embed)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-3"
                        placeholder="https://commondatastorage.googleapis.com/... or embed link"
                        value={lessonData.videoUrl}
                        onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label small text-muted">Or Upload Local Video File (MP4, WebM)</label>
                      <input
                        type="file"
                        className="form-control form-control-sm rounded-3"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  {/* Attachment */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Attach Supplementary Learning Resource (Optional)</label>
                    <input
                      type="file"
                      className="form-control rounded-3"
                      onChange={(e) => setResourceFile(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light rounded-2" onClick={() => setIsLessonModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-custom px-4" disabled={modalSaving}>
                    {modalSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Lesson'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Delete ${deleteTarget?.type === 'module' ? 'Module' : 'Lesson'}`}
        message={`Are you sure you want to delete "${deleteTarget?.item?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageLessons;
