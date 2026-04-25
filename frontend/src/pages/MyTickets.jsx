import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiTicket,
  HiCalendar,
  HiLocationMarker,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiQrcode,
  HiDownload,
} from 'react-icons/hi'
import { api } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function MyTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const res = await api.get('/registrations/my')
      setTickets(res.data.data || [])
    } catch (error) {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (ticketId) => {
    if (!confirm('Are you sure you want to cancel this registration?')) return
    try {
      await api.delete(`/registrations/${ticketId}/cancel`)
      toast.success('Registration cancelled')
      fetchTickets()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancel failed')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'checked-in':
        return <HiCheckCircle className="w-5 h-5 text-emerald-500" />
      case 'cancelled':
        return <HiXCircle className="w-5 h-5 text-red-500" />
      default:
        return <HiClock className="w-5 h-5 text-amber-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked-in':
        return 'bg-emerald-500/10 text-emerald-600'
      case 'cancelled':
        return 'bg-red-500/10 text-red-600'
      default:
        return 'bg-amber-500/10 text-amber-600'
    }
  }

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">My Tickets</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your event registrations and tickets.
          </p>
        </motion.div>

        {tickets.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link
                        to={`/events/${ticket.event?.slug}`}
                        className="font-display text-xl font-bold hover:text-primary-600 transition-colors"
                      >
                        {ticket.event?.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          Ticket: {ticket.ticketId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <HiCalendar className="w-4 h-4 text-primary-500" />
                      {new Date(ticket.event?.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <HiLocationMarker className="w-4 h-4 text-primary-500" />
                      {ticket.event?.venue?.name}
                    </div>
                  </div>

                  {ticket.status === 'registered' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2.5">
                        <HiQrcode className="w-4 h-4" /> Show QR
                      </button>
                      <button
                        onClick={() => handleCancel(ticket._id)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {ticket.qrCode && (
                    <div className="mt-4 p-4 bg-white rounded-xl">
                      <img
                        src={ticket.qrCode}
                        alt="Ticket QR Code"
                        className="w-32 h-32 mx-auto"
                      />
                      <p className="text-center text-xs text-gray-500 mt-2">
                        Show this at the entrance
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass p-12 text-center rounded-2xl">
            <HiTicket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
            <p className="text-gray-500 mb-4">You haven't registered for any events.</p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              Browse Events
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

