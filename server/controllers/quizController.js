const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');
const { getQuizForCourse } = require('../utils/quizSeedData');

// Helper to ensure quiz exists for a given course
const ensureQuizForCourse = async (courseId) => {
  let quiz = await Quiz.findOne({ course: courseId });
  if (!quiz) {
    const course = await Course.findById(courseId);
    if (!course) return null;

    const seedData = getQuizForCourse(course);
    quiz = await Quiz.create({
      course: courseId,
      title: seedData.title,
      description: seedData.description,
      passingPercentage: seedData.passingPercentage,
      questions: seedData.questions
    });
  }
  return quiz;
};

// @desc    Get quiz for a specific course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
const getQuizByCourseId = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const quiz = await ensureQuizForCourse(courseId);
    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not available for this course');
    }

    // Sanitize questions so correct answers are not exposed before submission
    const sanitizedQuestions = quiz.questions.map((q, index) => ({
      index,
      question: q.question,
      options: q.options
    }));

    // Find student's latest attempt if exists
    const latestAttempt = await QuizAttempt.findOne({
      student: req.user._id,
      course: courseId
    }).sort({ attemptedAt: -1 });

    res.json({
      _id: quiz._id,
      courseId: quiz.course,
      courseTitle: course.title,
      title: quiz.title,
      description: quiz.description,
      passingPercentage: quiz.passingPercentage,
      totalQuestions: quiz.questions.length,
      questions: sanitizedQuestions,
      latestAttempt: latestAttempt
        ? {
            score: latestAttempt.score,
            totalQuestions: latestAttempt.totalQuestions,
            percentage: latestAttempt.percentage,
            passed: latestAttempt.passed,
            attemptedAt: latestAttempt.attemptedAt
          }
        : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a quiz attempt
// @route   POST /api/quizzes/course/:courseId/submit
// @access  Private (Student)
const submitQuizAttempt = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body; // Array of selected option indices: [0, 2, 1, ...]

    if (!Array.isArray(answers)) {
      res.status(400);
      throw new Error('Answers must be provided as an array');
    }

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const quiz = await ensureQuizForCourse(courseId);
    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    const questions = quiz.questions;
    let score = 0;
    const detailedAnswers = [];

    questions.forEach((q, idx) => {
      const selectedOption = answers[idx] !== undefined ? Number(answers[idx]) : -1;
      const isCorrect = selectedOption === q.correctAnswer;
      if (isCorrect) score++;

      detailedAnswers.push({
        questionIndex: idx,
        questionText: q.question,
        options: q.options,
        selectedOption,
        correctOption: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || ''
      });
    });

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= quiz.passingPercentage;

    // Save attempt in MongoDB
    const attempt = await QuizAttempt.create({
      student: req.user._id,
      course: courseId,
      quiz: quiz._id,
      score,
      totalQuestions,
      percentage,
      passed,
      answers: detailedAnswers,
      attemptedAt: new Date()
    });

    // Create In-App Notification for Student
    try {
      await Notification.create({
        user: req.user._id,
        title: 'Quiz Completed',
        message: `You completed the ${course.title} Quiz with a score of ${score}/${totalQuestions} (${percentage}%).`,
        type: 'quiz',
        link: `/student/course/${courseId}`
      });
    } catch (notifErr) {
      console.error('Failed to create quiz notification:', notifErr);
    }

    res.status(201).json({
      attemptId: attempt._id,
      score,
      totalQuestions,
      correctCount: score,
      incorrectCount: totalQuestions - score,
      percentage,
      passed,
      passingPercentage: quiz.passingPercentage,
      answers: detailedAnswers,
      attemptedAt: attempt.attemptedAt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's quiz attempts for a course
// @route   GET /api/quizzes/course/:courseId/attempts
// @access  Private
const getQuizAttempts = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const attempts = await QuizAttempt.find({
      student: req.user._id,
      course: courseId
    }).sort({ attemptedAt: -1 });

    res.json(attempts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's overall quiz analytics performance
// @route   GET /api/quizzes/my-performance
// @access  Private
const getMyQuizPerformance = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.user._id })
      .populate('course', 'title thumbnail category')
      .sort({ attemptedAt: -1 });

    // Group by course, keeping highest and latest score
    const courseMap = {};
    attempts.forEach((att) => {
      if (!att.course) return;
      const cId = att.course._id.toString();
      if (!courseMap[cId]) {
        courseMap[cId] = {
          courseId: cId,
          courseTitle: att.course.title,
          category: att.course.category,
          thumbnail: att.course.thumbnail,
          highestPercentage: att.percentage,
          latestPercentage: att.percentage,
          totalAttempts: 1,
          passed: att.passed,
          latestAttemptDate: att.attemptedAt
        };
      } else {
        courseMap[cId].totalAttempts += 1;
        if (att.percentage > courseMap[cId].highestPercentage) {
          courseMap[cId].highestPercentage = att.percentage;
        }
        if (att.passed) {
          courseMap[cId].passed = true;
        }
      }
    });

    const performanceList = Object.values(courseMap);
    const avgPercentage =
      performanceList.length > 0
        ? Math.round(
            performanceList.reduce((acc, curr) => acc + curr.highestPercentage, 0) /
              performanceList.length
          )
        : 0;

    res.json({
      totalQuizzesTaken: attempts.length,
      averagePercentage: avgPercentage,
      coursePerformances: performanceList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuizByCourseId,
  submitQuizAttempt,
  getQuizAttempts,
  getMyQuizPerformance
};
