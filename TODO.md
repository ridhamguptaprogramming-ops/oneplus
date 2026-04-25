# Google OAuth Integration - Implementation TODO

## Backend
- [x] Create `backend/config/passport.js` - Google OAuth strategy
- [x] Edit `backend/models/User.js` - Make password optional, add googleId & authProvider
- [x] Edit `backend/routes/auth.js` - Add `/google` and `/google/callback` routes
- [x] Edit `backend/server.js` - Initialize Passport middleware

## Frontend
- [x] Edit `frontend/src/context/AuthContext.jsx` - Add `loginWithToken` helper
- [x] Edit `frontend/src/App.jsx` - Handle OAuth redirect token extraction
- [x] Edit `frontend/src/pages/Login.jsx` - Add "Sign in with Google" button
- [x] Edit `frontend/src/pages/Register.jsx` - Add "Sign up with Google" button

## Testing
- [x] Run both backend and frontend to verify integration
- [x] Backend running on port 5000 (syntax valid)
- [x] Frontend build successful (no errors)

