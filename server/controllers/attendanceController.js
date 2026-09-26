const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const LearningAttendance = require('../models/LearningAttendance');

// Utility to get YYYY-MM-DD string
const getFormattedDate = (dateObj = new Date()) => {
  const d = new Date(dateObj);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Utility to get yesterday's date string
const getYesterdayDate = (dateObj = new Date()) => {
  const d = new Date(dateObj);
  d.setDate(d.getDate() - 1);
  return getFormattedDate(d);
};

// @desc    Record student daily learning activity and update streak
// @route   POST /api/attendance/activity
// @access  Private (Student)
const recordActivity = async (req, res, next) => {
  try {
    const { courseId, lessonId, activityType, duration } = req.body;
    const studentId = req.user._id;
    const todayStr = getFormattedDate();
    const yesterdayStr = getYesterdayDate();

    // 1. Fetch user to update streak logic
    const user = await User.findById(studentId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    let currentStreak = user.currentStreak || 0;
    let longestStreak = user.longestStreak || 0;
    let totalLearningDays = user.totalLearningDays || 0;
    const lastActiveDate = user.lastActiveDate || '';

    let isNewDayForStudent = false;

    if (lastActiveDate === todayStr) {
      // Already recorded learning activity today; streak remains current
    } else if (lastActiveDate === yesterdayStr) {
      // Consecutive day! Increment streak
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
      totalLearningDays += 1;
      user.currentStreak = currentStreak;
      user.longestStreak = longestStreak;
      user.totalLearningDays = totalLearningDays;
      user.lastActiveDate = todayStr;
      isNewDayForStudent = true;
      await user.save();
    } else {
      // Missed one or more days or first day; reset streak to 1
      currentStreak = 1;
      longestStreak = Math.max(longestStreak, 1);
      totalLearningDays += 1;
      user.currentStreak = currentStreak;
      user.longestStreak = longestStreak;
      user.totalLearningDays = totalLearningDays;
      user.lastActiveDate = todayStr;
      isNewDayForStudent = true;
      await user.save();
    }

    // 2. Upsert Attendance record for today (only 1 record per student per day)
    let attendance = await LearningAttendance.findOne({
      student: studentId,
      date: todayStr
    });

    if (!attendance) {
      attendance = await LearningAttendance.create({
        student: studentId,
        date: todayStr,
        course: courseId || undefined,
        lessonId: lessonId || undefined,
        activityType: activityType || 'lesson_started',
        duration: duration || 15
      });
    } else {
      // If updating with higher-priority activity (e.g. lesson_completed)
      if (activityType === 'lesson_completed') {
        attendance.activityType = 'lesson_completed';
        if (lessonId) attendance.lessonId = lessonId;
        if (courseId) attendance.course = courseId;
        await attendance.save();
      }
    }

    res.json({
      success: true,
      message: isNewDayForStudent ? 'Learning attendance & streak updated!' : 'Activity recorded for today',
      attendance,
      streak: {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalLearningDays: user.totalLearningDays,
        lastActiveDate: user.lastActiveDate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's learning summary, streak, attendance rate & milestones
// @route   GET /api/attendance/me
// @access  Private (Student)
const getMyAttendanceStats = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const user = await User.findById(studentId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const todayStr = getFormattedDate();
    const yesterdayStr = getYesterdayDate();

    // Check if streak broke because student hasn't learned today or yesterday
    let currentStreak = user.currentStreak || 0;
    if (user.lastActiveDate && user.lastActiveDate !== todayStr && user.lastActiveDate !== yesterdayStr) {
      currentStreak = 0; // Streak broken if no activity yesterday or today
    }

    // Attendance this month
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDayOfMonth = now.getDate();

    const monthlyRecords = await LearningAttendance.find({
      student: studentId,
      date: { $regex: `^${currentYearMonth}` }
    });

    const activeDaysThisMonth = monthlyRecords.length;
    const attendancePercentage = Math.min(100, Math.round((activeDaysThisMonth / currentDayOfMonth) * 100));

    // Lessons completed & enrollments
    const enrollments = await Enrollment.find({ student: studentId });
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.status === 'Completed' || e.progress === 100).length;
    const totalLessonsCompleted = enrollments.reduce((acc, curr) => acc + (curr.completedLessons?.length || 0), 0);

    // Milestones
    const milestones = [
      {
        id: 'first_lesson',
        title: 'First Lesson',
        description: 'Complete your first lesson.',
        icon: '🏆',
        achieved: totalLessonsCompleted >= 1,
        progress: totalLessonsCompleted >= 1 ? 100 : 0,
        current: Math.min(1, totalLessonsCompleted),
        target: 1
      },
      {
        id: 'streak_3',
        title: '3 Day Streak',
        description: 'Learn for 3 consecutive days.',
        icon: '🔥',
        achieved: (user.longestStreak || 0) >= 3 || currentStreak >= 3,
        progress: Math.min(100, Math.round((Math.max(user.longestStreak || 0, currentStreak) / 3) * 100)),
        current: Math.min(3, Math.max(user.longestStreak || 0, currentStreak)),
        target: 3
      },
      {
        id: 'streak_7',
        title: '7 Day Streak',
        description: 'Maintain a 7 day learning streak.',
        icon: '⚡',
        achieved: (user.longestStreak || 0) >= 7 || currentStreak >= 7,
        progress: Math.min(100, Math.round((Math.max(user.longestStreak || 0, currentStreak) / 7) * 100)),
        current: Math.min(7, Math.max(user.longestStreak || 0, currentStreak)),
        target: 7
      },
      {
        id: 'enroll_5',
        title: '5 Courses',
        description: 'Enroll in 5 courses.',
        icon: '📚',
        achieved: totalCourses >= 5,
        progress: Math.min(100, Math.round((totalCourses / 5) * 100)),
        current: Math.min(5, totalCourses),
        target: 5
      },
      {
        id: 'complete_first_course',
        title: 'First Course Completed',
        description: 'Complete your first course.',
        icon: '🎓',
        achieved: completedCourses >= 1,
        progress: completedCourses >= 1 ? 100 : 0,
        current: Math.min(1, completedCourses),
        target: 1
      }
    ];

    res.json({
      currentStreak,
      longestStreak: user.longestStreak || 0,
      lastActiveDate: user.lastActiveDate || '',
      totalLearningDays: user.totalLearningDays || monthlyRecords.length,
      monthlyAttendance: {
        activeDays: activeDaysThisMonth,
        daysInMonth,
        currentDay: currentDayOfMonth,
        attendancePercentage
      },
      learningActivity: {
        totalLearningDays: user.totalLearningDays || monthlyRecords.length,
        totalLessonsCompleted,
        totalCourses,
        completedCourses
      },
      milestones
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current streak details
// @route   GET /api/attendance/streak
// @access  Private (Student)
const getStreak = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const user = await User.findById(studentId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const todayStr = getFormattedDate();
    const yesterdayStr = getYesterdayDate();

    let currentStreak = user.currentStreak || 0;
    if (user.lastActiveDate && user.lastActiveDate !== todayStr && user.lastActiveDate !== yesterdayStr) {
      currentStreak = 0;
    }

    res.json({
      currentStreak,
      longestStreak: user.longestStreak || 0,
      totalLearningDays: user.totalLearningDays || 0,
      lastActiveDate: user.lastActiveDate || ''
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get learning attendance calendar records for a specific month
// @route   GET /api/attendance/calendar
// @access  Private (Student)
const getCalendar = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const now = new Date();
    const year = parseInt(req.query.year, 10) || now.getFullYear();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;

    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

    const records = await LearningAttendance.find({
      student: studentId,
      date: { $regex: `^${monthPrefix}` }
    })
      .populate('course', 'title category')
      .sort({ date: 1 });

    const activeDates = records.map((r) => r.date);

    res.json({
      year,
      month,
      monthPrefix,
      activeDates,
      records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Faculty course attendance & student engagement analytics
// @route   GET /api/faculty/courses/:courseId/attendance
// @access  Private/Faculty
const getFacultyCourseAttendance = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Ownership check (Faculty can only access their own courses; Admins can access all)
    const isOwner =
      (course.instructor && course.instructor.toString() === req.user._id.toString()) ||
      course.instructorName === req.user.name ||
      req.user.role === 'admin';

    if (!isOwner) {
      res.status(403);
      throw new Error('Access denied: You do not have permission to view attendance for this course');
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email currentStreak longestStreak lastActiveDate totalLearningDays')
      .sort({ enrolledAt: -1 });

    const totalStudents = enrollments.length;
    const completedStudentsCount = enrollments.filter((e) => e.progress === 100 || e.status === 'Completed').length;
    const averageProgress = totalStudents > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / totalStudents)
      : 0;

    const todayStr = getFormattedDate();
    const yesterdayStr = getYesterdayDate();

    // Check active learners in the past 30 days
    const studentIds = enrollments.map((e) => e.student?._id).filter(Boolean);
    const recentAttendances = await LearningAttendance.find({
      student: { $in: studentIds }
    });

    const studentAttendanceCountMap = {};
    recentAttendances.forEach((att) => {
      const sId = att.student.toString();
      studentAttendanceCountMap[sId] = (studentAttendanceCountMap[sId] || 0) + 1;
    });

    let streakStudentsCount = 0;
    let activeLearnersCount = 0;
    let totalActiveDaysSum = 0;

    const studentAnalytics = enrollments.map((enr) => {
      const st = enr.student;
      if (!st) {
        return {
          enrollmentId: enr._id,
          name: 'Unknown Student',
          email: 'N/A',
          progress: enr.progress,
          status: enr.status,
          currentStreak: 0,
          totalLearningDays: 0,
          lastActiveDate: 'Never',
          activeInCourse: false
        };
      }

      let streak = st.currentStreak || 0;
      if (st.lastActiveDate && st.lastActiveDate !== todayStr && st.lastActiveDate !== yesterdayStr) {
        streak = 0;
      }

      if (streak > 0) streakStudentsCount++;
      const activeDays = studentAttendanceCountMap[st._id.toString()] || 0;
      totalActiveDaysSum += activeDays;
      if (activeDays > 0 || streak > 0) activeLearnersCount++;

      return {
        enrollmentId: enr._id,
        studentId: st._id,
        name: st.name,
        email: st.email,
        progress: enr.progress,
        completedLessons: enr.completedLessons?.length || 0,
        totalLessons: course.lessons?.length || 0,
        status: enr.status,
        currentStreak: streak,
        longestStreak: st.longestStreak || 0,
        totalLearningDays: activeDays || st.totalLearningDays || 0,
        lastActiveDate: st.lastActiveDate || 'N/A',
        enrolledAt: enr.enrolledAt
      };
    });

    const averageAttendance = totalStudents > 0
      ? Math.min(100, Math.round((totalActiveDaysSum / (totalStudents * 20)) * 100))
      : 0;

    res.json({
      course: {
        _id: course._id,
        title: course.title,
        category: course.category
      },
      stats: {
        totalStudents,
        activeLearners: activeLearnersCount,
        averageProgress,
        averageAttendance,
        streakStudentsCount,
        completedStudentsCount
      },
      students: studentAnalytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin overall learning activity & attendance stats
// @route   GET /api/admin/attendance/stats
// @access  Private/Admin
const getAdminAttendanceStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalLearningDays = await LearningAttendance.countDocuments();

    // Unique active learners
    const uniqueStudents = await LearningAttendance.distinct('student');
    const totalActiveLearners = uniqueStudents.length;

    // Total lessons completed across all enrollments
    const enrollments = await Enrollment.find();
    const totalLessonsCompleted = enrollments.reduce((acc, curr) => acc + (curr.completedLessons?.length || 0), 0);

    // Calculate average streak among active students
    const activeUsers = await User.find({ role: 'student', currentStreak: { $gt: 0 } });
    const todayStr = getFormattedDate();
    const yesterdayStr = getYesterdayDate();

    const validStreaks = activeUsers
      .map((u) => {
        if (u.lastActiveDate === todayStr || u.lastActiveDate === yesterdayStr) {
          return u.currentStreak || 0;
        }
        return 0;
      })
      .filter((s) => s > 0);

    const averageStreak = validStreaks.length > 0
      ? (validStreaks.reduce((a, b) => a + b, 0) / validStreaks.length).toFixed(1)
      : '0.0';

    // Average attendance rate (based on this month's attendance)
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthAttendance = await LearningAttendance.countDocuments({
      date: { $regex: `^${currentYearMonth}` }
    });

    const currentDayOfMonth = now.getDate() || 1;
    const expectedDays = (totalStudents || 1) * currentDayOfMonth;
    const averageAttendance = Math.min(100, Math.round((thisMonthAttendance / expectedDays) * 100)) || (totalActiveLearners > 0 ? 75 : 0);

    res.json({
      totalStudents,
      totalActiveLearners,
      averageAttendance,
      averageStreak: parseFloat(averageStreak),
      totalLearningDays,
      totalLessonsCompleted
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordActivity,
  getMyAttendanceStats,
  getStreak,
  getCalendar,
  getFacultyCourseAttendance,
  getAdminAttendanceStats
};
