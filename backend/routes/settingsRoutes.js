const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { singleUpload } = require('../middleware/upload');

router.get('/', getSettings);
router.put('/', protect, roleCheck('superadmin'), singleUpload('logo'), updateSettings);

module.exports = router;
