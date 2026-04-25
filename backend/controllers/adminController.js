const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const Feedback = require('../models/Feedback');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ isPublished: true });
    const totalRegistrations = await Registration.countDocuments();
    const totalAttendances = await Attendance.countDocuments();

    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const popularEvents = await Event.find({ isPublished: true })
      .select('title registeredCount capacity attendedCount')
      .sort({ registeredCount: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          verifiedUsers,
          totalEvents,
          publishedEvents,
          totalRegistrations,
          totalAttendances,
          conversionRate: totalRegistrations
            ? ((totalAttendances / totalRegistrations) * 100).toFixed(1)
            : 0,
        },
        recentUsers,
        popularEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(query)
      .select('-password -refreshTokens')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllRegistrations = async (req, res, next) => {
  try {
    const { eventId, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (eventId) query.event = eventId;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const registrations = await Registration.find(query)
      .populate('user', 'name email avatar')
      .populate('event', 'title startDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Registration.countDocuments(query);

    res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

exports.markAttendance = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    registration.status = 'checked-in';
    registration.checkInTime = new Date();
    registration.checkInMethod = 'manual';
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

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getSystemHealth = async (req, res, next) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        database: dbStatus,
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
        memory: {
          used: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          total: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

const mongoose = require('mongoose');

