import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { enrollmentService, attendanceService, quizService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import AIAssistantModal from '../components/AIAssistantModal';
import CodeCompiler from '../components/CodeCompiler';
import CertificateModal from '../components/CertificateModal';
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
  Code,
  HelpCircle,
  RotateCcw,
  CheckCircle,
  XCircle,
  FileCheck,
  Send,
  Eye
} from 'lucide-react';

const CourseLearning = () => {
  const { id } = useParams(); // courseId or enrollmentId
  const { user } = useAuth();

  const [enrollment, setEnrollment] = useState(null);
  const [course, setCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [streak, setStreak] = useState(0);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Quiz states
  const [quizData, setQuizData] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizError, setQuizError] = useState('');

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

  // Load Quiz Data
  const loadQuiz = async () => {
    if (!course) return;
    setQuizLoading(true);
    setQuizError('');
    try {
      const courseId = course._id || course;
      const res = await quizService.getQuizByCourse(courseId);
      if (res.success) {
        setQuizData(res.quiz);
      }
    } catch (err) {
      setQuizError(err.response?.data?.message || 'Failed to load course quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setIsQuizMode(true);
    setQuizResult(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    if (!quizData) {
      loadQuiz();
    }
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (quizResult) return; // Prevent change after submit
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quizData) return;
    
    // Check if some questions unanswered
    const totalQuestions = quizData.questions?.length || 0;
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(`You have answered ${answeredCount} of ${totalQuestions} questions. Do you want to submit anyway?`);
      if (!confirmSubmit) return;
    }

    setSubmittingQuiz(true);
    try {
      // Build array of answers
      const answersArray = quizData.questions.map((q, idx) => ({
        questionIndex: idx,
        selectedOption: selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1
      }));

      const res = await quizService.submitQuiz(quizData._id, answersArray);
      if (res.success) {
        setQuizResult(res.result);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quiz attempt');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setQuizResult(null);
    setCurrentQuestionIndex(0);
  };

  // Record attendance whenever lesson changes
  const handleSelectLesson = (idx) => {
    setIsQuizMode(false);
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

        {/* Course Completed Celebration Banner */}
        {enrollment.status === 'Completed' && (
          <div className="alert alert-success" style={styles.celebrationBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <Award size={32} color="#15803D" />
              <div>
                <strong style={{ fontSize: '1.1rem' }}>🎉 Congratulations! Course Completed</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.9rem' }}>
                  You have successfully completed <strong>{course.title}</strong> (Progress: 100%).
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.25rem',
                backgroundColor: '#3D291F',
                whiteSpace: 'nowrap'
              }}
            >
              <Award size={18} color="#FBBF24" />
              <span>View Certificate</span>
            </button>
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
                const isActive = !isQuizMode && idx === activeLessonIndex;

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

              {/* 📝 Course Quiz Button Item in Sidebar */}
              <div
                style={{
                  ...styles.lessonItem,
                  ...(isQuizMode ? styles.activeQuizItem : styles.quizItem)
                }}
                onClick={handleStartQuiz}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: isQuizMode ? '#3D291F' : '#F3EFEA',
                  color: isQuizMode ? '#FFF' : '#B87333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <HelpCircle size={16} />
                </div>

                <div style={{ flex: 1 }}>
                  <span style={{ ...styles.moduleName, color: '#B87333', fontWeight: '700' }}>Assessment</span>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: isQuizMode ? '#3D291F' : '#1C1917' }}>
                    📝 Course Quiz
                  </h4>
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: isQuizMode ? '#3D291F' : '#EFEBE4',
                  color: isQuizMode ? '#FFF' : '#3D291F',
                  fontWeight: '600'
                }}>
                  MCQ Test
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Area: Lesson Viewer or Interactive Quiz */}
          <div className="card" style={styles.contentViewer}>
            {isQuizMode ? (
              /* ================= QUIZ INTERACTIVE VIEW ================= */
              <div>
                <div style={styles.contentHeader}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge badge-warning" style={{ backgroundColor: '#FBF4ED', color: '#B87333', border: '1px solid #E7E5E4' }}>
                      Course Quiz & Knowledge Check
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleSelectLesson(activeLessonIndex)}
                      style={{ fontSize: '0.82rem' }}
                    >
                      <BookOpen size={15} /> Back to Lessons
                    </button>
                  </div>
                  <h2>{quizData?.title || `${course.title} Assessment Quiz`}</h2>
                  <p style={{ color: '#78716C', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                    {quizData?.description || 'Test your understanding of the concepts covered in this course.'}
                  </p>
                </div>

                {quizLoading ? (
                  <LoadingSpinner message="Loading quiz questions..." />
                ) : quizError ? (
                  <div className="alert alert-error">{quizError}</div>
                ) : quizResult ? (
                  /* Quiz Completed Result Screen */
                  <div style={styles.resultContainer}>
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      backgroundColor: '#FAF8F5',
                      borderRadius: '12px',
                      border: '1px solid #E7E5E4',
                      marginBottom: '2rem'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        backgroundColor: quizResult.passed ? '#ECFDF5' : '#FEF2F2',
                        border: `2px solid ${quizResult.passed ? '#10B981' : '#EF4444'}`,
                        marginBottom: '1rem'
                      }}>
                        {quizResult.passed ? <Award size={36} color="#059669" /> : <RotateCcw size={32} color="#DC2626" />}
                      </div>

                      <h2 style={{ fontSize: '1.8rem', color: '#3D291F', margin: '0 0 0.5rem 0' }}>
                        🎉 Quiz Completed!
                      </h2>
                      <p style={{ color: '#78716C', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
                        {quizResult.passed ? 'Excellent work! You demonstrated great mastery.' : 'Good effort! Review your answers and try again.'}
                      </p>

                      {/* Stat summary grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '1rem',
                        maxWidth: '600px',
                        margin: '0 auto 1.5rem auto'
                      }}>
                        <div style={styles.resultStatCard}>
                          <span style={styles.resultStatLabel}>Score</span>
                          <span style={styles.resultStatValue}>{quizResult.score} / {quizResult.totalQuestions}</span>
                        </div>
                        <div style={styles.resultStatCard}>
                          <span style={styles.resultStatLabel}>Percentage</span>
                          <span style={{ ...styles.resultStatValue, color: '#B87333' }}>{quizResult.percentage}%</span>
                        </div>
                        <div style={styles.resultStatCard}>
                          <span style={styles.resultStatLabel}>Correct</span>
                          <span style={{ ...styles.resultStatValue, color: '#059669' }}>{quizResult.correctCount}</span>
                        </div>
                        <div style={styles.resultStatCard}>
                          <span style={styles.resultStatLabel}>Incorrect</span>
                          <span style={{ ...styles.resultStatValue, color: '#DC2626' }}>{quizResult.incorrectCount}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={handleRetryQuiz}
                          className="btn btn-secondary"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <RotateCcw size={16} /> Retry Quiz
                        </button>
                        <button
                          onClick={() => handleSelectLesson(activeLessonIndex)}
                          className="btn btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <BookOpen size={16} /> Continue Learning
                        </button>
                        {enrollment.status === 'Completed' && (
                          <button
                            onClick={() => setIsCertModalOpen(true)}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#B87333' }}
                          >
                            <Award size={16} /> View Certificate
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question by question review */}
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#3D291F' }}>Answer Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {quizResult.answers?.map((ans, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '1.25rem',
                            borderRadius: '10px',
                            border: `1px solid ${ans.isCorrect ? '#A7F3D0' : '#FECACA'}`,
                            backgroundColor: ans.isCorrect ? '#F0FDF4' : '#FEF2F2'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                            {ans.isCorrect ? (
                              <CheckCircle size={20} color="#059669" />
                            ) : (
                              <XCircle size={20} color="#DC2626" />
                            )}
                            <h4 style={{ margin: 0, fontSize: '1rem', color: '#1C1917' }}>
                              Question {idx + 1}: {ans.question}
                            </h4>
                          </div>

                          <div style={{ fontSize: '0.88rem', margin: '0.5rem 0 0.5rem 1.75rem' }}>
                            <p style={{ margin: '2px 0', color: ans.isCorrect ? '#065F46' : '#991B1B' }}>
                              <strong>Your Answer:</strong> {ans.options?.[ans.selectedOption] || 'None selected'}
                            </p>
                            {!ans.isCorrect && (
                              <p style={{ margin: '2px 0', color: '#065F46' }}>
                                <strong>Correct Answer:</strong> {ans.options?.[ans.correctAnswer]}
                              </p>
                            )}
                            {ans.explanation && (
                              <p style={{ margin: '6px 0 0 0', color: '#57534E', fontStyle: 'italic', fontSize: '0.82rem' }}>
                                💡 {ans.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : quizData?.questions && quizData.questions.length > 0 ? (
                  /* Active Quiz Questions View */
                  <div>
                    {/* Progress Bar & Counter */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#FAF8F5',
                      borderRadius: '8px',
                      border: '1px solid #E7E5E4'
                    }}>
                      <span style={{ fontWeight: '700', color: '#3D291F', fontSize: '0.95rem' }}>
                        Question {currentQuestionIndex + 1} of {quizData.questions.length}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#78716C' }}>
                        Answered: {Object.keys(selectedAnswers).length} / {quizData.questions.length}
                      </span>
                    </div>

                    {/* Question Card */}
                    {(() => {
                      const q = quizData.questions[currentQuestionIndex];
                      const currentSelected = selectedAnswers[currentQuestionIndex];

                      return (
                        <div style={{
                          padding: '1.75rem',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #E7E5E4',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          marginBottom: '1.5rem'
                        }}>
                          <h3 style={{ fontSize: '1.15rem', color: '#1C1917', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                            {q.question}
                          </h3>

                          {/* Options Radio List */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {q.options.map((opt, optIdx) => {
                              const isSelected = currentSelected === optIdx;
                              return (
                                <div
                                  key={optIdx}
                                  onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '10px',
                                    border: `1.5px solid ${isSelected ? '#B87333' : '#E7E5E4'}`,
                                    backgroundColor: isSelected ? '#FAF5EE' : '#FFFFFF',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                  }}
                                >
                                  <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: `2px solid ${isSelected ? '#B87333' : '#A8A29E'}`,
                                    backgroundColor: isSelected ? '#B87333' : '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    {isSelected && (
                                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                                    )}
                                  </div>
                                  <span style={{
                                    fontSize: '0.95rem',
                                    color: isSelected ? '#3D291F' : '#334155',
                                    fontWeight: isSelected ? '600' : '400'
                                  }}>
                                    {opt}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Quiz Navigation Footer */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid #E7E5E4'
                    }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ChevronLeft size={18} /> Previous
                      </button>

                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {currentQuestionIndex < quizData.questions.length - 1 ? (
                          <button
                            className="btn btn-secondary"
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            Next <ChevronRight size={18} />
                          </button>
                        ) : null}

                        <button
                          className="btn btn-primary"
                          onClick={handleSubmitQuiz}
                          disabled={submittingQuiz}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#3D291F'
                          }}
                        >
                          <Send size={16} /> {submittingQuiz ? 'Grading Quiz...' : 'Submit Quiz'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: '#78716C' }}>No questions found for this course quiz.</p>
                  </div>
                )}
              </div>
            ) : (
              /* ================= LESSON VIEW ================= */
              currentLesson ? (
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

                      {activeLessonIndex < lessons.length - 1 ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSelectLesson(activeLessonIndex + 1)}
                        >
                          Next Lesson <ChevronRight size={18} />
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={handleStartQuiz}
                          style={{ backgroundColor: '#B87333', borderColor: '#B87333' }}
                        >
                          📝 Take Course Quiz <ChevronRight size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#78716C' }}>Select a lesson from the sidebar to start learning.</p>
                </div>
              )
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

      {/* Course Completion Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        studentName={user?.name}
        courseTitle={course?.title}
        completionDate={enrollment?.updatedAt}
        certificateId={enrollment?._id ? `EV-${enrollment._id.toString().slice(-6).toUpperCase()}` : null}
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
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '1.25rem 1.5rem',
    flexWrap: 'wrap'
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
  quizItem: {
    backgroundColor: '#FCFAF7',
    borderTop: '2px solid #E7E5E4'
  },
  activeQuizItem: {
    backgroundColor: '#F4ECE6',
    borderLeft: '4px solid #B87333',
    borderTop: '2px solid #E7E5E4'
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
  },
  resultContainer: {
    marginTop: '0.5rem'
  },
  resultStatCard: {
    backgroundColor: '#FFFFFF',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid #E7E5E4',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  resultStatLabel: {
    fontSize: '0.78rem',
    color: '#78716C',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  resultStatValue: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#1C1917'
  }
};

export default CourseLearning;
