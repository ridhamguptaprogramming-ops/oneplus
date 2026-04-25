const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { generateTicketId, generateQRCode } = require('../utils/qr');
const { sendTicketConfirmation } = require('../utils/email');

exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is fully booked',
      });
    }

    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId,
    });

    if (existingRegistration && existingRegistration.status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    const ticketId = generateTicketId();
    const qrPayload = JSON.stringify({
      ticketId,
      eventId,
      userId,
    });
    const qrCode = await generateQRCode(qrPayload);

    const registration = await Registration.create({
      user: userId,
      event: eventId,
      ticketId,
      qrCode,
      paymentStatus: event.price > 0 ? 'pending' : 'free',
      notes: req.body.notes || '',
    });

    event.registeredCount += 1;
    await event.save();

    await Event.findByIdAndUpdate(eventId, {
      $push: { attendees: userId },
    });

    const user = await require('../models/User').findById(userId);
    const ticketUrl = `${process.env.CLIENT_URL}/dashboard/tickets/${registration._id}`;
    await sendTicketConfirmation(user, event, registration, ticketUrl);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'title startDate endDate venue banner')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('event', 'title startDate endDate venue banner schedule')
      .populate('user', 'name email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    if (
      registration.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    if (registration.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (registration.status === 'checked-in') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel after check-in',
      });
    }

    registration.status = 'cancelled';
    await registration.save();

    const event = await Event.findById(registration.event);
    event.registeredCount = Math.max(0, event.registeredCount - 1);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Registration cancelled',
    });
  } catch (error) {
    next(error);
  }
};

