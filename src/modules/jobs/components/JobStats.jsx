import React from 'react'
import { motion } from 'framer-motion'
import { MdWork, MdSchedule, MdCheckCircle, MdWarning, MdTrendingUp } from 'react-icons/md'

const JobStats = ({ stats }) => {
  const statCards = [
    { label: 'Total Jobs', value: stats?.total || 0, icon: MdWork, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending', value: stats?.pending || 0, icon: MdSchedule, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'In Progress', value: stats?.inProgress || 0, icon: MdTrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Completed', value: stats?.completed || 0, icon: MdCheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Urgent', value: stats?.urgent || 0, icon: MdWarning, color: 'text-red-600', bg: 'bg-red-100' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statCards.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-4"
        >
          <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
            <stat.icon className={`text-xl ${stat.color}`} />
          </div>
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default JobStats
