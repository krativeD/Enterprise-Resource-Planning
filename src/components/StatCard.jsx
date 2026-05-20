import React from 'react'
import { motion } from 'framer-motion'

const StatCard = ({ icon: Icon, title, value, trend, color, bgColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, translateY: -5 }}
      className="stat-card"
    >
      <div className={`absolute inset-0 ${bgColor} opacity-10 rounded-2xl`}></div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-4`}>
          <Icon className={`text-2xl ${color}`} />
        </div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className={`text-3xl font-bold ${color} mb-2`}>{value}</p>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-sm text-gray-400">vs last month</span>
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard
