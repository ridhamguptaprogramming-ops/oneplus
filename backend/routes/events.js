const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getEventStats,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadImage } = require('../utils/cloudinary');

const handleUpload = async (req, res, next) => {
  if (!req.file) return next();
  try {
    const url = await uploadImage(req.file.buffer, 'eventflow/events');
    req.fileUrl = url;
    next();
  } catch (error) {
    next(error);
  }
};

router.get('/', getEvents);
router.get('/my-events', protect, getMyEvents);
router.get('/stats/:id', protect, getEventStats);
router.get('/slug/:slug', getEventBySlug);
router.get('/:id', getEvent);

router.post(
  '/',
  protect,
  authorize('organizer', 'admin'),
  upload.single('banner'),
  handleUpload,
  createEvent
);

router.put(
  '/:id',
  protect,
  upload.single('banner'),
  handleUpload,
  updateEvent
);

router.delete('/:id', protect, deleteEvent);

module.exports = router;

