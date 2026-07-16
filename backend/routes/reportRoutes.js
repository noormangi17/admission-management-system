const express = require('express');
const router = express.Router();
const {
  getSummaryReport, getCourseWiseReport, exportReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.use(protect, roleCheck('superadmin', 'officer'));

router.get('/summary', getSummaryReport);
router.get('/course-wise', getCourseWiseReport);
router.get('/export', exportReport);

module.exports = router;
