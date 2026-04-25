const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const passport = require('../config/passport');
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

const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

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

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const { accessToken, refreshToken, user } = req.user;
    setTokenCookie(res, refreshToken);

    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?token=${accessToken}`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;

