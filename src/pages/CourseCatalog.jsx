import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseService } from '../services/courseService';
import CourseGrid from '../components/CourseGrid';

const CourseCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter and pagination state
  const queryParam = searchParams.get('query') || '';
  const categoryParam = searchParams.get('category') || '';
  const difficultyParam = searchParams.get('difficulty') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sortByParam = searchParams.get('sortBy') || 'createdAt';
  const sortDirParam = searchParams.get('sortDir') || 'desc';

  const [query, setQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficultyParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState(sortByParam);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await courseService.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch courses on filter change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const sortDirection = sortBy === 'title' ? 'asc' : 'desc';
        const data = await courseService.getCourses({
          query: query || undefined,
          category: selectedCategory || undefined,
          difficulty: selectedDifficulty || undefined,
          page: currentPage,
          size: 9,
          sortBy,
          sortDir: sortDirection,
        });

        setCourses(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [query, selectedCategory, selectedDifficulty, currentPage, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setCurrentPage(0);
    setSortBy('createdAt');
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold text-dark mb-2">Explore Course Catalog</h1>
        <p className="text-muted">
          Browse verified courses across software engineering, web development, data science, and cloud computing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-custom p-4 mb-4">
        <form onSubmit={handleSearchSubmit}>
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title or topic..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(0);
                  }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(0);
                }}
              >
                <option value="">All Categories</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                className="form-select"
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setCurrentPage(0);
                }}
              >
                <option value="">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="col-12 col-md-2">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Newest First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </form>

        {/* Active Filters / Reset */}
        {(query || selectedCategory || selectedDifficulty) && (
          <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top">
            <span className="text-muted small">Active Filters:</span>
            {query && <span className="badge bg-light text-dark border">Query: {query}</span>}
            {selectedCategory && <span className="badge bg-light text-dark border">Category: {selectedCategory}</span>}
            {selectedDifficulty && <span className="badge bg-light text-dark border">Difficulty: {selectedDifficulty}</span>}
            <button
              onClick={handleResetFilters}
              className="btn btn-sm btn-link text-danger text-decoration-none ms-auto"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="text-muted small">
          Showing <strong>{courses.length}</strong> of <strong>{totalElements}</strong> available courses
        </div>
      </div>

      {/* Courses Grid */}
      <CourseGrid courses={courses} loading={loading} emptyMessage="No published courses match your search criteria." />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-5" aria-label="Course pagination">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                disabled={currentPage === 0}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, idx) => (
              <li key={idx} className={`page-item ${currentPage === idx ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(idx)}>
                  {idx + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default CourseCatalog;
