# EventFlow - Premium Event Attendance Platform

A modern, fully responsive event attendance and management system with premium animations, secure authentication, and real-time features.

## Features

### Frontend
- React 18 + Vite + Tailwind CSS
- GSAP animations (60 FPS smooth interactions)
- Glassmorphism & Neumorphism design system
- Dark/Light mode toggle
- PWA support
- Responsive mobile-first design
- QR code generation & scanning

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication with refresh tokens
- Email verification via Nodemailer
- Password reset flow
- WebSocket real-time updates
- Rate limiting & Helmet security
- Multer + Cloudinary image uploads

### Database Collections
- Users (with roles: attendee, organizer, admin)
- Events (with schedules, venues, speakers)
- Registrations (with QR codes)
- Attendance records
- Feedback/Ratings

## Quick Start

### Backend
```bash
cd backend
npm install
# Configure .env file
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
oneplus/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

