import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiCalendar,
  HiLocationMarker,
  HiUsers,
  HiClock,
  HiTicket,
  HiCheckCircle,
  HiArrowLeft,
  HiShare,
} from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { api } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function EventDetails() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvent()
  }, [slug])

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/slug/${slug}`)
      setEvent(res.data.data)
    } catch (error) {
      toast.error('Event not found')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register')
      navigate('/login')
      return
    }
    setRegistering(true)
    try {
      await api.post(`/registrations/${event._id}/register`)
      toast.success('Registered successfully! Check your email for the ticket.')
      fetchEvent()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) return null

  const isFull = event.registeredCount >= event.capacity
  const isPast = new Date(event.endDate) < new Date()

  return (
    <div className="min-h-screen pt-20">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        {event.banner ? (
          <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/30 to-accent-500/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              <HiArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="glass p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium capitalize">
                  {event.category}
                </span>
                {event.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {event.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-white/5">
                  <HiCalendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-white/5">
                  <HiClock className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.startDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(event.endDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-white/5">
                  <HiLocationMarker className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium">Venue</p>
                    <p className="text-xs text-gray-500">{event.venue.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-white/5">
                  <HiUsers className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium">Capacity</p>
                    <p className="text-xs text-gray-500">
                      {event.registeredCount} / {event.capacity} registered
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="glass p-8">
                <h2 className="font-display text-2xl font-bold mb-6">Event Schedule</h2>
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="w-20 text-sm font-medium text-primary-600 dark:text-primary-400 shrink-0">
                        {item.time}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.description}
                          </p>
                        )}
                        {item.speaker && (
                          <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                            Speaker: {item.speaker}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="glass p-8">
                <h2 className="font-display text-2xl font-bold mb-6">Speakers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-white/5"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                        {speaker.name[0]}
                      </div>
                      <div>
                        <h3 className="font-medium">{speaker.name}</h3>
                        <p className="text-sm text-gray-500">{speaker.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold gradient-text mb-1">
                  {event.price > 0 ? `$${event.price}` : 'Free'}
                </div>
                <p className="text-sm text-gray-500">
                  {isFull ? 'Sold Out' : `${event.capacity - event.registeredCount} spots left`}
                </p>
              </div>

              <button
                onClick={handleRegister}
                disabled={registering || isFull || isPast}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {registering ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPast ? (
                  <>
                    <HiCheckCircle className="w-5 h-5" /> Event Ended
                  </>
                ) : isFull ? (
                  'Sold Out'
                ) : (
                  <>
                    <HiTicket className="w-5 h-5" /> Register Now
                  </>
                )}
              </button>

              <button className="w-full btn-secondary flex items-center justify-center gap-2">
                <HiShare className="w-5 h-5" /> Share Event
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                <h3 className="font-medium mb-2">Organizer</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium">
                    {event.organizer?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.organizer?.name}</p>
                    <p className="text-xs text-gray-500">{event.organizer?.email}</p>
                  </div>
                </div>
              </div>

              {event.requirements && event.requirements.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {event.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <HiCheckCircle className="w-4 h-4 text-emerald-500" /> {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

