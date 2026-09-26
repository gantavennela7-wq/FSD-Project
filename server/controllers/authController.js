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
      throw new Error('Please fill in all required fields');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    // Prohibit registering directly as admin
    const userRole = role === 'faculty' ? 'faculty' : 'student';

    // Check duplicate email
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists.');
    }

    // If faculty, optionally check duplicate facultyId if provided
    if (userRole === 'faculty' && facultyId) {
      const idExists = await User.findOne({ facultyId: facultyId.trim() });
      if (idExists) {
        res.status(400);
        throw new Error('Faculty ID is already registered to another faculty member');
      }
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      role: userRole
    };

    if (userRole === 'faculty') {
      userData.facultyId = facultyId || `FAC-${Date.now().toString().slice(-4)}`;
      userData.department = department || '';
      userData.designation = designation || '';
      userData.qualification = qualification || '';
      userData.specialization = specialization || '';
      userData.experience = experience || '';
      userData.phone = phone || '';
      userData.bio = bio || '';
    }

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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

module.exports = { registerUser, loginUser, getMe };
