import React from 'react'
import { MdAssessment, MdPrint } from 'react-icons/md'
import { motion } from 'framer-motion'

const TaxReports = ({ dateRange, financialData }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <MdAssessment className="mr-2 text-orange-500" /> Tax Reports
      </h2>
      <p className="text-gray-500">{dateRange.from} to {dateRange.to}</p>
      <div className="mt-4 space-y-3">
        {[
          { tax: 'Sales Tax/VAT', amount: 48500, rate: '15%' },
          { tax: 'Payroll Tax', amount: 32000, rate: '12%' },
          { tax: 'Income Tax', amount: 28000, rate: '28%' }
        ].map((t, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{t.tax}</p>
              <p className="text-sm text-gray-500">Rate: {t.rate}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">${t.amount.toLocaleString()}</p>
              <motion.button whileHover={{ scale: 1.05 }} className="text-blue-500 text-sm">
                <MdPrint className="inline" /> Print
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaxReports
