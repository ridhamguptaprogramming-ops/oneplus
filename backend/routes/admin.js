const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getAllRegistrations,
  markAttendance,
  getSystemHealth,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.get('/registrations', protect, authorize('admin', 'organizer'), getAllRegistrations);
router.post('/mark-attendance/:registrationId', protect, authorize('admin', 'organizer'), markAttendance);
router.get('/health', protect, authorize('admin'), getSystemHealth);

module.exports = router;

