import React from 'react';
import { Award, CheckCircle2, Lock } from 'lucide-react';

const LearningMilestones = ({ milestones = [] }) => {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={styles.iconCircle}>
            <Award size={18} color="#B87333" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Learning Milestones & Achievements</h3>
            <span style={{ fontSize: '0.8rem', color: '#78716C' }}>
              Earn badges as you maintain streaks and complete courses
            </span>
          </div>
        </div>

        <span className="badge badge-primary">
          {milestones.filter((m) => m.achieved).length} / {milestones.length} Completed
        </span>
      </div>

      <div style={styles.milestonesGrid}>
        {milestones.map((m) => {
          const isDone = m.achieved;
          return (
            <div
              key={m.id}
              style={{
                ...styles.milestoneCard,
                ...(isDone ? styles.milestoneDone : styles.milestoneLocked)
              }}
            >
              <div style={styles.badgeIconWrapper}>
                <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                {isDone && (
                  <CheckCircle2
                    size={16}
                    color="#15803D"
                    style={styles.doneCheck}
                  />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.92rem', color: isDone ? '#1C1917' : '#57534E' }}>
                    {m.title}
                  </strong>
                  {isDone ? (
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      Unlocked
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#78716C' }}>
                      {m.current} / {m.target}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.8rem', color: '#78716C', margin: '0.2rem 0 0.5rem 0' }}>
                  {m.description}
                </p>

                {/* Progress bar */}
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${m.progress || 0}%`,
                      backgroundColor: isDone ? '#15803D' : '#B87333'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #E7E5E4',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#FBF4ED',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  milestonesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem'
  },
  milestoneCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.9rem',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid #E7E5E4',
    transition: 'all 0.2s ease'
  },
  milestoneDone: {
    backgroundColor: '#FAF8F5',
    borderColor: '#E7E5E4'
  },
  milestoneLocked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F3EFEA',
    opacity: 0.85
  },
  badgeIconWrapper: {
    position: 'relative',
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E7E5E4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  doneCheck: {
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
    backgroundColor: '#FFFFFF',
    borderRadius: '50%'
  },
  progressBar: {
    height: '5px',
    borderRadius: '9999px',
    backgroundColor: '#E7E5E4',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.3s ease'
  }
};

export default LearningMilestones;
