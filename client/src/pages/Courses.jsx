import React, { useState, useEffect } from 'react';
import { courseService } from '../services/api';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, RefreshCw } from 'lucide-react';

const CATEGORIES = ['All', 'Web Development', 'Programming', 'Computer Science', 'Data Science', 'Design'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAll({
        search,
        category: selectedCategory,
        level: selectedLevel
      });
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedLevel]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedLevel('All');
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">Explore All Courses</h1>
          <p className="section-subtitle">Discover structured learning programs designed to elevate your technical expertise.</p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
          <div style={styles.filterGrid}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} color="#78716C" style={styles.searchIcon} />
              <input
                type="text"
                className="form-input"
                placeholder="Search by course title, description, or instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Category Select */}
            <div style={{ minWidth: '180px' }}>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Select */}
            <div style={{ minWidth: '160px' }}>
              <select
                className="form-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Level: {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            {(search || selectedCategory !== 'All' || selectedLevel !== 'All') && (
              <button className="btn btn-secondary" onClick={handleResetFilters}>
                <RefreshCw size={16} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Course Grid / Loading / Empty State */}
        {loading ? (
          <LoadingSpinner message="Searching available courses..." />
        ) : courses.length > 0 ? (
          <div className="grid-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Filter size={48} color="#A8A29E" style={{ marginBottom: '1rem' }} />
            <h3>No courses found</h3>
            <p style={{ color: '#78716C', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              We couldn't find any courses matching your current search or filter parameters.
            </p>
            <button className="btn btn-primary" onClick={handleResetFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  filterGrid: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  }
};

export default Courses;
