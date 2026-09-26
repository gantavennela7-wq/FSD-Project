import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/api';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Award, Compass, TrendingUp, Monitor, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAll();
        setPopularCourses(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load courses on homepage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <span className="badge badge-primary" style={{ marginBottom: '1.25rem' }}>
              🚀 Next-Generation Learning Management Platform
            </span>
            <h1 style={styles.heroTitle}>
              Learn. Grow. <span style={{ color: '#B87333' }}>Achieve.</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Empowering learners worldwide with industry-leading full-stack development, algorithms, and data science courses. Build real portfolio projects with step-by-step guidance.
            </p>

            <div style={styles.heroButtons}>
              <Link to="/courses" className="btn btn-primary btn-lg">
                Explore Courses <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Get Started Free
              </Link>
            </div>

            <div style={styles.statsStrip}>
              <div style={styles.statItem}>
                <CheckCircle2 size={18} color="#B87333" /> 100+ Verified Lessons
              </div>
              <div style={styles.statItem}>
                <CheckCircle2 size={18} color="#B87333" /> 100% Self-Paced
              </div>
              <div style={styles.statItem}>
                <CheckCircle2 size={18} color="#B87333" /> Industry Certification
              </div>
            </div>
          </div>

          <div style={styles.heroImageCard}>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
              alt="Students Learning Online"
              style={styles.heroImg}
            />
            <div style={styles.floatingBadge}>
              <Award size={24} color="#B87333" />
              <div>
                <strong>Expert-Led Curriculum</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#78716C' }}>Designed by Senior Engineers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Why Choose EduVibe LMS?</h2>
            <p className="section-subtitle">Designed to give you the ultimate learning experience from anywhere in the world.</p>
          </div>

          <div className="grid-4">
            <div className="card" style={styles.featureCard}>
              <div style={styles.iconCircle}>
                <Award size={26} color="#3D291F" />
              </div>
              <h3 style={styles.featureTitle}>Expert Courses</h3>
              <p style={styles.featureDesc}>
                Curriculum crafted by industry veterans covering in-demand web development, Python, and data science concepts.
              </p>
            </div>

            <div className="card" style={styles.featureCard}>
              <div style={styles.iconCircle}>
                <Monitor size={26} color="#3D291F" />
              </div>
              <h3 style={styles.featureTitle}>Learn Anywhere</h3>
              <p style={styles.featureDesc}>
                Access lesson materials, interactive modules, and practical content 24/7 on desktop, tablet, or mobile.
              </p>
            </div>

            <div className="card" style={styles.featureCard}>
              <div style={styles.iconCircle}>
                <TrendingUp size={26} color="#3D291F" />
              </div>
              <h3 style={styles.featureTitle}>Track Progress</h3>
              <p style={styles.featureDesc}>
                Real-time progress bars, completed lesson check-offs, and completion analytics to keep you motivated.
              </p>
            </div>

            <div className="card" style={styles.featureCard}>
              <div style={styles.iconCircle}>
                <Compass size={26} color="#3D291F" />
              </div>
              <h3 style={styles.featureTitle}>Practical Learning</h3>
              <p style={styles.featureDesc}>
                Focus on real-world projects, practical code implementations, and hands-on skill building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section style={styles.popularSection}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 className="section-title">Popular Courses</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Explore our most enrolled learning paths.</p>
            </div>
            <Link to="/courses" className="btn btn-outline">
              View All Courses <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching popular courses..." />
          ) : popularCourses.length > 0 ? (
            <div className="grid-3">
              {popularCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#78716C' }}>No courses currently available.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={styles.ctaBanner}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#FFFFFF', marginBottom: '1rem', fontSize: '2.2rem' }}>
            Ready to Start Your Learning Journey?
          </h2>
          <p style={{ color: '#E7E5E4', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.1rem' }}>
            Join thousands of students building real projects and advancing their careers today.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ backgroundColor: '#B87333', borderColor: '#B87333' }}>
            Create Free Account Now
          </Link>
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    padding: '4rem 0 5rem 0',
    backgroundColor: '#FAF8F5',
    borderBottom: '1px solid #E7E5E4'
  },
  heroContainer: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '3rem',
    alignItems: 'center'
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  heroTitle: {
    fontSize: '3.2rem',
    fontWeight: '800',
    lineHeight: '1.15',
    marginBottom: '1.25rem',
    letterSpacing: '-1px'
  },
  heroSubtitle: {
    fontSize: '1.15rem',
    color: '#57534E',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '2.5rem'
  },
  statsStrip: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#3D291F'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  heroImageCard: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
  },
  heroImg: {
    width: '100%',
    height: '420px',
    objectFit: 'cover',
    display: 'block'
  },
  floatingBadge: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    backgroundColor: '#FFFFFF',
    padding: '1rem 1.25rem',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.12)'
  },
  featuresSection: {
    padding: '5rem 0',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E7E5E4'
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  iconCircle: {
    width: '54px',
    height: '54px',
    borderRadius: '14px',
    backgroundColor: '#F4ECE6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem'
  },
  featureTitle: {
    fontSize: '1.2rem',
    fontWeight: '700'
  },
  featureDesc: {
    fontSize: '0.9rem',
    color: '#78716C',
    lineHeight: '1.5'
  },
  popularSection: {
    padding: '5rem 0',
    backgroundColor: '#FAF8F5'
  },
  ctaBanner: {
    backgroundColor: '#3D291F',
    padding: '4.5rem 0'
  }
};

export default Home;
