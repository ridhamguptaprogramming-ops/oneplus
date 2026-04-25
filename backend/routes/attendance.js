const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getAttendanceByEvent,
  getAttendanceStats,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/check-in', protect, authorize('organizer', 'admin'), checkIn);
router.post('/check-out/:registrationId', protect, checkOut);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getAttendanceByEvent);
router.get('/stats/:eventId', protect, authorize('organizer', 'admin'), getAttendanceStats);

module.exports = router;

