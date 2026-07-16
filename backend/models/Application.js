const mongoose = require('mongoose');

const StatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      required: true,
    },
    remark: { type: String, default: '' },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ApplicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, unique: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    personalInfo: {
      fullName: { type: String, required: true },
      fatherName: { type: String, required: true },
      motherName: { type: String, required: true },
      dob: { type: Date, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },

    academicInfo: {
      previousQualification: { type: String, required: true },
      percentage: { type: Number, required: true, min: 0, max: 100 },
      passingYear: { type: Number, required: true },
      instituteName: { type: String, required: true },
    },

    courseApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    documents: {
      profilePhoto: { type: String, default: '' },
      marksheet10: { type: String, default: '' },
      marksheet12: { type: String, default: '' },
      idProof: { type: String, default: '' },
    },

    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
    remarks: { type: String, default: '' },
    statusHistory: [StatusHistorySchema],

    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate applicationId like ADM-2024-0001
ApplicationSchema.pre('save', async function (next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Application').countDocuments({
      applicationId: { $regex: `^ADM-${year}-` },
    });
    this.applicationId = `ADM-${year}-${String(count + 1).padStart(4, '0')}`;
    this.statusHistory.push({ status: 'pending', remark: 'Application submitted' });
  }
  next();
});

module.exports = mongoose.model('Application', ApplicationSchema);
