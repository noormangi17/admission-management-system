const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Get logged-in user's notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin sends a manual notification to a student
// @route   POST /api/notifications
// @access  Private (superadmin, officer)
exports.sendManualNotification = async (req, res, next) => {
  try {
    const { userId, message } = req.body;

    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const notification = await Notification.create({ userId, message, type: 'manual' });

    sendEmail({
      to: student.email,
      subject: 'New Message from Admissions Office',
      text: message,
    }).catch((e) => console.error('Email error:', e.message));

    res.status(201).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};
