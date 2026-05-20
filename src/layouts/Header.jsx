import React from 'react'
import { motion } from 'framer-motion'
import { MdMenu, MdNotifications, MdSearch, MdDarkMode, MdLightMode } from 'react-icons/md'

const Header = ({ toggleSidebar, darkMode, setDarkMode }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <MdMenu className="text-2xl text-gray-600" />
          </motion.button>

          {/* Search Bar */}
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-all w-64 bg-gray-50"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {darkMode ? (
              <MdLightMode className="text-2xl text-yellow-500" />
            ) : (
              <MdDarkMode className="text-2xl text-gray-600" />
            )}
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <MdNotifications className="text-2xl text-gray-600" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </motion.button>

          {/* Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
