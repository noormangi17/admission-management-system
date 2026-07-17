const Course = require("../models/Course");
const User = require("../models/User");
const Application = require("../models/Application");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalCourses = await Course.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalOfficers = await User.countDocuments({
      role: "officer",
    });

    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalOfficers,
        totalApplications,
      },
    });
  } catch (err) {
    next(err);
  }
};