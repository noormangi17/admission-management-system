const PDFDocument = require('pdfkit');

// Generates an admission form PDF and streams it directly to the HTTP response
const generateApplicationPDF = (application, course, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${application.applicationId}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(18).text('Admission Application Form', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Application ID: ${application.applicationId}`);
  doc.text(`Status: ${application.status.toUpperCase()}`);
  doc.text(`Submitted At: ${new Date(application.submittedAt).toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(14).text('Personal Information', { underline: true });
  doc.fontSize(11);
  const p = application.personalInfo;
  doc.text(`Full Name: ${p.fullName}`);
  doc.text(`Father's Name: ${p.fatherName}`);
  doc.text(`Mother's Name: ${p.motherName}`);
  doc.text(`Date of Birth: ${new Date(p.dob).toLocaleDateString()}`);
  doc.text(`Gender: ${p.gender}`);
  doc.text(`Email: ${p.email}`);
  doc.text(`Phone: ${p.phone}`);
  doc.text(`Address: ${p.address}`);
  doc.moveDown();

  doc.fontSize(14).text('Academic Information', { underline: true });
  doc.fontSize(11);
  const a = application.academicInfo;
  doc.text(`Previous Qualification: ${a.previousQualification}`);
  doc.text(`Percentage: ${a.percentage}%`);
  doc.text(`Passing Year: ${a.passingYear}`);
  doc.text(`Institute Name: ${a.instituteName}`);
  doc.moveDown();

  doc.fontSize(14).text('Course Applied', { underline: true });
  doc.fontSize(11);
  if (course) {
    doc.text(`Course Name: ${course.courseName}`);
    doc.text(`Duration: ${course.duration}`);
    doc.text(`Fee: ${course.fee}`);
  }
  doc.moveDown();

  if (application.remarks) {
    doc.fontSize(14).text('Remarks', { underline: true });
    doc.fontSize(11).text(application.remarks);
  }

  doc.end();
};

module.exports = { generateApplicationPDF };
