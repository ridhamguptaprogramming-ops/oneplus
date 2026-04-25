import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiCalendar,
  HiTicket,
  HiChartBar,
  HiPlus,
  HiArrowRight,
  HiUsers,
} from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { api } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ events: 0, tickets: 0, attended: 0 })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [regRes, eventsRes] = await Promise.all([
        api.get('/registrations/my'),
        api.get('/events?limit=3'),
      ])
      const registrations = regRes.data.data || []
      setStats({
        events: registrations.length,
        tickets: registrations.filter((r) => r.status === 'registered').length,
        attended: registrations.filter((r) => r.status === 'checked-in').length,
      })
      setRecentEvents(eventsRes.data.data || [])
    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Events Registered', value: stats.events, icon: HiCalendar, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Tickets', value: stats.tickets, icon: HiTicket, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Attended', value: stats.attended, icon: HiUsers, color: 'from-violet-500 to-violet-600' },
  ]

  const quickActions = [
    { label: 'Browse Events', href: '/', icon: HiCalendar, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'My Tickets', href: '/dashboard/tickets', icon: HiTicket, color: 'bg-emerald-500/10 text-emerald-600' },
    ...(user?.role !== 'attendee'
      ? [
          { label: 'Create Event', href: '/dashboard/create-event', icon: HiPlus, color: 'bg-violet-500/10 text-violet-600' },
          { label: 'Check In', href: '/dashboard/check-in', icon: HiTicket, color: 'bg-amber-500/10 text-amber-600' },
        ]
      : []),
  ]

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your events.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="glass p-4 rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Upcoming Events</h2>
            <Link to="/" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                <Link
                  key={event._id}
                  to={`/events/${event.slug}`}
                  className="glass rounded-2xl overflow-hidden hover:shadow-glass-lg transition-all group"
                >
                  <div className="h-40 bg-gradient-to-br from-primary-500/20 to-accent-500/20 relative overflow-hidden">
                    {event.banner && (
                      <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <HiCalendar className="w-4 h-4" />
                      {new Date(event.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass p-12 text-center rounded-2xl">
              <HiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming events found.</p>
              <Link to="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block">
                Browse Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

