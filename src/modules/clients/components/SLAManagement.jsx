import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdClose, MdSave } from 'react-icons/md'

const SLAManagement = ({ client, onClose }) => {
  const [sla, setSla] = useState({
    response_time: client?.sla_response_time || '4',
    resolution_time: client?.sla_resolution_time || '24',
    service_hours: client?.sla_service_hours || 'business',
    priority_support: client?.sla_priority_support || false,
    penalty_clause: client?.sla_penalty_clause || '',
    review_frequency: client?.sla_review || 'quarterly'
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">SLA Management - {client?.company_name}</h2>
          <button onClick={onClose}><MdClose className="text-2xl" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Response Time (hours)</label>
            <input type="number" value={sla.response_time} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resolution Time (hours)</label>
            <input type="number" value={sla.resolution_time} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service Hours</label>
            <select value={sla.service_hours} className="w-full px-4 py-2 border rounded-lg">
              <option value="business">Business Hours (8am-5pm)</option>
              <option value="extended">Extended (6am-8pm)</option>
              <option value="247">24/7</option>
            </select>
          </div>
          <div className="flex items-center">
            <input type="checkbox" checked={sla.priority_support} className="mr-2" />
            <label className="text-sm">Priority Support</label>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-2">
            <MdSave /> <span>Save SLA</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default SLAManagement
