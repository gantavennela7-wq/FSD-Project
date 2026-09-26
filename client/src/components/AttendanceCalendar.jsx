import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/api';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Flame } from 'lucide-react';

const AttendanceCalendar = ({ activeDatesProp = null }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
  const [activeDates, setActiveDates] = useState(activeDatesProp || []);
  const [loading, setLoading] = useState(!activeDatesProp);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchCalendar = async (year, month) => {
    setLoading(true);
    try {
      const data = await attendanceService.getCalendar({ year, month });
      setActiveDates(data.activeDates || []);
    } catch (err) {
      console.error('Failed to fetch attendance calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeDatesProp) {
      fetchCalendar(currentYear, currentMonth);
    } else {
      setActiveDates(activeDatesProp);
    }
  }, [currentYear, currentMonth, activeDatesProp]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar grid
  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun, 1 = Mon...
  // Convert so Monday = 0, Sunday = 6
  const startingDay = (firstDayIndex + 6) % 7;
  const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();

  const daysArray = [];
  // Empty slots before 1st day
  for (let i = 0; i < startingDay; i++) {
    daysArray.push(null);
  }
  // Days 1..N
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    daysArray.push(day);
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const activeDateSet = new Set(activeDates);

  const activeDaysCount = activeDates.filter((d) =>
    d.startsWith(`${currentYear}-${String(currentMonth).padStart(2, '0')}`)
  ).length;

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      {/* Calendar Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={styles.iconCircle}>
            <CalendarIcon size={18} color="#3D291F" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Learning Attendance Calendar</h3>
            <span style={{ fontSize: '0.8rem', color: '#78716C' }}>
              Track daily learning attendance on the platform
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: '700', fontSize: '0.95rem', marginRight: '0.5rem' }}>
            {monthNames[currentMonth - 1]} {currentYear}
          </span>
          <button style={styles.navBtn} onClick={handlePrevMonth} title="Previous Month">
            <ChevronLeft size={16} />
          </button>
          <button style={styles.navBtn} onClick={handleNextMonth} title="Next Month">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Labels (Mon -> Sun) */}
      <div style={styles.weekdaysGrid}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => (
          <div key={idx} style={styles.weekdayLabel}>
            {dayName}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={styles.daysGrid}>
        {daysArray.map((dayNum, index) => {
          if (!dayNum) {
            return <div key={`empty-${index}`} style={styles.emptyCell} />;
          }

          const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const isPresent = activeDateSet.has(dateString);
          const isToday = dateString === todayStr;

          return (
            <div
              key={`day-${dayNum}`}
              style={{
                ...styles.dayCell,
                ...(isPresent ? styles.presentDayCell : {}),
                ...(isToday ? styles.todayCell : {})
              }}
              title={
                isPresent
                  ? `${dateString}: Learning Activity Completed (Present)`
                  : `${dateString}: No Activity Recorded`
              }
            >
              <span style={{ ...styles.dayNumber, fontWeight: isPresent || isToday ? '700' : '500' }}>
                {dayNum}
              </span>

              {isPresent ? (
                <div style={styles.presentIndicator}>
                  <span style={styles.presentDot}>●</span>
                </div>
              ) : (
                <div style={{ height: '14px' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend & Monthly Summary */}
      <div style={styles.footer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: '#15803D', fontSize: '1rem', lineHeight: '1' }}>●</span>
            <span style={{ color: '#1C1917', fontWeight: '600' }}>Active Learning (Present)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E7E5E4' }} />
            <span style={{ color: '#78716C' }}>No Activity</span>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#3D291F', fontWeight: '700' }}>
          {activeDaysCount} Days Active this Month
        </div>
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
    backgroundColor: '#F4ECE6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navBtn: {
    background: '#FAF8F5',
    border: '1px solid #E7E5E4',
    borderRadius: '6px',
    padding: '4px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3D291F',
    transition: 'background 0.15s'
  },
  weekdaysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '6px',
    marginBottom: '6px',
    textAlign: 'center'
  },
  weekdayLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#78716C',
    textTransform: 'uppercase',
    padding: '4px 0'
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '6px'
  },
  emptyCell: {
    minHeight: '44px',
    backgroundColor: 'transparent'
  },
  dayCell: {
    minHeight: '44px',
    borderRadius: '8px',
    backgroundColor: '#FAF8F5',
    border: '1px solid #E7E5E4',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 2px',
    transition: 'all 0.15s ease'
  },
  presentDayCell: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC'
  },
  todayCell: {
    border: '2px solid #3D291F'
  },
  dayNumber: {
    fontSize: '0.82rem',
    color: '#1C1917',
    lineHeight: '1.2'
  },
  presentIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '14px'
  },
  presentDot: {
    color: '#15803D',
    fontSize: '0.9rem',
    lineHeight: '1'
  },
  footer: {
    marginTop: '1.25rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #E7E5E4',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.75rem'
  }
};

export default AttendanceCalendar;
