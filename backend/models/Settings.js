const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    admissionOpen: { type: Boolean, default: true },
    currentSession: { type: String, default: '2025-2026' },
    collegeDetails: {
      name: { type: String, default: 'Your College Name' },
      address: { type: String, default: '' },
      contact: { type: String, default: '' },
      logo: { type: String, default: '' },
    },
    emailTemplates: {
      applicationSubmitted: {
        subject: { type: String, default: 'Application Received' },
        body: {
          type: String,
          default: 'Dear {{name}}, your application {{applicationId}} has been received.',
        },
      },
      statusChanged: {
        subject: { type: String, default: 'Application Status Updated' },
        body: {
          type: String,
          default: 'Dear {{name}}, your application {{applicationId}} status is now {{status}}.',
        },
      },
    },
  },
  { timestamps: true }
);

// Singleton pattern - only one settings document should exist
module.exports = mongoose.model('Settings', SettingsSchema);
