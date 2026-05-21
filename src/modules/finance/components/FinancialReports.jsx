import React from 'react'
import { MdPrint, MdDownload, MdPictureAsPdf, MdTableChart } from 'react-icons/md'
import { motion } from 'framer-motion'

const FinancialReports = ({ dateRange, financialData }) => {
  const reports = [
    'Balance Sheet', 'Income Statement', 'Cash Flow Statement',
    'Trial Balance', 'General Ledger', 'Accounts Receivable Aging',
    'Accounts Payable Aging', 'Fixed Asset Register'
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Reports</h2>
      <p className="text-gray-500 mb-4">{dateRange.from} to {dateRange.to}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {reports.map((report, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <MdPictureAsPdf className="text-red-500 text-xl" />
              <span className="font-medium">{report}</span>
            </div>
            <div className="flex space-x-2">
              <button className="text-blue-500"><MdPrint /></button>
              <button className="text-green-500"><MdDownload /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FinancialReports
