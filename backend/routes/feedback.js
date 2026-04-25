const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getEventFeedback,
  getMyFeedback,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

router.post('/:eventId', protect, submitFeedback);
router.get('/:eventId', getEventFeedback);
router.get('/my/feedback', protect, getMyFeedback);

module.exports = router;

