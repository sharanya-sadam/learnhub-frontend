import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { lessonService } from '../services/lessonService';
import { assignmentService } from '../services/assignmentService';
import { useToast } from '../context/ToastContext';
import VideoPlayer from '../components/VideoPlayer';
import LessonList from '../components/LessonList';
import AssignmentCard from '../components/AssignmentCard';
import SubmissionModal from '../components/SubmissionModal';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CourseLearning = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' or 'assignments'
  const [modalAssignment, setModalAssignment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const { showToast } = useToast();

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError('');
      const [courseData, assignmentData] = await Promise.all([
        courseService.getCourseDetails(id),
        assignmentService.getCourseAssignments(id),
      ]);

      setCourse(courseData);
      setAssignments(assignmentData || []);

      // Determine initial active lesson:
      // Check if lastAccessedLessonId exists, otherwise find first lesson of first module
      let initialLesson = null;
      if (courseData.modules && courseData.modules.length > 0) {
        const allLessons = [];
        courseData.modules.forEach((m) => {
          if (m.lessons) allLessons.push(...m.lessons);
        });

        if (courseData.lastAccessedLessonId) {
          initialLesson = allLessons.find((l) => l.id === courseData.lastAccessedLessonId);
        }

        if (!initialLesson && allLessons.length > 0) {
          // Find first uncompleted lesson, or default to first lesson
          initialLesson = allLessons.find((l) => !l.completed) || allLessons[0];
        }
      }

      if (initialLesson) {
        // Fetch fresh lesson details (which updates last accessed timestamp)
        const detailedLesson = await lessonService.getLessonById(initialLesson.id);
        setActiveLesson(detailedLesson);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course learning workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const handleSelectLesson = async (lesson) => {
    try {
      const detailed = await lessonService.getLessonById(lesson.id);
      setActiveLesson(detailed);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast('Could not load lesson details', 'error');
    }
  };

  const handleToggleComplete = async (lessonId) => {
    try {
      const updated = await lessonService.toggleComplete(lessonId);

      // Update state locally
      setCourse((prevCourse) => {
        if (!prevCourse) return prevCourse;
        let completedCount = 0;
        let totalCount = 0;

        const updatedModules = prevCourse.modules.map((m) => {
          const updatedLessons = m.lessons.map((l) => {
            totalCount++;
            if (l.id === lessonId) {
              const status = updated.completed;
              if (status) completedCount++;
              return { ...l, completed: status };
            } else {
              if (l.completed) completedCount++;
              return l;
            }
          });
          return { ...m, lessons: updatedLessons };
        });

        const newPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100 * 10) / 10 : 0;
        return {
          ...prevCourse,
          modules: updatedModules,
          progressPercentage: newPercentage,
        };
      });

      if (activeLesson && activeLesson.id === lessonId) {
        setActiveLesson((prev) => ({ ...prev, completed: updated.completed }));
      }

      showToast(updated.completed ? 'Lesson marked as completed!' : 'Lesson marked as uncompleted.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update lesson completion.', 'error');
    }
  };

  // Get all flattened lessons for navigation
  const getAllLessons = () => {
    if (!course || !course.modules) return [];
    const list = [];
    course.modules.forEach((m) => {
      if (m.lessons) list.push(...m.lessons);
    });
    return list;
  };

  const allLessons = getAllLessons();
  const currentIndex = activeLesson ? allLessons.findIndex((l) => l.id === activeLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleOpenSubmit = (assignment) => {
    setModalAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const handleSubmissionComplete = async () => {
    const updatedAssignments = await assignmentService.getCourseAssignments(id);
    setAssignments(updatedAssignments);
  };

  if (loading) return <LoadingSpinner fullPage message="Loading video classroom..." />;
  if (error) return <div className="container py-5"><ErrorMessage message={error} onRetry={fetchCourseData} /></div>;
  if (!course) return null;

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Course Top Navigation & Progress Bar */}
        <div className="card-custom p-3 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Link to="/my-courses" className="text-decoration-none text-muted small hover-primary">
                  <i className="bi bi-chevron-left me-1"></i> Back to My Courses
                </Link>
                <span className="text-muted small">&bull;</span>
                <span className="badge bg-primary-subtle text-primary small">{course.category}</span>
              </div>
              <h4 className="fw-bold text-dark mb-0">{course.title}</h4>
            </div>

            <div style={{ minWidth: '220px' }}>
              <ProgressBar
                value={course.progressPercentage || 0}
                showLabel
                labelPrefix="Course"
              />
            </div>
          </div>
        </div>

        {/* Classroom Grid */}
        <div className="row g-4">
          {/* Main Left: Video Player, Lesson Details & Assignments */}
          <div className="col-lg-8">
            <div className="card-custom p-4 mb-4">
              {/* Tabs for switching between Video Lesson & Course Assignments */}
              <ul className="nav nav-pills mb-4 pb-2 border-bottom">
                <li className="nav-item">
                  <button
                    className={`nav-link fw-semibold d-flex align-items-center gap-2 ${activeTab === 'lessons' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lessons')}
                  >
                    <i className="bi bi-play-circle"></i>
                    <span>Lesson Player</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link fw-semibold d-flex align-items-center gap-2 ${activeTab === 'assignments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('assignments')}
                  >
                    <i className="bi bi-file-earmark-code"></i>
                    <span>Assignments & Projects ({assignments.length})</span>
                  </button>
                </li>
              </ul>

              {activeTab === 'lessons' ? (
                activeLesson ? (
                  <div>
                    {/* Video Player */}
                    <VideoPlayer
                      videoUrl={activeLesson.videoUrl}
                      localVideoPath={activeLesson.localVideoPath}
                      title={activeLesson.title}
                      onEnded={() => {
                        if (!activeLesson.completed) {
                          handleToggleComplete(activeLesson.id);
                        }
                      }}
                    />

                    {/* Lesson Header & Mark Completed Button */}
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 my-3">
                      <div>
                        <h4 className="fw-bold text-dark mb-1">{activeLesson.title}</h4>
                        <div className="text-muted small d-flex align-items-center gap-2">
                          <i className="bi bi-clock text-primary"></i>
                          <span>Duration: {activeLesson.duration || '10 min'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleComplete(activeLesson.id)}
                        className={`btn btn-sm d-flex align-items-center gap-2 ${
                          activeLesson.completed ? 'btn-success' : 'btn-outline-custom'
                        }`}
                      >
                        <i className={`bi ${activeLesson.completed ? 'bi-check2-circle' : 'bi-circle'}`}></i>
                        <span>{activeLesson.completed ? 'Completed' : 'Mark as Complete'}</span>
                      </button>
                    </div>

                    {/* Lesson Description */}
                    <div className="bg-light p-3 rounded-3 mb-4 border">
                      <h6 className="fw-bold text-dark mb-2">Lesson Overview</h6>
                      <p className="text-secondary small mb-0" style={{ whiteSpace: 'pre-line' }}>
                        {activeLesson.description || 'Watch the video lesson and follow along with the code demonstration.'}
                      </p>
                    </div>

                    {/* Downloadable Learning Resource */}
                    {activeLesson.resourcePath && (
                      <div className="p-3 bg-primary-light rounded-3 d-flex align-items-center justify-content-between mb-4 border border-primary-subtle">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-file-earmark-arrow-down-fill text-primary fs-4"></i>
                          <div>
                            <div className="fw-bold small text-dark">Supplementary Learning Material</div>
                            <div className="text-muted small">{activeLesson.resourceName || 'Lesson Notes & Code'}</div>
                          </div>
                        </div>
                        <a
                          href={`/api/files/${activeLesson.resourcePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary-custom"
                        >
                          <i className="bi bi-download me-1"></i> Download
                        </a>
                      </div>
                    )}

                    {/* Lesson Navigation Controls */}
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <button
                        className="btn btn-outline-custom btn-sm"
                        disabled={!prevLesson}
                        onClick={() => prevLesson && handleSelectLesson(prevLesson)}
                      >
                        <i className="bi bi-chevron-left me-1"></i> Previous Lesson
                      </button>

                      <button
                        className="btn btn-primary-custom btn-sm"
                        disabled={!nextLesson}
                        onClick={() => nextLesson && handleSelectLesson(nextLesson)}
                      >
                        Next Lesson <i className="bi bi-chevron-right ms-1"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-collection-play fs-1 mb-2"></i>
                    <p>Select a lesson from the module list on the right to start watching.</p>
                  </div>
                )
              ) : (
                /* Assignments Tab */
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">Course Assignments</h5>
                    <span className="text-muted small">{assignments.length} total assignments</span>
                  </div>

                  {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        onSubmitClick={handleOpenSubmit}
                      />
                    ))
                  ) : (
                    <div className="text-center py-5 text-muted card-custom">
                      <i className="bi bi-file-earmark-check fs-1 mb-2"></i>
                      <p className="small mb-0">No assignments published for this course yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Module & Lesson Curriculum Drawer */}
          <div className="col-lg-4">
            <div className="card-custom p-4 sticky-top" style={{ top: '80px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Course Content</h5>
                <span className="badge bg-light text-secondary border small">
                  {course.moduleCount} modules
                </span>
              </div>

              <LessonList
                modules={course.modules || []}
                activeLessonId={activeLesson?.id}
                onSelectLesson={handleSelectLesson}
                onToggleComplete={handleToggleComplete}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      <SubmissionModal
        isOpen={isSubmitModalOpen}
        assignment={modalAssignment}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitted={handleSubmissionComplete}
      />
    </div>
  );
};

export default CourseLearning;
