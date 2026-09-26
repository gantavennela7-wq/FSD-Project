import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { enrollmentService, attendanceService } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import AIAssistantModal from '../components/AIAssistantModal';
import CodeCompiler from '../components/CodeCompiler';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  ArrowLeft,
  Award,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Flame,
  Bot,
  Sparkles,
  Layers,
  Code
} from 'lucide-react';

const CourseLearning = () => {
  const { id } = useParams(); // courseId or enrollmentId

  const [enrollment, setEnrollment] = useState(null);
  const [course, setCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [streak, setStreak] = useState(0);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');

  useEffect(() => {
    const fetchEnrollmentAndAttendance = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await enrollmentService.getById(id);
        setEnrollment(data);
        setCourse(data.course);

        // Find first incomplete lesson or default to 0
        const completedSet = new Set(data.completedLessons || []);
        let initialIndex = 0;
        if (data.course?.lessons) {
          const firstIncomplete = data.course.lessons.findIndex(
            (l) => !completedSet.has(l._id?.toString() || l.title)
          );
          if (firstIncomplete !== -1) {
            initialIndex = firstIncomplete;
            setActiveLessonIndex(firstIncomplete);
          }
        }

        // Record daily learning activity for opening course
        const firstLesson = data.course?.lessons?.[initialIndex];
        const lessonId = firstLesson?._id?.toString() || firstLesson?.title || '';
        const activityRes = await attendanceService.recordActivity({
          courseId: data.course?._id || data.course,
          lessonId,
          activityType: 'lesson_started',
          duration: 15
        });

        if (activityRes?.streak?.currentStreak !== undefined) {
          setStreak(activityRes.streak.currentStreak);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course workspace');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentAndAttendance();
  }, [id]);

  // Record attendance whenever lesson changes
  const handleSelectLesson = (idx) => {
    setActiveLessonIndex(idx);
    if (course?.lessons?.[idx]) {
      const lesson = course.lessons[idx];
      attendanceService.recordActivity({
        courseId: course._id,
        lessonId: lesson._id?.toString() || lesson.title,
        activityType: 'lesson_started'
      }).catch((e) => console.error('Error logging lesson activity:', e));
    }
  };

  const handleToggleLessonComplete = async (lessonId) => {
    if (!enrollment) return;

    setUpdating(true);
    const completedList = enrollment.completedLessons || [];
    const isCompleted = completedList.includes(lessonId);

    try {
      const updated = await enrollmentService.updateProgress(enrollment._id, {
        lessonId,
        isCompleted: !isCompleted
      });
      setEnrollment(updated);

      // Record completed lesson activity if marking as done
      if (!isCompleted) {
        const attRes = await attendanceService.recordActivity({
          courseId: course._id,
          lessonId,
          activityType: 'lesson_completed',
          duration: 20
        });
        if (attRes?.streak?.currentStreak !== undefined) {
          setStreak(attRes.streak.currentStreak);
        }
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenAIWithPrompt = (promptText = '') => {
    setAiCustomPrompt(promptText);
    setIsAIAssistantOpen(true);
  };

  if (loading) {
    return <LoadingSpinner message="Opening interactive classroom..." />;
  }

  if (error || !enrollment || !course) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="alert alert-error">{error || 'Course classroom not found'}</div>
        <Link to="/student/dashboard" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Student Dashboard
        </Link>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const currentLesson = lessons[activeLessonIndex] || lessons[0];
  const completedLessons = new Set(enrollment.completedLessons || []);
  const currentLessonId = currentLesson?._id?.toString() || currentLesson?.title;
  const isCurrentLessonDone = completedLessons.has(currentLessonId);

  return (
    <div style={{ padding: '2rem 0 4rem 0' }} className="digital-library-bg">
      <div className="container">
        {/* Top Header Bar */}
        <div style={styles.topHeader}>
          <div>
            <Link to="/student/my-courses" style={styles.backLink}>
              <ArrowLeft size={16} /> Back to My Courses
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.85rem', margin: 0 }}>{course.title}</h1>
              {streak > 0 && (
                <div style={styles.streakIndicator} title={`You have an active ${streak} day learning streak!`}>
                  <Flame size={16} color="#B87333" fill="#B87333" />
                  <span>🔥 {streak} Day Learning Streak</span>
                </div>
              )}
            </div>
            <p style={{ color: '#78716C', fontSize: '0.9rem', marginTop: '0.25rem' }}>Instructor: {course.instructor}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => handleOpenAIWithPrompt('')}
              style={styles.askAiHeaderBtn}
            >
              <Bot size={18} />
              <span>Ask AI Assistant</span>
              <Sparkles size={14} color="#FBBF24" />
            </button>

            <div style={styles.progressSummaryBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                <strong>Course Progress</strong>
                <span className={`badge ${enrollment.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>
                  {enrollment.status}
                </span>
              </div>
              <ProgressBar progress={enrollment.progress} />
            </div>
          </div>
        </div>

        {/* Course Completed Banner */}
        {enrollment.status === 'Completed' && (
          <div className="alert alert-success" style={styles.celebrationBanner}>
            <Award size={28} color="#15803D" />
            <div>
              <strong style={{ fontSize: '1.05rem' }}>Congratulations! Course Completed 🎉</strong>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>
                You have successfully completed all lessons in {course.title}. Great work!
              </p>
            </div>
          </div>
        )}

        {/* Main Workspace Layout (Sidebar + Content View) */}
        <div className="learning-workspace-grid">
          {/* Lessons Sidebar */}
          <div className="card" style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="#3D291F" />
                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Course Modules</h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#78716C', fontWeight: '700' }}>
                {completedLessons.size} / {lessons.length} Done
              </span>
            </div>

            <div style={styles.lessonsList}>
              {lessons.map((lesson, idx) => {
                const lessonId = lesson._id?.toString() || lesson.title;
                const isDone = completedLessons.has(lessonId);
                const isActive = idx === activeLessonIndex;

                return (
                  <div
                    key={idx}
                    style={{
                      ...styles.lessonItem,
                      ...(isActive ? styles.activeLessonItem : {})
                    }}
                    onClick={() => handleSelectLesson(idx)}
                  >
                    <button
                      style={styles.checkBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLessonComplete(lessonId);
                      }}
                      title={isDone ? 'Mark as Incomplete' : 'Mark as Complete'}
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} color="#15803D" />
                      ) : (
                        <Circle size={18} color="#A8A29E" />
                      )}
                    </button>

                    <div style={{ flex: 1 }}>
                      <span style={styles.moduleName}>{lesson.moduleName}</span>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: isActive ? '700' : '600' }}>
                        {lesson.title}
                      </h4>
                    </div>

                    <span style={styles.durationBadge}>{lesson.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Lesson Content Area */}
          <div className="card" style={styles.contentViewer}>
            {currentLesson ? (
              <div>
                <div style={styles.contentHeader}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge badge-primary">
                      {currentLesson.moduleName}
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenAIWithPrompt(`Can you explain "${currentLesson.title}" from our lesson notes in simple terms?`)}
                      style={{ fontSize: '0.82rem', gap: '0.35rem' }}
                    >
                      <Bot size={15} color="#3D291F" /> Ask AI about this lesson
                    </button>
                  </div>
                  <h2>{currentLesson.title}</h2>
                  <span style={{ color: '#78716C', fontSize: '0.85rem' }}>
                    Estimated Duration: {currentLesson.duration || '15 mins'} • Practical Exercises Included
                  </span>
                </div>

                <div style={styles.bodyContent}>
                  <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#334155', whiteSpace: 'pre-line' }}>
                    {currentLesson.content}
                  </p>
                </div>

                {/* Integrated Online Code Compiler */}
                <CodeCompiler
                  course={course}
                  currentLesson={currentLesson}
                  onAskAI={(codeQuestion) => handleOpenAIWithPrompt(codeQuestion)}
                />

                {/* Lesson Navigation Footer */}
                <div style={styles.contentFooter}>
                  <button
                    className={`btn ${isCurrentLessonDone ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleToggleLessonComplete(currentLessonId)}
                    disabled={updating}
                  >
                    {isCurrentLessonDone ? (
                      <>
                        <CheckCircle2 size={18} color="#15803D" /> Completed
                      </>
                    ) : (
                      <>
                        <Circle size={18} /> Mark Lesson Complete
                      </>
                    )}
                  </button>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {activeLessonIndex > 0 && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleSelectLesson(activeLessonIndex - 1)}
                      >
                        <ChevronLeft size={18} /> Previous Lesson
                      </button>
                    )}

                    {activeLessonIndex < lessons.length - 1 && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleSelectLesson(activeLessonIndex + 1)}
                      >
                        Next Lesson <ChevronRight size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#78716C' }}>Select a lesson from the sidebar to start learning.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Learning Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => {
          setIsAIAssistantOpen(false);
          setAiCustomPrompt('');
        }}
        course={course}
        currentLesson={currentLesson}
        initialPrompt={aiCustomPrompt}
      />
    </div>
  );
};

const styles = {
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },
  streakIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: '#FEF3C7',
    border: '1px solid #FDE68A',
    color: '#92400E',
    padding: '0.35rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.82rem',
    fontWeight: '700'
  },
  askAiHeaderBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.15rem',
    fontSize: '0.88rem',
    borderRadius: '10px',
    backgroundColor: '#3D291F',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 2px 8px rgba(61, 41, 31, 0.15)'
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#78716C',
    fontSize: '0.88rem',
    fontWeight: '600'
  },
  progressSummaryBox: {
    backgroundColor: '#FFFFFF',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid #E7E5E4',
    minWidth: '280px'
  },
  celebrationBanner: {
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 1.5rem'
  },
  workspaceGrid: {
    display: 'grid',
    gridTemplateColumns: '340px 1fr',
    gap: '1.75rem',
    alignItems: 'flex-start'
  },
  sidebar: {
    padding: 0,
    overflow: 'hidden'
  },
  sidebarHeader: {
    padding: '1.25rem',
    borderBottom: '1px solid #E7E5E4',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF8F5'
  },
  lessonsList: {
    display: 'flex',
    flexDirection: 'column'
  },
  lessonItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #E7E5E4',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  activeLessonItem: {
    backgroundColor: '#F4ECE6',
    borderLeft: '4px solid #3D291F'
  },
  checkBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '2px'
  },
  moduleName: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#78716C',
    fontWeight: '600'
  },
  durationBadge: {
    fontSize: '0.75rem',
    color: '#A8A29E'
  },
  contentViewer: {
    padding: '2.5rem',
    minHeight: '450px'
  },
  contentHeader: {
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #E7E5E4',
    marginBottom: '1.5rem'
  },
  bodyContent: {
    marginBottom: '2.5rem'
  },
  contentFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #E7E5E4'
  }
};

export default CourseLearning;
