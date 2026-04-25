const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getRegistration,
  cancelRegistration,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');

router.post('/:eventId/register', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.get('/:id', protect, getRegistration);
router.delete('/:id/cancel', protect, cancelRegistration);

module.exports = router;

