import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSave, MdCancel, MdAdd, MdDelete } from 'react-icons/md'

const JobForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    client_name: initialData?.client_name || '',
    client_phone: initialData?.client_phone || '',
    client_email: initialData?.client_email || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zip_code: initialData?.zip_code || '',
    job_type: initialData?.job_type || 'office',
    service_type: initialData?.service_type || 'regular',
    priority: initialData?.priority || 'medium',
    scheduled_date: initialData?.scheduled_date || '',
    scheduled_time: initialData?.scheduled_time || '',
    estimated_duration: initialData?.estimated_duration || '2',
    team_size: initialData?.team_size || '2',
    notes: initialData?.notes || '',
    special_instructions: initialData?.special_instructions || '',
    frequency: initialData?.frequency || 'once',
    equipment_needed: initialData?.equipment_needed || [],
    chemicals_needed: initialData?.chemicals_needed || []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleEquipment = (item) => {
    setFormData(prev => ({
      ...prev,
      equipment_needed: prev.equipment_needed.includes(item)
        ? prev.equipment_needed.filter(i => i !== item)
        : [...prev.equipment_needed, item]
    }))
  }

  const toggleChemical = (item) => {
    setFormData(prev => ({
      ...prev,
      chemicals_needed: prev.chemicals_needed.includes(item)
        ? prev.chemicals_needed.filter(i => i !== item)
        : [...prev.chemicals_needed, item]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🏢 Client Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
            <input type="text" name="client_name" value={formData.client_name} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input type="tel" name="client_phone" value={formData.client_phone} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="client_email" value={formData.client_email} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          📍 Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
              <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          📋 Job Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
            <select name="job_type" value={formData.job_type} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="office">Office Cleaning</option>
              <option value="residential">Residential</option>
              <option value="deep_clean">Deep Clean</option>
              <option value="carpet">Carpet Cleaning</option>
              <option value="window">Window Cleaning</option>
              <option value="sanitization">Sanitization</option>
              <option value="pest_control">Pest Control</option>
              <option value="garden">Garden Services</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select name="service_type" value={formData.service_type} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="regular">Regular</option>
              <option value="contract">Contract</option>
              <option value="one_time">One Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
            <select name="priority" value={formData.priority} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🟠 High</option>
              <option value="urgent">🔴 Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" name="scheduled_date" value={formData.scheduled_date} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
            <input type="time" name="scheduled_time" value={formData.scheduled_time} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
            <input type="number" name="estimated_duration" value={formData.estimated_duration} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" min="0.5" max="12" step="0.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
            <input type="number" name="team_size" value={formData.team_size} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" min="1" max="10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <select name="frequency" value={formData.frequency} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment & Chemicals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔧 Equipment Needed</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Vacuum Cleaner', 'Floor Buffer', 'Pressure Washer', 'Carpet Cleaner', 'Ladder', 'Mop & Bucket'].map(item => (
              <button key={item} type="button" onClick={() => toggleEquipment(item)}
                className={`px-3 py-2 rounded-lg text-sm border transition-all
                  ${formData.equipment_needed.includes(item) 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🧪 Chemicals Needed</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Disinfectant', 'Glass Cleaner', 'Floor Cleaner', 'Bleach', 'Degreaser', 'Air Freshener'].map(item => (
              <button key={item} type="button" onClick={() => toggleChemical(item)}
                className={`px-3 py-2 rounded-lg text-sm border transition-all
                  ${formData.chemicals_needed.includes(item) 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Notes</h3>
        <textarea name="notes" value={formData.notes} onChange={handleChange}
          rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="General notes about the job..."></textarea>
        <textarea name="special_instructions" value={formData.special_instructions} onChange={handleChange}
          rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
          placeholder="Special instructions for the cleaning team..."></textarea>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium">
          Cancel
        </motion.button>
        <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium flex items-center space-x-2">
          <MdSave /> <span>Create Job</span>
        </motion.button>
      </div>
    </form>
  )
}

export default JobForm
