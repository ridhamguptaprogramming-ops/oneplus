import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Html5Qrcode } from 'html5-qrcode'
import { HiTicket, HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { api } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function CheckIn() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [ticketId, setTicketId] = useState('')
  const [lastCheckIn, setLastCheckIn] = useState(null)
  const scannerRef = useRef(null)
  const scannerContainerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const startScanner = async () => {
    try {
      if (!scannerContainerRef.current) return
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleScan(decodedText)
          scanner.stop()
          setScanning(false)
        },
        () => {}
      )
      setScanning(true)
    } catch (error) {
      toast.error('Camera access denied or not available')
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop()
      scannerRef.current = null
    }
    setScanning(false)
  }

  const handleScan = async (data) => {
    try {
      const payload = JSON.parse(data)
      await processCheckIn(payload.ticketId || data)
    } catch {
      await processCheckIn(data)
    }
  }

  const processCheckIn = async (id) => {
    try {
      const res = await api.post('/attendance/check-in', {
        ticketId: id,
        method: 'qr-scan',
      })
      setResult({ success: true, data: res.data.data })
      setLastCheckIn(res.data.data)
      toast.success('Check-in successful!')
    } catch (error) {
      setResult({ success: false, message: error.response?.data?.message || 'Check-in failed' })
      toast.error(error.response?.data?.message || 'Check-in failed')
    }
  }

  const handleManualCheckIn = async (e) => {
    e.preventDefault()
    if (!ticketId.trim()) return
    await processCheckIn(ticketId.trim())
    setTicketId('')
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="font-display text-3xl font-bold mb-2">Event Check-In</h1>
          <p className="text-gray-600 dark:text-gray-400">Scan QR codes or enter ticket ID.</p>
        </motion.div>

        <div className="glass p-6 rounded-2xl space-y-6">
          {/* QR Scanner */}
          <div className="text-center">
            {scanning ? (
              <div className="relative">
                <div id="qr-reader" ref={scannerContainerRef} className="rounded-xl overflow-hidden mx-auto" style={{ maxWidth: '400px' }} />
                <button
                  onClick={stopScanner}
                  className="mt-4 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Stop Scanning
                </button>
              </div>
            ) : (
              <button
                onClick={startScanner}
                className="inline-flex items-center gap-2 btn-primary"
              >
                <HiTicket className="w-5 h-5" /> Start QR Scanner
              </button>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark-950 text-gray-500">or</span>
            </div>
          </div>

          {/* Manual Entry */}
          <form onSubmit={handleManualCheckIn} className="flex gap-3">
            <div className="relative flex-1">
              <HiTicket className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Enter Ticket ID"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
            <button type="submit" className="btn-primary px-6">
              Check In
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 glass p-6 rounded-2xl text-center ${
              result.success ? 'border-emerald-500/30' : 'border-red-500/30'
            }`}
          >
            {result.success ? (
              <>
                <HiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-emerald-600 mb-1">Check-In Successful</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ticket: {result.data.ticketId}
                </p>
                <p className="text-sm text-gray-500">Event: {result.data.event}</p>
              </>
            ) : (
              <>
                <HiXCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-red-600 mb-1">Check-In Failed</h3>
                <p className="text-gray-600 dark:text-gray-400">{result.message}</p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

