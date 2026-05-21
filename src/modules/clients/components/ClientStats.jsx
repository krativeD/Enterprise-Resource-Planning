import React from 'react'
import { motion } from 'framer-motion'
import { MdPeople, MdAssignment, MdAttachMoney, MdStar } from 'react-icons/md'

const ClientStats = ({ stats }) => {
  const statCards = [
    { label: 'Total Clients', value: stats?.total || 0, icon: MdPeople, color: 'text-blue-600' },
    { label: 'Active', value: stats?.active || 0, icon: MdStar, color: 'text-green-600' },
    { label: 'With Contracts', value: stats?.withContracts || 0, icon: MdAssignment, color: 'text-purple-600' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: MdAttachMoney, color: 'text-emerald-600' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-4"
        >
          <stat.icon className={`text-2xl ${stat.color} mb-2`} />
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default ClientStats
