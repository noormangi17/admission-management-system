const Course = require('../models/Course');

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (superadmin)
exports.createCourse = async (req, res, next) => {
  try {
    const { courseName, duration, totalSeats, eligibility, fee, description } = req.body;

    const course = await Course.create({
      courseName,
      duration,
      totalSeats,
      availableSeats: totalSeats,
      eligibility,
      fee,
      description,
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const { activeOnly } = req.query;
    const query = activeOnly === 'true' ? { isActive: true } : {};
    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (superadmin)
exports.updateCourse = async (req, res, next) => {
  try {
    const { courseName, duration, totalSeats, availableSeats, eligibility, fee, description, isActive } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (courseName !== undefined) course.courseName = courseName;
    if (duration !== undefined) course.duration = duration;
    if (totalSeats !== undefined) course.totalSeats = totalSeats;
    if (availableSeats !== undefined) course.availableSeats = availableSeats;
    if (eligibility !== undefined) course.eligibility = eligibility;
    if (fee !== undefined) course.fee = fee;
    if (description !== undefined) course.description = description;
    if (isActive !== undefined) course.isActive = isActive;

    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (superadmin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    await course.deleteOne();
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};
