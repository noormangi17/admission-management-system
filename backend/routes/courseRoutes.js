const express = require('express');
const router = express.Router();
const {
  createCourse, getCourses, getCourse, updateCourse, deleteCourse,
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', protect, roleCheck('superadmin'), createCourse);
router.put('/:id', protect, roleCheck('superadmin'), updateCourse);
router.delete('/:id', protect, roleCheck('superadmin'), deleteCourse);

module.exports = router;
