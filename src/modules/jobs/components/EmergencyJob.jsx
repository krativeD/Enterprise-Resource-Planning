import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdWarning, MdSend } from 'react-icons/md'

const EmergencyJob = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    address: '',
    job_type: 'deep_clean',
    description: '',
    scheduled_time: new Date().toTimeString().slice(0, 5)
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      scheduled_date: new Date().toISOString().split('T')[0],
      priority: 'urgent',
      is_emergency: true,
      estimated_duration: 2,
      team_size: 2
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-800 font-medium flex items-center">
          <MdWarning className="mr-2" /> Emergency Job - Immediate Dispatch Required
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Client Name *</label>
        <input type="text" value={formData.client_name}
          onChange={(e) => setFormData(prev => ({...prev, client_name: e.target.value}))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone *</label>
        <input type="tel" value={formData.client_phone}
          onChange={(e) => setFormData(prev => ({...prev, client_phone: e.target.value}))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address *</label>
        <input type="text" value={formData.address}
          onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Job Type</label>
        <select value={formData.job_type}
          onChange={(e) => setFormData(prev => ({...prev, job_type: e.target.value}))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg">
          <option value="deep_clean">Deep Clean</option>
          <option value="sanitization">Sanitization</option>
          <option value="pest_control">Pest Control</option>
          <option value="office">Office Cleaning</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea value={formData.description}
          onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
          rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl">Cancel</motion.button>
        <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-red-500 text-white rounded-xl flex items-center space-x-2">
          <MdSend /> <span>Dispatch Emergency Team</span>
        </motion.button>
      </div>
    </form>
  )
}

export default EmergencyJob
