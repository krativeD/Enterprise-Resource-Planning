import React from 'react'
import { motion } from 'framer-motion'

const EmployeeTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <motion.button
            key={tab.id}
            whileHover={{ backgroundColor: '#EBF5FF' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors
              ${activeTab === tab.id 
                ? 'border-blue-500 text-blue-600 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:text-gray-900'}`}
          >
            <Icon className="text-lg" />
            <span className="font-medium text-sm whitespace-nowrap">{tab.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default EmployeeTabs
