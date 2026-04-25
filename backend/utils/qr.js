const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

exports.generateTicketId = () => {
  return `EVF-${uuidv4().split('-')[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
};

exports.generateQRCode = async (data) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: 400,
      margin: 2,
      color: {
        dark: '#667eea',
        light: '#ffffff',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

exports.generateCheckInQR = async (registrationId, eventId) => {
  const payload = JSON.stringify({
    registrationId,
    eventId,
    timestamp: Date.now(),
  });
  return await exports.generateQRCode(payload);
};

