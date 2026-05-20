import React from 'react'
import { motion } from 'framer-motion'

const ChartCard = ({ title, children, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {Icon && <Icon className="text-2xl text-gray-400" />}
      </div>
      {children}
    </motion.div>
  )
}

export default ChartCard
