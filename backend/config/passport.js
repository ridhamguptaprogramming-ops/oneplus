const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const avatar = profile.photos[0]?.value || '';
        const googleId = profile.id;

        let user = await User.findOne({ email });

        if (user) {
          // If user exists but signed up with local auth, link Google
          if (user.authProvider === 'local') {
            user.googleId = googleId;
            user.authProvider = 'google';
            user.avatar = avatar || user.avatar;
            await user.save({ validateBeforeSave: false });
          }
        } else {
          // Create new user with Google auth
          user = await User.create({
            name,
            email,
            avatar,
            googleId,
            authProvider: 'google',
            isEmailVerified: true,
            password: undefined,
          });
        }

        const jwtAccessToken = generateAccessToken(user._id);
        const jwtRefreshToken = generateRefreshToken(user._id);

        user.refreshTokens.push({ token: jwtRefreshToken });
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        return done(null, { user, accessToken: jwtAccessToken, refreshToken: jwtRefreshToken });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, data);
});

passport.deserializeUser((data, done) => {
  done(null, data);
});

module.exports = passport;

