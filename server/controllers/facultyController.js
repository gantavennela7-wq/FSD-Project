const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get logged in faculty profile
// @route   GET /api/faculty/profile
// @access  Private/Faculty
const getFacultyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('Faculty profile not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged in faculty profile (cannot change role)
// @route   PUT /api/faculty/profile
// @access  Private/Faculty
const updateFacultyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('Faculty profile not found');
    }

    const {
      name,
      facultyId,
      department,
      designation,
      qualification,
      specialization,
      experience,
      phone,
      bio,
      profilePhoto
    } = req.body;

    if (name) user.name = name.trim();
    if (facultyId !== undefined) user.facultyId = facultyId.trim();
    if (department !== undefined) user.department = department.trim();
    if (designation !== undefined) user.designation = designation.trim();
    if (qualification !== undefined) user.qualification = qualification.trim();
    if (specialization !== undefined) user.specialization = specialization.trim();
    if (experience !== undefined) user.experience = experience.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto.trim();

    // Ensure role is never changed here
    user.role = 'faculty';

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty dashboard stats & recent activities
// @route   GET /api/faculty/dashboard
// @access  Private/Faculty
const getFacultyDashboard = async (req, res, next) => {
  try {
    const facultyId = req.user._id;

    // Get all courses created/assigned to this faculty
    const courses = await Course.find({
      $or: [{ instructor: facultyId }, { instructorName: req.user.name }]
    }).sort({ createdAt: -1 });

    const courseIds = courses.map((c) => c._id);

    // Total counts
    const totalCourses = courses.length;

    // Enrollments in these courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'name email')
      .populate('course', 'title category duration')
      .sort({ enrolledAt: -1 });

    const totalEnrollments = enrollments.length;

    // Unique students
    const uniqueStudentIds = new Set();
    let completedStudents = 0;

    enrollments.forEach((e) => {
      if (e.student) {
        uniqueStudentIds.add(e.student._id.toString());
      }
      if (e.status === 'Completed' || e.progress === 100) {
        completedStudents++;
      }
    });

    const totalStudents = uniqueStudentIds.size;

    // Recent courses (top 5)
    const myCourses = courses.slice(0, 5);

    // Recent enrollments (top 5)
    const recentEnrollments = enrollments.slice(0, 5);

    // Recent students (unique recent enrolled students)
    const recentStudentsMap = new Map();
    enrollments.forEach((enr) => {
      if (enr.student && !recentStudentsMap.has(enr.student._id.toString())) {
        recentStudentsMap.set(enr.student._id.toString(), {
          _id: enr.student._id,
          name: enr.student.name,
          email: enr.student.email,
          enrolledCourse: enr.course ? enr.course.title : 'Course',
          enrolledAt: enr.enrolledAt
        });
      }
    });
    const recentStudents = Array.from(recentStudentsMap.values()).slice(0, 5);

    res.json({
      totalCourses,
      totalStudents,
      totalEnrollments,
      completedStudents,
      myCourses,
      recentEnrollments,
      recentStudents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses owned by logged-in faculty
// @route   GET /api/faculty/courses
// @access  Private/Faculty
const getFacultyCourses = async (req, res, next) => {
  try {
    const facultyId = req.user._id;
    const courses = await Course.find({
      $or: [{ instructor: facultyId }, { instructorName: req.user.name }]
    }).sort({ createdAt: -1 });

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrolledCount = await Enrollment.countDocuments({ course: course._id });
        return {
          ...course.toObject(),
          enrolledCount,
          instructor: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            department: req.user.department
          }
        };
      })
    );

    res.json(coursesWithStats);
  } catch (error) {
    next(error);
  }
};

