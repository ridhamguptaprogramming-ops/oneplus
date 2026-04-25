const Feedback = require('../models/Feedback');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.submitFeedback = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
      status: 'checked-in',
    });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'You must attend the event to submit feedback',
      });
    }

    const existingFeedback = await Feedback.findOne({
      user: userId,
      event: eventId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already submitted for this event',
      });
    }

    const feedback = await Feedback.create({
      user: userId,
      event: eventId,
      registration: registration._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

exports.getEventFeedback = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const feedbacks = await Feedback.find({ event: eventId, isPublic: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Feedback.countDocuments({ event: eventId, isPublic: true });

    const avgRating = await Feedback.aggregate([
      { $match: { event: require('mongoose').Types.ObjectId(eventId) } },
      {
        $group: {
          _id: null,
          overall: { $avg: '$overallRating' },
          content: { $avg: '$contentRating' },
          speaker: { $avg: '$speakerRating' },
          venue: { $avg: '$venueRating' },
          organization: { $avg: '$organizationRating' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      averages: avgRating[0] || {},
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user.id })
      .populate('event', 'title banner startDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

