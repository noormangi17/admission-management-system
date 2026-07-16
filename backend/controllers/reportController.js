const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Application = require('../models/Application');

const buildDateQuery = (startDate, endDate) => {
  const query = {};
  if (startDate || endDate) {
    query.submittedAt = {};
    if (startDate) query.submittedAt.$gte = new Date(startDate);
    if (endDate) query.submittedAt.$lte = new Date(endDate);
  }
  return query;
};

// @desc    Summary report (totals + status breakdown)
// @route   GET /api/reports/summary
// @access  Private (superadmin, officer)
exports.getSummaryReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = buildDateQuery(startDate, endDate);

    const [total, pending, underReview, approved, rejected] = await Promise.all([
      Application.countDocuments(query),
      Application.countDocuments({ ...query, status: 'pending' }),
      Application.countDocuments({ ...query, status: 'under_review' }),
      Application.countDocuments({ ...query, status: 'approved' }),
      Application.countDocuments({ ...query, status: 'rejected' }),
    ]);

    res.status(200).json({
      success: true,
      report: { total, pending, underReview, approved, rejected },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Course-wise report
// @route   GET /api/reports/course-wise
// @access  Private (superadmin, officer)
exports.getCourseWiseReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = buildDateQuery(startDate, endDate);

    const report = await Application.aggregate([
      { $match: query },
      {
        $group: {
          _id: { course: '$courseApplied', status: '$status' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id.course',
          foreignField: '_id',
          as: 'courseInfo',
        },
      },
      { $unwind: { path: '$courseInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          courseName: '$courseInfo.courseName',
          status: '$_id.status',
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// @desc    Export applications report as Excel/CSV or PDF
// @route   GET /api/reports/export?format=excel|csv|pdf
// @access  Private (superadmin, officer)
exports.exportReport = async (req, res, next) => {
  try {
    const { format = 'excel', startDate, endDate, status, course } = req.query;
    const query = buildDateQuery(startDate, endDate);
    if (status) query.status = status;
    if (course) query.courseApplied = course;

    const applications = await Application.find(query)
      .populate('courseApplied', 'courseName')
      .sort({ submittedAt: -1 });

    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 40, layout: 'landscape' });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=applications_report.pdf');
      doc.pipe(res);

      doc.fontSize(16).text('Applications Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(9);

      applications.forEach((app) => {
        doc.text(
          `${app.applicationId} | ${app.personalInfo.fullName} | ${app.courseApplied?.courseName || '-'} | ${app.status} | ${new Date(app.submittedAt).toLocaleDateString()}`
        );
      });

      doc.end();
      return;
    }

    // Excel/CSV export
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Applications');

    sheet.columns = [
      { header: 'Application ID', key: 'applicationId', width: 20 },
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Submitted At', key: 'submittedAt', width: 20 },
    ];

    applications.forEach((app) => {
      sheet.addRow({
        applicationId: app.applicationId,
        fullName: app.personalInfo.fullName,
        email: app.personalInfo.email,
        phone: app.personalInfo.phone,
        course: app.courseApplied?.courseName || '-',
        status: app.status,
        submittedAt: new Date(app.submittedAt).toLocaleDateString(),
      });
    });

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=applications_report.csv');
      await workbook.csv.write(res);
      res.end();
    } else {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=applications_report.xlsx');
      await workbook.xlsx.write(res);
      res.end();
    }
  } catch (error) {
    next(error);
  }
};
