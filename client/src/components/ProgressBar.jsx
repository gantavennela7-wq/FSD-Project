import React from 'react';

const ProgressBar = ({ progress = 0, showLabel = true, height = 8 }) => {
  const percentage = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div style={styles.container}>
      <div className="progress-bar-container" style={{ height: `${height}px` }}>
        <div
          className={`progress-bar-fill ${percentage === 100 ? 'completed' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && <span style={styles.label}>{percentage}%</span>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#3D291F',
    minWidth: '36px',
    textAlign: 'right'
  }
};

export default ProgressBar;
