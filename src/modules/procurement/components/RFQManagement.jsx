import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdSend, MdLocalOffer } from 'react-icons/md'

const RFQManagement = ({ suppliers, loading }) => {
  const [rfqs, setRfqs] = useState([
    { id: 1, rfq_number: 'RFQ-2024-001', item: 'Cleaning Chemicals', quantity: 50, deadline: '2024-04-15', status: 'open' },
    { id: 2, rfq_number: 'RFQ-2024-002', item: 'Vacuum Cleaners', quantity: 10, deadline: '2024-04-20', status: 'sent' },
  ])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Request for Quotations (RFQ)</h2>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl flex items-center space-x-2"
          >
            <MdAdd /> <span>Create RFQ</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rfqs.map((rfq, i) => (
          <motion.div
            key={rfq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm text-indigo-600">{rfq.rfq_number}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                rfq.status === 'open' ? 'bg-green-100 text-green-800' :
                rfq.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {rfq.status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{rfq.item}</h3>
            <p className="text-sm text-gray-600">Quantity: {rfq.quantity}</p>
            <p className="text-sm text-gray-500">Deadline: {rfq.deadline}</p>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm flex items-center justify-center space-x-1">
                <MdSend /> <span>Send to Suppliers</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Suppliers ({suppliers?.length || 0})</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {suppliers?.slice(0, 6).map(s => (
            <div key={s.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <MdLocalOffer className="text-indigo-500" />
              <div>
                <p className="text-sm font-medium">{s.company_name}</p>
                <p className="text-xs text-gray-500">{s.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RFQManagement
