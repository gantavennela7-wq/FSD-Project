const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const bcrypt = require('bcryptjs');

// @desc    Get all students with enrollment details
// @route   GET /api/admin/students
// @access  Private/Admin
const getStudents = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { role: 'student' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query).select('-password').sort({ createdAt: -1 });

    const studentsWithDetails = await Promise.all(
      students.map(async (student) => {
        const enrollments = await Enrollment.find({ student: student._id }).populate('course', 'title');
        return {
          ...student.toObject(),
          enrollmentCount: enrollments.length,
          enrolledCourses: enrollments.map((e) => e.course ? e.course.title : 'Deleted Course')
        };
      })
    );

    res.json(studentsWithDetails);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all faculty members with course & student analytics
// @route   GET /api/admin/faculty
// @access  Private/Admin
const getFaculty = async (req, res, next) => {
  try {
    const { search, department } = req.query;
    let query = { role: 'faculty' };

    if (department && department !== 'All') {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { facultyId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }

    const facultyList = await User.find(query).select('-password').sort({ createdAt: -1 });

    const facultyWithMetrics = await Promise.all(
      facultyList.map(async (fac) => {
        const courses = await Course.find({
          $or: [{ instructor: fac._id }, { instructorName: fac.name }]
        });

        const courseIds = courses.map((c) => c._id);
        const enrollments = await Enrollment.find({ course: { $in: courseIds } });

        const uniqueStudentIds = new Set(enrollments.map((e) => e.student.toString()));

        return {
          ...fac.toObject(),
          courseCount: courses.length,
          studentCount: uniqueStudentIds.size,
          enrollmentCount: enrollments.length
        };
      })
    );

    res.json(facultyWithMetrics);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single faculty details with deep academic breakdown
// @route   GET /api/admin/faculty/:id
// @access  Private/Admin
const getFacultyById = async (req, res, next) => {
  try {
    const faculty = await User.findById(req.params.id).select('-password');

    if (!faculty || faculty.role !== 'faculty') {
      res.status(404);
      throw new Error('Faculty member not found');
    }

    // Find all courses by this faculty
    const courses = await Course.find({
      $or: [{ instructor: faculty._id }, { instructorName: faculty.name }]
    }).sort({ createdAt: -1 });

    // Build course-wise enrollment & student progress breakdown
    const courseBreakdown = await Promise.all(
      courses.map(async (course) => {
        const enrollments = await Enrollment.find({ course: course._id })
          .populate('student', 'name email')
          .sort({ enrolledAt: -1 });

        const completedCount = enrollments.filter(
          (e) => e.progress === 100 || e.status === 'Completed'
        ).length;

        const inProgressCount = enrollments.length - completedCount;

        return {
          _id: course._id,
          title: course.title,
          category: course.category,
          level: course.level,
          duration: course.duration,
          lessonsCount: course.lessons ? course.lessons.length : 0,
          enrollmentCount: enrollments.length,
          completedStudents: completedCount,
          inProgressStudents: inProgressCount,
          students: enrollments.map((e) => ({
            studentId: e.student?._id,
            name: e.student?.name || 'Unknown Student',
            email: e.student?.email || 'N/A',
            progress: e.progress,
            status: e.status,
            enrolledAt: e.enrolledAt
          }))
        };
      })
    );

    const totalStudents = new Set(
      courseBreakdown.flatMap((c) => c.students.map((s) => s.studentId?.toString()))
    ).size;

    const totalEnrollments = courseBreakdown.reduce((acc, c) => acc + c.enrollmentCount, 0);

    res.json({
      faculty,
      academic: {
        totalCourses: courses.length,
        totalStudents,
        totalEnrollments,
        courses: courseBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin create new faculty member
// @route   POST /api/admin/faculty
// @access  Private/Admin
const createFaculty = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      facultyId,
      department,
      designation,
      qualification,
      specialization,
      experience,
      phone,
      bio,
      status
    } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email, and password are required');
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      res.status(400);
      throw new Error('Email is already in use');
    }

    const newFaculty = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'faculty',
      facultyId: facultyId ? facultyId.trim() : `FAC-${Date.now().toString().slice(-4)}`,
      department: department ? department.trim() : '',
      designation: designation ? designation.trim() : '',
      qualification: qualification ? qualification.trim() : '',
      specialization: specialization ? specialization.trim() : '',
      experience: experience ? experience.trim() : '',
      phone: phone ? phone.trim() : '',
      bio: bio ? bio.trim() : '',
      status: status || 'Active'
    });

    res.status(201).json(newFaculty);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin update faculty member
// @route   PUT /api/admin/faculty/:id
// @access  Private/Admin
const updateFaculty = async (req, res, next) => {
  try {
    const faculty = await User.findById(req.params.id);

    if (!faculty || faculty.role !== 'faculty') {
      res.status(404);
      throw new Error('Faculty member not found');
    }

    const {
      name,
      email,
      password,
      facultyId,
      department,
      designation,
      qualification,
      specialization,
      experience,
      phone,
      bio,
      status
    } = req.body;

    if (name) faculty.name = name.trim();
    if (email && email.toLowerCase() !== faculty.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        res.status(400);
        throw new Error('Email is already in use by another user');
      }
      faculty.email = email.toLowerCase().trim();
    }
    if (password && password.trim().length >= 6) {
      faculty.password = password;
    }
    if (facultyId !== undefined) faculty.facultyId = facultyId.trim();
    if (department !== undefined) faculty.department = department.trim();
    if (designation !== undefined) faculty.designation = designation.trim();
    if (qualification !== undefined) faculty.qualification = qualification.trim();
    if (specialization !== undefined) faculty.specialization = specialization.trim();
    if (experience !== undefined) faculty.experience = experience.trim();
    if (phone !== undefined) faculty.phone = phone.trim();
    if (bio !== undefined) faculty.bio = bio.trim();
    if (status !== undefined) faculty.status = status;

    const updatedFaculty = await faculty.save();
    res.json(updatedFaculty);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin delete/deactivate faculty member
// @route   DELETE /api/admin/faculty/:id
// @access  Private/Admin
const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await User.findById(req.params.id);

    if (!faculty || faculty.role !== 'faculty') {
      res.status(404);
      throw new Error('Faculty member not found');
    }

    // Check if courses exist for this faculty
    const facultyCourses = await Course.find({ instructor: faculty._id });
    const courseIds = facultyCourses.map((c) => c._id);

    // Delete enrollments for their courses
    await Enrollment.deleteMany({ course: { $in: courseIds } });
    // Delete courses
    await Course.deleteMany({ instructor: faculty._id });
    // Delete user
    await faculty.deleteOne();

    res.json({ message: 'Faculty member and associated courses removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin analytics and statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const completedCourses = await Enrollment.countDocuments({ status: 'Completed' });

    const recentCourses = await Course.find()
      .populate('instructor', 'name email department')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentStudents = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 }).limit(5);
    const recentFaculty = await User.find({ role: 'faculty' }).select('-password').sort({ createdAt: -1 }).limit(5);

    const recentEnrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title category')
      .sort({ enrolledAt: -1 })
      .limit(5);

    res.json({
      totalStudents,
      totalFaculty,
      totalCourses,
      totalEnrollments,
      completedCourses,
      recentCourses,
      recentStudents,
      recentFaculty,
      recentEnrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Students & Faculty) with search and filters
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    let query = { role: { $in: ['student', 'faculty'] } };

    if (role && role !== 'all' && ['student', 'faculty'].includes(role)) {
      query.role = role;
    }

    if (status && status !== 'all' && ['Active', 'Inactive'].includes(status)) {
      query.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
        { studentId: { $regex: term, $options: 'i' } },
        { facultyId: { $regex: term, $options: 'i' } },
        { department: { $regex: term, $options: 'i' } },
        { branch: { $regex: term, $options: 'i' } },
        { designation: { $regex: term, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const userObj = u.toObject();
        if (u.role === 'student') {
          const enrollments = await Enrollment.find({ student: u._id }).populate('course', 'title');
          userObj.enrollmentCount = enrollments.length;
          userObj.enrolledCourses = enrollments.map((e) => (e.course ? e.course.title : 'Course'));
        } else if (u.role === 'faculty') {
          const courses = await Course.find({
            $or: [{ instructor: u._id }, { instructorName: u.name }]
          });
          userObj.courseCount = courses.length;
          userObj.courses = courses.map((c) => c.title);
        }
        return userObj;
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user details by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const userObj = user.toObject();
    if (user.role === 'student') {
      const enrollments = await Enrollment.find({ student: user._id }).populate('course', 'title category progress');
      userObj.enrollments = enrollments;
    } else if (user.role === 'faculty') {
      const courses = await Course.find({
        $or: [{ instructor: user._id }, { instructorName: user.name }]
      });
      userObj.courses = courses;
    }

    res.json(userObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile data by Admin
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const {
      name,
      department,
      branch,
      year,
      semester,
      studentId,
      facultyId,
      designation,
      qualification,
      specialization,
      experience,
      phone,
      bio,
      status
    } = req.body;

    if (name) user.name = name.trim();
    if (department !== undefined) user.department = department.trim();
    if (branch !== undefined) user.branch = branch.trim();
    if (year !== undefined) user.year = year.trim();
    if (semester !== undefined) user.semester = semester.trim();
    if (studentId !== undefined) user.studentId = studentId.trim();
    if (facultyId !== undefined) user.facultyId = facultyId.trim();
    if (designation !== undefined) user.designation = designation.trim();
    if (qualification !== undefined) user.qualification = qualification.trim();
    if (specialization !== undefined) user.specialization = specialization.trim();
    if (experience !== undefined) user.experience = experience.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (status && ['Active', 'Inactive'].includes(status)) {
      user.status = status;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      department: updatedUser.department,
      designation: updatedUser.designation,
      studentId: updatedUser.studentId,
      facultyId: updatedUser.facultyId,
      phone: updatedUser.phone,
      message: 'User profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/inactive status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Do not allow deactivating other admin accounts directly
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Admin accounts cannot be deactivated');
    }

    const { status } = req.body;
    if (status && ['Active', 'Inactive'].includes(status)) {
      user.status = status;
    } else {
      user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      message: `User status changed to ${user.status}`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAdminStats,
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus
};
