const express = require('express');
const router = express.Router();
const {
  getUsers, createUser, updateUser, deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.use(protect, roleCheck('superadmin'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
