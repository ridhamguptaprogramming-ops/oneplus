import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  HiMenu,
  HiX,
  HiSun,
  HiMoon,
  HiUserCircle,
  HiTicket,
  HiCalendar,
  HiCog,
  HiLogout,
  HiHome,
  HiPlus,
  HiShieldCheck,
} from 'react-icons/hi'

const navLinks = [
  { name: 'Home', href: '/', icon: HiHome },
  { name: 'Events', href: '/#events', icon: HiCalendar },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsProfileOpen(false)
  }, [location])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const dashboardLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: HiCog },
    { name: 'My Tickets', href: '/dashboard/tickets', icon: HiTicket },
    ...(user?.role !== 'attendee'
      ? [
          { name: 'Create Event', href: '/dashboard/create-event', icon: HiPlus },
          { name: 'Check In', href: '/dashboard/check-in', icon: HiQrCode },
        ]
      : []),
    ...(user?.role === 'admin'
      ? [{ name: 'Admin Panel', href: '/dashboard/admin', icon: HiShieldCheck }]
      : []),
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-dark-950/80 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Event<span className="gradient-text">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <HiSun className="w-5 h-5 text-amber-400" />
              ) : (
                <HiMoon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium text-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-900 rounded-2xl shadow-glass-lg border border-gray-100 dark:border-white/10 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-white/10">
                        <p className="font-medium text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 capitalize">
                          {user?.role}
                        </span>
                      </div>
                      <div className="p-2">
                        {dashboardLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.href}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <link.icon className="w-4 h-4 text-gray-500" />
                            {link.name}
                          </Link>
                        ))}
                      </div>
                      <div className="p-2 border-t border-gray-100 dark:border-white/10">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <HiLogout className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-gray-500" />
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-100 dark:border-white/10 pt-2" />
                  {dashboardLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <link.icon className="w-5 h-5 text-gray-500" />
                      {link.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <HiLogout className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div className="pt-2 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-3 rounded-xl text-sm font-medium border border-gray-200 dark:border-white/10"
                  >
                    Login
                  </Link>
                  <Link to="/register" className="block w-full btn-primary text-center text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

