const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll student in a course
// @route   POST /api/enrollments
// @access  Private (Student)
const createEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      res.status(400);
      throw new Error('Course ID is required');
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (existingEnrollment) {
      res.status(400);
      throw new Error('You are already enrolled in this course');
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      progress: 0,
      completedLessons: [],
      status: 'In Progress',
      enrolledAt: new Date()
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id).populate('course');

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment: populatedEnrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's enrollments
// @route   GET /api/enrollments/my
// @access  Private (Student)
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course')
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enrollment by ID or course ID
// @route   GET /api/enrollments/:id
// @access  Private (Student)
const getEnrollmentById = async (req, res, next) => {
  try {
    let enrollment = await Enrollment.findById(req.params.id).populate('course');

    // Fallback: search by course ID for logged in user if not found by enrollment ID
    if (!enrollment) {
      enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.params.id
      }).populate('course');
    }

    if (!enrollment) {
      res.status(404);
      throw new Error('Enrollment not found');
    }

    // Verify user owns this enrollment or is admin
    if (enrollment.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to access this enrollment');
    }

    res.json(enrollment);
  } catch (error) {
    next(error);
  }
};

// @desc    Update enrollment lesson progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private (Student)
const updateProgress = async (req, res, next) => {
  try {
    const { lessonId, isCompleted } = req.body;

    let enrollment = await Enrollment.findById(req.params.id).populate('course');

    // Fallback search by course ID
    if (!enrollment) {
      enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.params.id
      }).populate('course');
    }

    if (!enrollment) {
      res.status(404);
      throw new Error('Enrollment record not found');
    }

    if (enrollment.student.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this enrollment');
    }

    const course = enrollment.course;
    const totalLessons = course.lessons ? course.lessons.length : 1;

    let completedList = [...(enrollment.completedLessons || [])];

    if (isCompleted) {
      if (!completedList.includes(lessonId)) {
        completedList.push(lessonId);
      }
    } else {
      completedList = completedList.filter((id) => id !== lessonId);
    }

    const progressPercentage = Math.min(
      100,
      Math.round((completedList.length / totalLessons) * 100)
    );

    enrollment.completedLessons = completedList;
    enrollment.progress = progressPercentage;
    enrollment.status = progressPercentage === 100 ? 'Completed' : 'In Progress';

    const updatedEnrollment = await enrollment.save();

    res.json(updatedEnrollment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnrollment,
  getMyEnrollments,
  getEnrollmentById,
  updateProgress
};
