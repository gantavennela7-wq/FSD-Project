import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          {/* Brand Info */}
          <div>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <BookOpen size={20} color="#FFFFFF" />
              </div>
              <span style={styles.logoText}>EduVibe LMS</span>
            </div>
            <p style={styles.description}>
              Empowering learners worldwide with industry-aligned digital skills, expert instruction, and flexible, self-paced learning paths.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={styles.heading}>Quick Links</h4>
            <ul style={styles.list}>
              <li><Link to="/" style={styles.link}>Home</Link></li>
              <li><Link to="/courses" style={styles.link}>Explore Courses</Link></li>
              <li><Link to="/about" style={styles.link}>About Us</Link></li>
              <li><Link to="/login" style={styles.link}>Student Login</Link></li>
              <li><Link to="/register" style={styles.link}>Register Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={styles.heading}>Popular Categories</h4>
            <ul style={styles.list}>
              <li style={styles.textItem}>Web Development</li>
              <li style={styles.textItem}>Python Programming</li>
              <li style={styles.textItem}>Data Structures & Algorithms</li>
              <li style={styles.textItem}>Machine Learning & AI</li>
              <li style={styles.textItem}>UI/UX & Modern Web Design</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 style={styles.heading}>Contact Support</h4>
            <ul style={styles.list}>
              <li style={styles.contactItem}>
                <Mail size={16} color="#B87333" />
                <span>support@eduvibe-lms.com</span>
              </li>
              <li style={styles.contactItem}>
                <Phone size={16} color="#B87333" />
                <span>+1 (800) 555-0199</span>
              </li>
              <li style={styles.contactItem}>
                <MapPin size={16} color="#B87333" />
                <span>100 Education Way, Tech Campus, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p>© {new Date().getFullYear()} EduVibe Learning Management System. All rights reserved.</p>
          <p style={styles.credit}>
            Built with <Heart size={14} color="#B91C1C" style={{ display: 'inline', margin: '0 4px' }} /> for modern education.
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1C1917',
    color: '#D6D3D1',
    paddingTop: '4rem',
    paddingBottom: '2rem',
    marginTop: 'auto',
    borderTop: '4px solid #3D291F'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
    gap: '2.5rem',
    marginBottom: '3rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  logoIcon: {
    backgroundColor: '#B87333',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#FFFFFF'
  },
  description: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: '#A8A29E',
    maxWidth: '320px'
  },
  heading: {
    color: '#FFFFFF',
    fontSize: '1.05rem',
    fontWeight: '700',
    marginBottom: '1.25rem'
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem'
  },
  link: {
    color: '#A8A29E',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
    textDecoration: 'none'
  },
  textItem: {
    color: '#A8A29E',
    fontSize: '0.9rem'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.9rem',
    color: '#A8A29E'
  },
  bottomBar: {
    borderTop: '1px solid #292524',
    paddingTop: '1.75rem',
    display: 'flex',
    justifyCumulative: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#78716C'
  },
  credit: {
    display: 'flex',
    alignItems: 'center'
  }
};

export default Footer;
