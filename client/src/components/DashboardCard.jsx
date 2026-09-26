import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, subtext, color = '#3D291F' }) => {
  return (
    <div className="card" style={styles.card}>
      <div style={styles.content}>
        <span style={styles.title}>{title}</span>
        <h3 style={styles.value}>{value}</h3>
        {subtext && <span style={styles.subtext}>{subtext}</span>}
      </div>
      {Icon && (
        <div style={{ ...styles.iconBox, backgroundColor: `${color}15`, color: color }}>
          <Icon size={26} />
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.4rem'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#78716C',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  value: {
    fontSize: '1.85rem',
    fontWeight: '800',
    color: '#1C1917'
  },
  subtext: {
    fontSize: '0.8rem',
    color: '#A8A29E'
  },
  iconBox: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default DashboardCard;
