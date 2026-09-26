const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Helper to provide default structured lessons if none specified
const getDefaultLessons = (title) => [
  {
    title: '1. Course Overview & Introduction',
    moduleName: 'Module 1: Getting Started',
    content: `Welcome to ${title}! In this introductory lesson, we cover the course roadmap, prerequisites, learning objectives, and tools needed to succeed.`,
    duration: '15 mins'
  },
  {
    title: '2. Core Principles & Setup',
    moduleName: 'Module 1: Getting Started',
    content: 'Learn how to set up your environment, configure necessary libraries, and understand key architectural patterns.',
    duration: '25 mins'
  },
  {
    title: '3. Fundamental Concepts & Syntax',
    moduleName: 'Module 2: Core Fundamentals',
    content: 'Deep dive into fundamental concepts, syntax patterns, data structures, and foundational principles.',
    duration: '30 mins'
  },
  {
    title: '4. Advanced Techniques & Best Practices',
    moduleName: 'Module 3: Advanced Topics',
    content: 'Master intermediate and advanced techniques, state management, optimization, and industry standards.',
    duration: '40 mins'
  },
  {
    title: '5. Hands-on Capstone Project',
    moduleName: 'Module 4: Practical Application',
    content: 'Apply everything you have learned by building a real-world capstone project from scratch.',
    duration: '50 mins'
  }
];

// @desc    Get all courses with optional search/filtering
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const { search, category, level } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructorName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email department designation facultyId')
      .sort({ createdAt: -1 });

    // Aggregate enrollment counts for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrolledCount = await Enrollment.countDocuments({ course: course._id });
        const cObj = course.toObject();
        return {
          ...cObj,
          instructor: cObj.instructor?.name || cObj.instructorName || 'Faculty Instructor',
          instructorDetails: cObj.instructor,
          enrolledCount
        };
      })
    );

    res.json(coursesWithStats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email department designation facultyId specialization experience bio');

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const enrolledCount = await Enrollment.countDocuments({ course: course._id });
    const cObj = course.toObject();

    res.json({
      ...cObj,
      instructor: cObj.instructor?.name || cObj.instructorName || 'Faculty Instructor',
      instructorDetails: cObj.instructor,
      enrolledCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res, next) => {
  try {
    const { title, description, instructor, category, level, duration, thumbnail, lessons } = req.body;

    if (!title || !description || !instructor || !category || !duration) {
      res.status(400);
      throw new Error('Please fill in all required course fields');
    }

    const courseLessons = lessons && lessons.length > 0 ? lessons : getDefaultLessons(title);

    const course = await Course.create({
      title,
      description,
      instructor,
      category,
      level: level || 'Beginner',
      duration,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      lessons: courseLessons
    });

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const { title, description, instructor, category, level, duration, thumbnail, lessons } = req.body;

    course.title = title || course.title;
    course.description = description || course.description;
    course.instructor = instructor || course.instructor;
    course.category = category || course.category;
    course.level = level || course.level;
    course.duration = duration || course.duration;
    course.thumbnail = thumbnail || course.thumbnail;
    if (lessons) {
      course.lessons = lessons;
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Remove associated enrollments
    await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
