import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiHome, HiExclamationCircle } from 'react-icons/hi'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-6">
          <HiExclamationCircle className="w-12 h-12 text-primary-500" />
        </div>
        <h1 className="font-display text-6xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <HiHome className="w-5 h-5" /> Back Home
        </Link>
      </motion.div>
    </div>
  )
}

