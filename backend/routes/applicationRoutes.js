const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplication,
  getMyApplications,
  updateApplication,
  updateApplicationStatus,
  getApplicationStats,
  downloadApplicationPDF,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { applicationUpload } = require('../middleware/upload');

// Order matters: specific routes before /:id
router.get('/my', protect, roleCheck('student'), getMyApplications);
router.get('/stats', protect, roleCheck('superadmin', 'officer'), getApplicationStats);

router.post('/', protect, roleCheck('student'), applicationUpload, createApplication);
router.get('/', protect, roleCheck('superadmin', 'officer'), getApplications);

router.get('/:id', protect, getApplication);
router.get('/:id/pdf', protect, downloadApplicationPDF);
router.put('/:id', protect, roleCheck('student'), applicationUpload, updateApplication);
router.put('/:id/status', protect, roleCheck('superadmin', 'officer'), updateApplicationStatus);

module.exports = router;
