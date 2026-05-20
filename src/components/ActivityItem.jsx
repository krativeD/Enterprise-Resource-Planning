import React from 'react'
import { motion } from 'framer-motion'

const ActivityItem = ({ icon: Icon, title, description, time, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="text-white text-lg" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </motion.div>
  )
}

export default ActivityItem
