const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'super_secret_lms_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Register new user (Student by default)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      studentId,
      branch,
      year,
      semester,
      yearSemester,
      facultyId,
      department,
      designation,
      qualification,
      specialization,
      experience,
      phone,
      bio
    } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields (name, email, password)');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    // Prohibit registering directly as admin
    const userRole = role === 'faculty' ? 'faculty' : 'student';

    // Check duplicate email
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists.');
    }

    // If student, check duplicate studentId if provided
    if (userRole === 'student' && studentId && studentId.trim()) {
      const studentIdExists = await User.findOne({ studentId: studentId.trim() });
      if (studentIdExists) {
        res.status(400);
        throw new Error('Student ID is already registered to another student.');
      }
    }

    // If faculty, optionally check duplicate facultyId if provided
    if (userRole === 'faculty' && facultyId && facultyId.trim()) {
      const idExists = await User.findOne({ facultyId: facultyId.trim() });
      if (idExists) {
        res.status(400);
        throw new Error('Faculty ID is already registered to another faculty member.');
      }
    }

    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole
    };

    if (userRole === 'student') {
      userData.studentId = studentId && studentId.trim() ? studentId.trim() : `STU-${Date.now().toString().slice(-4)}`;
      userData.department = department ? department.trim() : '';
      userData.branch = branch ? branch.trim() : '';
      userData.year = year ? year.trim() : '';
      userData.semester = semester ? semester.trim() : '';
      userData.yearSemester = yearSemester || (year && semester ? `${year} / Sem ${semester}` : year || semester || '');
      userData.phone = phone ? phone.trim() : '';
    } else if (userRole === 'faculty') {
      userData.facultyId = facultyId && facultyId.trim() ? facultyId.trim() : `FAC-${Date.now().toString().slice(-4)}`;
      userData.department = department ? department.trim() : '';
      userData.designation = designation ? designation.trim() : '';
      userData.qualification = qualification ? qualification.trim() : '';
      userData.specialization = specialization ? specialization.trim() : '';
      userData.experience = experience ? experience.trim() : '';
      userData.phone = phone ? phone.trim() : '';
      userData.bio = bio ? bio.trim() : '';
    }

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        branch: user.branch,
        year: user.year,
        semester: user.semester,
        yearSemester: user.yearSemester,
        facultyId: user.facultyId,
        department: user.department,
        designation: user.designation,
        qualification: user.qualification,
        specialization: user.specialization,
        experience: user.experience,
        phone: user.phone,
        bio: user.bio,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'Inactive') {
        res.status(403);
        throw new Error('Your account has been deactivated. Please contact the administrator.');
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot / Reset password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword, password } = req.body;
    const targetPassword = newPassword || password;

    if (!email || !targetPassword) {
      res.status(400);
      throw new Error('Please enter your email and new password.');
    }

    if (confirmPassword && targetPassword !== confirmPassword) {
      res.status(400);
      throw new Error('New password and confirm password do not match.');
    }

    if (targetPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters.');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(404);
      throw new Error('User with this email was not found.');
    }

    user.password = targetPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully. Please login with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password for authenticated user
// @route   POST /api/auth/update-password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('Please enter both current and new password.');
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      res.status(400);
      throw new Error('New password and confirm password do not match.');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters.');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found.');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(400);
      throw new Error('Current password is incorrect.');
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, forgotPassword, updatePassword };
