import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HiUsers,
  HiCalendar,
  HiTicket,
  HiChartBar,
  HiShieldCheck,
  HiArrowUp,
  HiArrowDown,
} from 'react-icons/hi'
import { api } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users?limit=5'),
      ])
      setStats(statsRes.data.data)
      setUsers(usersRes.data.data || [])
    } catch (error) {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const overviewStats = stats?.overview || {}

  const statCards = [
    { label: 'Total Users', value: overviewStats.totalUsers, icon: HiUsers, change: '+12%', color: 'from-blue-500 to-blue-600' },
    { label: 'Events', value: overviewStats.totalEvents, icon: HiCalendar, change: '+5%', color: 'from-violet-500 to-violet-600' },
    { label: 'Registrations', value: overviewStats.totalRegistrations, icon: HiTicket, change: '+23%', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Conversion', value: `${overviewStats.conversionRate}%`, icon: HiChartBar, change: '-2%', color: 'from-amber-500 to-amber-600' },
  ]

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HiShieldCheck className="w-8 h-8 text-primary-500" />
            <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">System overview and management.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.change.startsWith('+') ? <HiArrowUp className="w-3 h-3" /> : <HiArrowDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="font-display text-xl font-bold mb-6">Recent Users</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium">
                    {user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 capitalize">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Events */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="font-display text-xl font-bold mb-6">Popular Events</h2>
            <div className="space-y-4">
              {(stats?.popularEvents || []).map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-white/5"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{event.registeredCount}</p>
                    <p className="text-gray-500 text-xs">/{event.capacity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

