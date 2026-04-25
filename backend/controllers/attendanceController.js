const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');

exports.checkIn = async (req, res, next) => {
  try {
    const { ticketId, qrData } = req.body;
    let registration;

    if (qrData) {
      try {
        const parsed = JSON.parse(qrData);
        registration = await Registration.findById(parsed.registrationId);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid QR code',
        });
      }
    } else if (ticketId) {
      registration = await Registration.findOne({ ticketId });
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    if (registration.status === 'checked-in') {
      return res.status(400).json({
        success: false,
        message: 'Already checked in',
        checkInTime: registration.checkInTime,
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration was cancelled',
      });
    }

    registration.status = 'checked-in';
    registration.checkInTime = new Date();
    registration.checkInMethod = req.body.method || 'manual';
    registration.checkedInBy = req.user.id;
    await registration.save();

    const event = await Event.findById(registration.event);
    event.attendedCount += 1;
    await event.save();

    await Attendance.create({
      registration: registration._id,
      event: registration.event,
      user: registration.user,
      entryTime: new Date(),
      deviceInfo: req.headers['user-agent'],
      ipAddress: req.ip,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`event-${registration.event}`).emit('check-in', {
        registrationId: registration._id,
        ticketId: registration.ticketId,
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Check-in successful',
      data: {
        ticketId: registration.ticketId,
        checkInTime: registration.checkInTime,
        event: event.title,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const registration = await Registration.findById(registrationId);

    if (!registration || registration.status !== 'checked-in') {
      return res.status(400).json({
        success: false,
        message: 'Not checked in',
      });
    }

    const attendance = await Attendance.findOne({
      registration: registrationId,
      exitTime: { $exists: false },
    });

    if (attendance) {
      attendance.exitTime = new Date();
      attendance.sessionDuration = Math.round(
        (attendance.exitTime - attendance.entryTime) / 60000
      );
      await attendance.save();
    }

    res.status(200).json({
      success: true,
      message: 'Check-out recorded',
    });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const attendances = await Attendance.find({ event: eventId })
      .populate('user', 'name email avatar')
      .populate('registration', 'ticketId checkInTime')
      .sort({ entryTime: -1 });

    res.status(200).json({
      success: true,
      count: attendances.length,
      data: attendances,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceStats = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const registrations = await Registration.find({ event: eventId });
    const attendances = await Attendance.find({ event: eventId });

    const hourlyData = Array(24).fill(0);
    attendances.forEach((a) => {
      const hour = new Date(a.entryTime).getHours();
      hourlyData[hour] += 1;
    });

    const stats = {
      totalRegistered: registrations.length,
      totalCheckedIn: attendances.length,
      checkInRate: registrations.length
        ? ((attendances.length / registrations.length) * 100).toFixed(1)
        : 0,
      averageSessionDuration: attendances.length
        ? (
            attendances.reduce((sum, a) => sum + (a.sessionDuration || 0), 0) /
            attendances.length
          ).toFixed(0)
        : 0,
      hourlyDistribution: hourlyData,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

