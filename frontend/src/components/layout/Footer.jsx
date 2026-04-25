import { Link } from 'react-router-dom'
import { HiHeart } from 'react-icons/hi'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-display font-bold text-lg">
                Event<span className="gradient-text">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Premium event attendance platform for modern experiences.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/" className="hover:text-primary-600 transition-colors">Events</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-600 transition-colors">Dashboard</Link></li>
              <li><Link to="/dashboard/tickets" className="hover:text-primary-600 transition-colors">My Tickets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="flex items-center justify-center gap-1">
            Made with <HiHeart className="w-4 h-4 text-red-500" /> by EventFlow Team
          </p>
        </div>
      </div>
    </footer>
  )
}

