const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  verifyEmail,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  resendVerification,
  devVerify,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  register
);

router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail().withMessage('Valid email is required')],
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  resetPassword
);

// Dev-only: Auto-verify user without email (development only)
router.post('/dev-verify', devVerify);

module.exports = router;