// @desc    Create course assigned to logged-in faculty
// @route   POST /api/faculty/courses
// @access  Private/Faculty
const createFacultyCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      level,
      duration,
      thumbnail,
      prerequisites,
      learningObjectives,
      lessons
    } = req.body;

    if (!title || !description || !category || !duration) {
      res.status(400);
      throw new Error('Please fill in all required course fields');
    }

    const defaultLessons = [
      {
        title: '1. Course Overview & Introduction',
        moduleName: 'Module 1: Getting Started',
        content: `Welcome to ${title}! In this introductory lesson, we outline prerequisites, syllabus, and learning goals.`,
        description: `Welcome to ${title}!`,
        duration: '15 mins',
        order: 1
      },
      {
        title: '2. Core Principles & Setup',
        moduleName: 'Module 1: Getting Started',
        content: 'Setup your development environment and master foundational concepts.',
        description: 'Environment and setup essentials.',
        duration: '25 mins',
        order: 2
      },
      {
        title: '3. Fundamental Concepts & Architecture',
        moduleName: 'Module 2: Core Concepts',
        content: 'Deep dive into fundamental concepts and key design patterns.',
        description: 'Deep dive into fundamental concepts.',
        duration: '35 mins',
        order: 3
      }
    ];

    const courseLessons = lessons && lessons.length > 0 ? lessons : defaultLessons;

    const course = await Course.create({
      title,
      description,
      category,
      level: level || 'Beginner',
      duration,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      instructor: req.user._id,
      instructorName: req.user.name,
      prerequisites: prerequisites || '',
      learningObjectives: learningObjectives || '',
      lessons: courseLessons
    });

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single faculty course details with enrolled students & progress
// @route   GET /api/faculty/courses/:id
// @access  Private/Faculty
const getFacultyCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Ownership verification
    const isOwner =
      (course.instructor && course.instructor.toString() === req.user._id.toString()) ||
      course.instructorName === req.user.name;

    if (!isOwner) {
      res.status(403);
      throw new Error('Access denied: You do not have permission to view or manage this course');
    }

    const enrollments = await Enrollment.find({ course: course._id })
      .populate('student', 'name email phone createdAt')
      .sort({ enrolledAt: -1 });

    const enrolledStudents = enrollments.map((e) => ({
      enrollmentId: e._id,
      studentId: e.student?._id,
      name: e.student?.name || 'Unknown Student',
      email: e.student?.email || 'N/A',
      phone: e.student?.phone || 'N/A',
      enrolledAt: e.enrolledAt,
      progress: e.progress,
      completedLessonsCount: e.completedLessons?.length || 0,
      totalLessonsCount: course.lessons?.length || 0,
      status: e.status
    }));

    res.json({
      ...course.toObject(),
      enrolledCount: enrolledStudents.length,
      enrolledStudents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course owned by logged-in faculty
// @route   PUT /api/faculty/courses/:id
// @access  Private/Faculty
const updateFacultyCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Ownership verification
    const isOwner =
      (course.instructor && course.instructor.toString() === req.user._id.toString()) ||
      course.instructorName === req.user.name;

    if (!isOwner) {
      res.status(403);
      throw new Error('Access denied: You cannot edit a course that does not belong to you');
    }

    const {
      title,
      description,
      category,
      level,
      duration,
      thumbnail,
      prerequisites,
      learningObjectives,
      lessons
    } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (duration) course.duration = duration;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (prerequisites !== undefined) course.prerequisites = prerequisites;
    if (learningObjectives !== undefined) course.learningObjectives = learningObjectives;
    if (lessons) course.lessons = lessons;

    // Ensure instructor remains the logged in faculty
    course.instructor = req.user._id;
    course.instructorName = req.user.name;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course owned by logged-in faculty
// @route   DELETE /api/faculty/courses/:id
// @access  Private/Faculty
const deleteFacultyCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Ownership verification
    const isOwner =
      (course.instructor && course.instructor.toString() === req.user._id.toString()) ||
      course.instructorName === req.user.name;

    if (!isOwner) {
      res.status(403);
      throw new Error('Access denied: You cannot delete a course that does not belong to you');
    }

    // Clean up associated enrollments
    await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();

    res.json({ message: 'Course and its enrollments deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students enrolled in any course owned by logged-in faculty
// @route   GET /api/faculty/students
// @access  Private/Faculty
const getFacultyStudents = async (req, res, next) => {
  try {
    const facultyId = req.user._id;

    // Find all faculty courses
    const facultyCourses = await Course.find({
      $or: [{ instructor: facultyId }, { instructorName: req.user.name }]
    });

    const courseIds = facultyCourses.map((c) => c._id);

    const { courseId, search } = req.query;
    let filter = { course: { $in: courseIds } };

    if (courseId && courseId !== 'All') {
      filter.course = courseId;
    }

    const enrollments = await Enrollment.find(filter)
      .populate('student', 'name email phone createdAt')
      .populate('course', 'title category lessons duration')
      .sort({ enrolledAt: -1 });

    let studentList = enrollments.map((enr) => {
      const courseLessonsCount = enr.course?.lessons ? enr.course.lessons.length : 1;
      const completedCount = enr.completedLessons ? enr.completedLessons.length : 0;
      let computedStatus = 'Not Started';
      if (enr.progress === 100 || enr.status === 'Completed') {
        computedStatus = 'Completed';
      } else if (enr.progress > 0 || completedCount > 0) {
        computedStatus = 'In Progress';
      }

      return {
        enrollmentId: enr._id,
        studentId: enr.student?._id,
        name: enr.student?.name || 'Unknown Student',
        email: enr.student?.email || 'N/A',
        phone: enr.student?.phone || 'N/A',
        courseId: enr.course?._id,
        courseTitle: enr.course?.title || 'Unknown Course',
        category: enr.course?.category || 'General',
        enrolledAt: enr.enrolledAt,
        progress: enr.progress,
        completedLessons: completedCount,
        totalLessons: courseLessonsCount,
        status: computedStatus
      };
    });

    if (search) {
      const s = search.toLowerCase();
      studentList = studentList.filter(
        (st) =>
          st.name.toLowerCase().includes(s) ||
          st.email.toLowerCase().includes(s) ||
          st.courseTitle.toLowerCase().includes(s)
      );
    }

    res.json(studentList);
  } catch (error) {
    next(error);
  }
};

// @desc    Get students enrolled in a specific faculty course
// @route   GET /api/faculty/courses/:courseId/students
// @access  Private/Faculty
const getFacultyCourseStudents = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const isOwner =
      (course.instructor && course.instructor.toString() === req.user._id.toString()) ||
      course.instructorName === req.user.name;

    if (!isOwner) {
      res.status(403);
      throw new Error('Access denied: You can only view students for your own courses');
    }

    const enrollments = await Enrollment.find({ course: course._id })
      .populate('student', 'name email phone createdAt')
      .sort({ enrolledAt: -1 });

    const totalLessons = course.lessons ? course.lessons.length : 1;

    const list = enrollments.map((enr) => {
      const completedCount = enr.completedLessons ? enr.completedLessons.length : 0;
      let computedStatus = 'Not Started';
      if (enr.progress === 100 || enr.status === 'Completed') {
        computedStatus = 'Completed';
      } else if (enr.progress > 0 || completedCount > 0) {
        computedStatus = 'In Progress';
      }

      return {
        enrollmentId: enr._id,
        studentId: enr.student?._id,
        name: enr.student?.name || 'Unknown Student',
        email: enr.student?.email || 'N/A',
        phone: enr.student?.phone || 'N/A',
        enrolledAt: enr.enrolledAt,
        progress: enr.progress,
        completedLessons: completedCount,
        totalLessons,
        status: computedStatus
      };
    });

    res.json(list);
  } catch (error) {
    next(error);
  }
};

// @desc    Get student learning progress for a specific course
// @route   GET /api/faculty/courses/:courseId/progress
// @access  Private/Faculty
const getFacultyCourseProgress = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const isOwner =
      (course.instructor && course.instructor.toString() === req.user._id.toString()) ||
      course.instructorName === req.user.name;

    if (!isOwner) {
      res.status(403);
      throw new Error('Access denied: You can only view progress for your own courses');
    }

    const enrollments = await Enrollment.find({ course: course._id })
      .populate('student', 'name email')
      .sort({ progress: -1 });

    const totalLessons = course.lessons ? course.lessons.length : 1;

    const progressData = enrollments.map((enr) => {
      const completedCount = enr.completedLessons ? enr.completedLessons.length : 0;
      let status = 'Not Started';
      if (enr.progress === 100 || enr.status === 'Completed') {
        status = 'Completed';
      } else if (enr.progress > 0 || completedCount > 0) {
        status = 'In Progress';
      }

      return {
        enrollmentId: enr._id,
        studentId: enr.student?._id,
        studentName: enr.student?.name || 'Unknown Student',
        email: enr.student?.email || 'N/A',
        courseTitle: course.title,
        completedLessons: completedCount,
        totalLessons,
        progressPercentage: enr.progress,
        status,
        enrolledAt: enr.enrolledAt
      };
    });

    res.json({
      courseId: course._id,
      courseTitle: course.title,
      totalStudents: progressData.length,
      progress: progressData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add lesson to a course owned by faculty
// @route   POST /api/faculty/courses/:id/lessons
// @access  Private/Faculty
const addFacultyLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const isOwner =
      (course.instructor && course.instructor.toString() === req.user._id.toString()) ||
      course.instructorName === req.user.name;

    if (!isOwner) {
      res.status(403);
      throw new Error('Access denied: You can only add lessons to your own courses');
    }

    const { title, moduleName, content, description, videoUrl, duration, order } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Lesson title is required');
    }

    const newLesson = {
      title,
      moduleName: moduleName || 'Module 1: General',
      content: content || description || '',
      description: description || content || '',
      videoUrl: videoUrl || '',
      duration: duration || '15 mins',
      order: order !== undefined ? order : (course.lessons?.length || 0) + 1
    };

    course.lessons.push(newLesson);
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson in a course owned by faculty
// @route   PUT /api/faculty/courses/:id/lessons/:lessonId
// @access  Private/Faculty
const updateFacultyLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const isOwner =
      (course.instructor && course.instructor.toString() === req.user._id.toString()) ||
      course.instructorName === req.user.name;

    if (!isOwner) {
      res.status(403);
      throw new Error('Access denied: You can only edit lessons for your own courses');
    }

    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) {
      res.status(404);
      throw new Error('Lesson not found');
    }

    const { title, moduleName, content, description, videoUrl, duration, order } = req.body;

    if (title) lesson.title = title;
    if (moduleName) lesson.moduleName = moduleName;
    if (content !== undefined) lesson.content = content;
    if (description !== undefined) lesson.description = description;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (duration) lesson.duration = duration;
    if (order !== undefined) lesson.order = order;

    await course.save();
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson from a course owned by faculty
// @route   DELETE /api/faculty/courses/:id/lessons/:lessonId
// @access  Private/Faculty
const deleteFacultyLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const isOwner =
      (course.instructor && course.instructor.toString() === req.user._id.toString()) ||
      course.instructorName === req.user.name;

    if (!isOwner) {
      res.status(403);
      throw new Error('Access denied: You can only delete lessons from your own courses');
    }

    course.lessons.pull(req.params.lessonId);
    await course.save();

    res.json({ message: 'Lesson deleted successfully', course });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFacultyProfile,
  updateFacultyProfile,
  getFacultyDashboard,
  getFacultyCourses,
  createFacultyCourse,
  getFacultyCourseById,
  updateFacultyCourse,
  deleteFacultyCourse,
  getFacultyStudents,
  getFacultyCourseStudents,
  getFacultyCourseProgress,
  addFacultyLesson,
  updateFacultyLesson,
  deleteFacultyLesson
};
