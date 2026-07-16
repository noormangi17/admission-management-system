const express = require('express');
const router = express.Router();
const {
  getNotifications, markAsRead, markAllAsRead, sendManualNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.post('/', protect, roleCheck('superadmin', 'officer'), sendManualNotification);

module.exports = router;
