const Settings = require('../models/Settings');

// @desc    Get settings (creates default if none exist)
// @route   GET /api/settings
// @access  Public (needed by student form to check admission status)
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private (superadmin)
exports.updateSettings = async (req, res, next) => {
  try {
    const { admissionOpen, currentSession, collegeDetails, emailTemplates } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (admissionOpen !== undefined) settings.admissionOpen = admissionOpen;
    if (currentSession !== undefined) settings.currentSession = currentSession;
    if (collegeDetails !== undefined) settings.collegeDetails = { ...settings.collegeDetails.toObject(), ...collegeDetails };
    if (emailTemplates !== undefined) settings.emailTemplates = { ...settings.emailTemplates.toObject(), ...emailTemplates };

    if (req.file) {
      settings.collegeDetails.logo = `/${req.file.path.replace(/\\/g, '/')}`;
    }

    await settings.save();

    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};
