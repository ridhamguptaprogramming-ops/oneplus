import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../context/AuthContext'
import { HiMail, HiRefresh, HiCheckCircle } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function VerifyEmail() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleResend = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    setIsLoading(true)
    try {
      await api.post('/auth/resend-verification', { email })
      setIsSent(true)
      toast.success('Verification email sent!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass p-8 sm:p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
            {isSent ? (
              <HiCheckCircle className="w-10 h-10 text-emerald-500" />
            ) : (
              <HiMail className="w-10 h-10 text-primary-500" />
            )}
          </div>

          <h1 className="font-display text-3xl font-bold mb-3">
            {isSent ? 'Email Sent!' : 'Verify Your Email'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">
            {isSent
              ? 'Check your inbox for the verification link. Click it to activate your account.'
              : 'Please verify your email address to access your account. Enter your email to resend the verification link.'}
          </p>

          {!isSent && (
            <form onSubmit={handleResend} className="space-y-4">
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <HiRefresh className="w-5 h-5" /> Resend Email
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            Already verified?{' '}
            <Link to="/login" className="text-primary-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

