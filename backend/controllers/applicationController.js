const Application = require('../models/Application');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');
const sendEmail = require('../utils/sendEmail');
const { generateApplicationPDF } = require('../utils/generatePDF');

const filePath = (file) => (file ? `/${file.path.replace(/\\/g, '/')}` : '');

// @desc    Submit new application
// @route   POST /api/applications
// @access  Private (student)
exports.createApplication = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    if (settings && settings.admissionOpen === false) {
      return res.status(403).json({ success: false, message: 'Admissions are currently closed' });
    }

    const {
      fullName, fatherName, motherName, dob, gender, email, phone, address,
      previousQualification, percentage, passingYear, instituteName, courseApplied,
    } = req.body;

    const course = await Course.findById(courseApplied);
    if (!course || !course.isActive) {
      return res.status(400).json({ success: false, message: 'Selected course is not available' });
    }
    if (course.availableSeats <= 0) {
      return res.status(400).json({ success: false, message: 'No seats available in this course' });
    }

    const files = req.files || {};

    const application = await Application.create({
      studentId: req.user._id,
      personalInfo: { fullName, fatherName, motherName, dob, gender, email, phone, address },
      academicInfo: { previousQualification, percentage, passingYear, instituteName },
      courseApplied,
      documents: {
        profilePhoto: filePath(files.profilePhoto?.[0]),
        marksheet10: filePath(files.marksheet10?.[0]),
        marksheet12: filePath(files.marksheet12?.[0]),
        idProof: filePath(files.idProof?.[0]),
      },
    });

    // Notify admin panel (create notifications for superadmin/officer would need a query;
    // here we notify the student and log the submission)
    await Notification.create({
      userId: req.user._id,
      message: `Your application ${application.applicationId} has been submitted successfully.`,
      type: 'application_submitted',
    });

    sendEmail({
      to: email,
      subject: 'Application Received',
      text: `Dear ${fullName}, your application ${application.applicationId} has been received and is pending review.`,
    }).catch((e) => console.error('Email error:', e.message));

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (admin/officer) with search, filter, pagination
// @route   GET /api/applications
// @access  Private (superadmin, officer)
exports.getApplications = async (req, res, next) => {
  try {
    const {
      search, status, course, startDate, endDate, page = 1, limit = 10,
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (course) query.courseApplied = course;

    if (startDate || endDate) {
      query.submittedAt = {};
      if (startDate) query.submittedAt.$gte = new Date(startDate);
      if (endDate) query.submittedAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { applicationId: { $regex: search, $options: 'i' } },
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('courseApplied', 'courseName')
        .populate('studentId', 'name email')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      applications,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('courseApplied')
      .populate('studentId', 'name email phone')
      .populate('statusHistory.changedBy', 'name role');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Students can only view their own application
    if (req.user.role === 'student' && application.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this application' });
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in student's own applications
// @route   GET /api/applications/my
// @access  Private (student)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('courseApplied', 'courseName fee duration')
      .sort({ submittedAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (admin/officer)
// @route   PUT /api/applications/:id/status
// @access  Private (superadmin, officer)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remark } = req.body;
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('courseApplied');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const previousStatus = application.status;
    application.status = status;
    if (remark) application.remarks = remark;
    application.statusHistory.push({ status, remark: remark || '', changedBy: req.user._id });

    // If newly approved, decrement available seats
    if (status === 'approved' && previousStatus !== 'approved' && application.courseApplied) {
      const course = await Course.findById(application.courseApplied._id);
      if (course && course.availableSeats > 0) {
        course.availableSeats -= 1;
        await course.save();
      }
    }

    await application.save();

    await Notification.create({
      userId: application.studentId,
      message: `Your application ${application.applicationId} status changed to ${status.replace('_', ' ')}.`,
      type: 'status_change',
    });

    sendEmail({
      to: application.personalInfo.email,
      subject: 'Application Status Updated',
      text: `Dear ${application.personalInfo.fullName}, your application ${application.applicationId} status is now: ${status}. ${remark ? 'Remark: ' + remark : ''}`,
    }).catch((e) => console.error('Email error:', e.message));

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit application (student, only if status pending)
// @route   PUT /api/applications/:id
// @access  Private (student - own application)
exports.updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this application' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application can only be edited while status is pending',
      });
    }

    const {
      fullName, fatherName, motherName, dob, gender, email, phone, address,
      previousQualification, percentage, passingYear, instituteName,
    } = req.body;

    if (fullName) application.personalInfo.fullName = fullName;
    if (fatherName) application.personalInfo.fatherName = fatherName;
    if (motherName) application.personalInfo.motherName = motherName;
    if (dob) application.personalInfo.dob = dob;
    if (gender) application.personalInfo.gender = gender;
    if (email) application.personalInfo.email = email;
    if (phone) application.personalInfo.phone = phone;
    if (address) application.personalInfo.address = address;

    if (previousQualification) application.academicInfo.previousQualification = previousQualification;
    if (percentage) application.academicInfo.percentage = percentage;
    if (passingYear) application.academicInfo.passingYear = passingYear;
    if (instituteName) application.academicInfo.instituteName = instituteName;

    const files = req.files || {};
    if (files.profilePhoto) application.documents.profilePhoto = filePath(files.profilePhoto[0]);
    if (files.marksheet10) application.documents.marksheet10 = filePath(files.marksheet10[0]);
    if (files.marksheet12) application.documents.marksheet12 = filePath(files.marksheet12[0]);
    if (files.idProof) application.documents.idProof = filePath(files.idProof[0]);

    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Dashboard stats (counts, course-wise, recent, today)
// @route   GET /api/applications/stats
// @access  Private (superadmin, officer)
exports.getApplicationStats = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [total, pending, approved, rejected, underReview, todayCount, courseWise, recent] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' }),
      Application.countDocuments({ status: 'under_review' }),
      Application.countDocuments({ submittedAt: { $gte: startOfToday } }),
      Application.aggregate([
        {
          $group: {
            _id: '$courseApplied',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'courses',
            localField: '_id',
            foreignField: '_id',
            as: 'course',
          },
        },
        { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            courseName: '$course.courseName',
            count: 1,
          },
        },
      ]),
      Application.find().sort({ submittedAt: -1 }).limit(5).populate('courseApplied', 'courseName'),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        rejected,
        underReview,
        todayCount,
        courseWise,
        recent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download application as PDF
// @route   GET /api/applications/:id/pdf
// @access  Private
exports.downloadApplicationPDF = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('courseApplied');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (req.user.role === 'student' && application.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    generateApplicationPDF(application, application.courseApplied, res);
  } catch (error) {
    next(error);
  }
};
