import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import EventDetails from './pages/EventDetails'
import Dashboard from './pages/Dashboard'
import MyTickets from './pages/MyTickets'
import AdminPanel from './pages/AdminPanel'
import CreateEvent from './pages/CreateEvent'
import CheckIn from './pages/CheckIn'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/auth/ProtectedRoute'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const AnimatedPage = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.4, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
)

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { loginWithToken, isAuthenticated } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (token) {
      loginWithToken(token).then(() => {
        navigate(location.pathname, { replace: true })
      }).catch(() => {
        navigate('/login', { replace: true })
      })
    }
  }, [location.search, location.pathname, loginWithToken, navigate])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
          <Route path="/verify-email" element={<AnimatedPage><VerifyEmail /></AnimatedPage>} />
          <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
          <Route path="/reset-password" element={<AnimatedPage><ResetPassword /></AnimatedPage>} />
          <Route path="/events/:slug" element={<AnimatedPage><EventDetails /></AnimatedPage>} />
          <Route path="/dashboard" element={<ProtectedRoute><AnimatedPage><Dashboard /></AnimatedPage></ProtectedRoute>} />
          <Route path="/dashboard/tickets" element={<ProtectedRoute><AnimatedPage><MyTickets /></AnimatedPage></ProtectedRoute>} />
          <Route path="/dashboard/create-event" element={<ProtectedRoute roles={['organizer', 'admin']}><AnimatedPage><CreateEvent /></AnimatedPage></ProtectedRoute>} />
          <Route path="/dashboard/check-in" element={<ProtectedRoute roles={['organizer', 'admin']}><AnimatedPage><CheckIn /></AnimatedPage></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<ProtectedRoute roles={['admin']}><AnimatedPage><AdminPanel /></AnimatedPage></ProtectedRoute>} />
          <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default App

