import React from 'react';
import { BookOpen, CheckCircle, Target, Users, Globe } from 'lucide-react';

const About = () => {
  return (
    <div style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
            About EduVibe LMS
          </span>
          <h1 className="section-title">Transforming Education for the Digital Era</h1>
          <p className="section-subtitle">
            Our mission is to provide accessible, high-quality, and outcome-oriented technology education to learners across the globe.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid-2" style={{ alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h2 style={{ marginBottom: '1.25rem' }}>Empowering Developers & Tech Enthusiasts</h2>
            <p style={{ color: '#57534E', marginBottom: '1rem', lineHeight: '1.7' }}>
              EduVibe LMS was built with a single goal in mind: bridging the gap between theoretical knowledge and real-world software engineering practice.
            </p>
            <p style={{ color: '#57534E', marginBottom: '1.5rem', lineHeight: '1.7' }}>
              Whether you are taking your first steps into programming with Python or mastering full-stack MERN engineering, our platform provides structured modules, live progress tracking, and interactive learning tools.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={styles.checkItem}>
                <CheckCircle size={20} color="#B87333" />
                <span>Industry-curated project assignments & curriculum</span>
              </div>
              <div style={styles.checkItem}>
                <CheckCircle size={20} color="#B87333" />
                <span>Self-paced learning with real-time analytics</span>
              </div>
              <div style={styles.checkItem}>
                <CheckCircle size={20} color="#B87333" />
                <span>Role-based portal for students & instructors</span>
              </div>
            </div>
          </div>

          <div style={styles.imgWrapper}>
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80"
              alt="Team collaborating"
              style={styles.aboutImg}
            />
          </div>
        </div>

        {/* Mission / Vision Cards */}
        <div className="grid-3">
          <div className="card" style={{ padding: '2rem' }}>
            <div style={styles.iconBox}>
              <Target size={28} color="#3D291F" />
            </div>
            <h3 style={{ marginBottom: '0.75rem' }}>Our Mission</h3>
            <p style={{ color: '#78716C', fontSize: '0.92rem' }}>
              To deliver practical, high-impact education that enables learners to build real applications and advance their professional tech careers.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={styles.iconBox}>
              <Globe size={28} color="#3D291F" />
            </div>
            <h3 style={{ marginBottom: '0.75rem' }}>Global Reach</h3>
            <p style={{ color: '#78716C', fontSize: '0.92rem' }}>
              Removing geographical barriers by allowing students anywhere to access top-tier course materials, code examples, and lesson tracking.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={styles.iconBox}>
              <Users size={28} color="#3D291F" />
            </div>
            <h3 style={{ marginBottom: '0.75rem' }}>Supportive Community</h3>
            <p style={{ color: '#78716C', fontSize: '0.92rem' }}>
              Connecting students with experienced instructors and peers for continuous encouragement, feedback, and career readiness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: '600',
    color: '#1C1917'
  },
  imgWrapper: {
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
  },
  aboutImg: {
    width: '100%',
    height: '380px',
    objectFit: 'cover',
    display: 'block'
  },
  iconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: '#F4ECE6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem'
  }
};

export default About;
