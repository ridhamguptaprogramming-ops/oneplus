import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiPlus,
  HiCalendar,
  HiLocationMarker,
  HiUsers,
  HiTag,
  HiCurrencyDollar,
} from 'react-icons/hi'
import { api } from '../context/AuthContext'
import toast from 'react-hot-toast'

const categories = [
  'conference', 'workshop', 'seminar', 'cultural', 'sports', 'networking', 'other'
]

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'conference',
    venueName: '',
    venueAddress: '',
    startDate: '',
    endDate: '',
    capacity: '',
    price: '0',
    tags: '',
  })
  const [banner, setBanner] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = new FormData()
      Object.keys(formData).forEach((key) => data.append(key, formData[key]))
      if (banner) data.append('banner', banner)

      const payload = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        venue: { name: formData.venueName, address: formData.venueAddress },
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isPublished: true,
      }

      const res = await api.post('/events', payload)
      toast.success('Event created successfully!')
      navigate(`/events/${res.data.data.slug}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">Create Event</h1>
          <p className="text-gray-600 dark:text-gray-400">Set up your event details.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass p-6 rounded-2xl space-y-5">
            <h2 className="font-semibold text-lg">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                placeholder="e.g., Tech Conference 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                placeholder="Brief description for cards"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                placeholder="Detailed event description"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="tech, ai, startup"
                />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl space-y-5">
            <h2 className="font-semibold text-lg">Venue & Schedule</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Venue Name</label>
                <div className="relative">
                  <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="Convention Center"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Venue Address</label>
                <input
                  type="text"
                  name="venueAddress"
                  value={formData.venueAddress}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="123 Main St, City"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date & Time</label>
                <div className="relative">
                  <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl space-y-5">
            <h2 className="font-semibold text-lg">Registration</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Capacity</label>
                <div className="relative">
                  <HiUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min={1}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (USD)</label>
                <div className="relative">
                  <HiCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min={0}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="0 for free"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <HiPlus className="w-5 h-5" /> Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

