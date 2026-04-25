const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['registered', 'checked-in', 'cancelled', 'no-show'],
      default: 'registered',
    },
    checkInTime: {
      type: Date,
    },
    checkInMethod: {
      type: String,
      enum: ['qr-scan', 'manual', 'auto'],
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'free'],
      default: 'free',
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);

