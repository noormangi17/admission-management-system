const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true, trim: true },
    duration: { type: String, required: true },
    totalSeats: { type: Number, required: true, min: 0 },
    availableSeats: { type: Number, required: true, min: 0 },
    eligibility: { type: String, required: true },
    fee: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
