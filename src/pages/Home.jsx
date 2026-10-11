import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, categoriesData] = await Promise.all([
          courseService.getCourses({ size: 6, sortBy: 'createdAt', sortDir: 'desc' }),
          courseService.getCategories(),
        ]);
        setFeaturedCourses(coursesData.content || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Failed to load home page courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-primary bg-opacity-25 text-primary-light px-3 py-2 rounded-pill fw-semibold mb-3">
                <i className="bi bi-stars me-1 text-warning"></i> Empower Your Learning Journey
              </span>
              <h1 className="hero-title">
                Master Tomorrow's Skills with LearnHub.
              </h1>
              <p className="hero-subtitle">
                A modern full-stack learning platform where students master cutting-edge software engineering, data science, and technology with interactive video lessons and real-world assignments.
              </p>

              {/* Course Search Bar */}
              <form onSubmit={handleSearch} className="mb-4 d-flex gap-2 p-2 bg-white rounded-3 shadow-lg" style={{ maxWidth: '580px' }}>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-0 text-muted ps-3">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none text-dark"
                    placeholder="Search by course title or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary-custom px-4 flex-shrink-0">
                  Search
                </button>
              </form>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/catalog" className="btn btn-primary-custom px-4 py-2">
                  <i className="bi bi-compass me-2"></i> Browse All Courses
                </Link>
                <Link to="/register" className="btn btn-outline-light px-4 py-2">
                  Join as Student
                </Link>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                  alt="Students learning together"
                  className="img-fluid rounded-4 shadow-lg border border-4 border-white"
                  style={{ transform: 'rotate(1deg)' }}
                />
                <div
                  className="position-absolute bottom-0 start-0 bg-white p-3 rounded-3 shadow-lg m-3 d-flex align-items-center gap-3 border"
                  style={{ transform: 'translateY(20px)' }}
                >
                  <div className="stat-icon primary">
                    <i className="bi bi-patch-check-fill text-primary"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Verified Curriculum</div>
                    <div className="text-muted small">Taught by industry educators</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Benefits */}
      <section className="py-5 bg-white border-bottom">
        <div className="container py-4">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-3 h-100 card-custom">
                <div className="stat-icon primary mx-auto mb-3">
                  <i className="bi bi-camera-video-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">Interactive Video Lessons</h5>
                <p className="text-muted small mb-0">
                  Stream high-definition tutorials with instant progress persistence in MySQL.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-3 h-100 card-custom">
                <div className="stat-icon success mx-auto mb-3">
                  <i className="bi bi-file-earmark-code-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">Hands-On Assignments</h5>
                <p className="text-muted small mb-0">
                  Submit code and project attachments with deadline monitoring and late submission rules.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-3 h-100 card-custom">
                <div className="stat-icon warning mx-auto mb-3">
                  <i className="bi bi-award-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">Instructor Feedback & Grades</h5>
                <p className="text-muted small mb-0">
                  Receive personalized grading, marks calculation, and written feedback directly in your student gradebook.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="badge bg-primary-subtle text-primary fw-semibold mb-2">Curated Catalog</span>
              <h2 className="fw-bold text-dark mb-0">Featured Courses</h2>
            </div>
            <Link to="/catalog" className="text-decoration-none fw-semibold text-primary d-flex align-items-center gap-1">
              <span>View all courses</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading courses..." />
          ) : featuredCourses.length > 0 ? (
            <div className="row g-4">
              {featuredCourses.map((course) => (
                <div key={course.id} className="col-12 col-md-6 col-lg-4">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No courses currently available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-5 bg-white border-top">
          <div className="container py-4">
            <h2 className="fw-bold text-dark text-center mb-4">Explore by Category</h2>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/catalog?category=${encodeURIComponent(cat)}`}
                  className="btn btn-outline-custom px-4 py-2 d-flex align-items-center gap-2"
                >
                  <i className="bi bi-tag-fill text-primary"></i>
                  <span>{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call To Action */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' }}>
        <div className="container py-4 text-center text-white">
          <h2 className="fw-bold text-white mb-3">Ready to Start Learning?</h2>
          <p className="text-light mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            Enroll in top-rated courses today and start tracking your lessons and grades with LearnHub.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-light text-primary fw-bold px-4 py-2">
              Create Free Account
            </Link>
            <Link to="/login" className="btn btn-outline-light px-4 py-2">
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
