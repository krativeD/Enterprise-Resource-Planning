import React from 'react'
import { MdShowChart, MdPrint, MdDownload } from 'react-icons/md'
import { motion } from 'framer-motion'

const CashFlowReport = ({ dateRange, financialData }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <MdShowChart className="mr-2 text-blue-500" /> Cash Flow Report
        </h2>
        <div className="flex space-x-2">
          <motion.button whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2">
            <MdPrint /> <span>Print</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2">
            <MdDownload /> <span>Export</span>
          </motion.button>
        </div>
      </div>
      <p className="text-gray-500">{dateRange.from} to {dateRange.to}</p>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Cash Inflow</p>
          <p className="text-2xl font-bold text-green-600">$485,000</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Cash Outflow</p>
          <p className="text-2xl font-bold text-red-600">$312,000</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Net Cash Flow</p>
          <p className="text-2xl font-bold text-blue-600">$173,000</p>
        </div>
      </div>
    </div>
  )
}

export default CashFlowReport
