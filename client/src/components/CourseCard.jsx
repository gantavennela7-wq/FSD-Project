import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Users, BookOpen, Star, FileText } from 'lucide-react';

const CourseCard = ({ course }) => {
  const {
    _id,
    title,
    description,
    instructor,
    category,
    level,
    duration,
    thumbnail,
    rating = 4.8,
    enrolledCount,
    lessons
  } = course;

  const lessonsCount = lessons ? lessons.length : 5;

  return (
    <div className="card card-hover" style={styles.card}>
      {/* Thumbnail */}
      <div style={styles.thumbnailContainer}>
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
          alt={title}
          style={styles.thumbnail}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <span className="badge badge-primary" style={styles.categoryBadge}>
          {category}
        </span>
        <span
          className={`badge ${
            level === 'Beginner' ? 'badge-success' : level === 'Intermediate' ? 'badge-warning' : 'badge-info'
          }`}
          style={styles.levelBadge}
        >
          {level}
        </span>
      </div>

      {/* Content */}
      <div style={styles.body}>
        {/* Rating and Lessons Count */}
        <div style={styles.topMeta}>
          <div style={styles.ratingBox}>
            <Star size={14} color="#B87333" fill="#B87333" />
            <strong style={{ fontSize: '0.85rem', color: '#1C1917' }}>{rating}</strong>
          </div>
          <div style={styles.metaItem}>
            <FileText size={13} color="#78716C" />
            <span>{lessonsCount} lessons</span>
          </div>
        </div>

        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>
          {description?.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>

        <div style={styles.metaRow}>
          <div style={styles.metaItem}>
            <User size={14} color="#78716C" />
            <span>{instructor}</span>
          </div>
          <div style={styles.metaItem}>
            <Clock size={14} color="#78716C" />
            <span>{duration}</span>
          </div>
        </div>

        <div style={styles.footerRow}>
          <div style={styles.studentsCount}>
            <Users size={15} color="#B87333" />
            <span>{enrolledCount || 0} enrolled</span>
          </div>
          <Link to={`/courses/${_id}`} className="btn btn-primary btn-sm">
            <BookOpen size={14} /> Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 0,
    height: '100%'
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: '180px',
    backgroundColor: '#F3EFEA',
    overflow: 'hidden'
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
  },
  levelBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
  },
  body: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  topMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.4rem'
  },
  ratingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    lineHeight: '1.3'
  },
  description: {
    fontSize: '0.88rem',
    color: '#78716C',
    marginBottom: '1rem',
    flex: 1
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '0.75rem',
    borderTop: '1px solid #E7E5E4',
    marginBottom: '0.85rem',
    fontSize: '0.82rem',
    color: '#78716C'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.82rem',
    color: '#78716C'
  },
  footerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  studentsCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#3D291F'
  }
};

export default CourseCard;
