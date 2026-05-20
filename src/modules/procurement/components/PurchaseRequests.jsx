import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdAdd, MdEdit, MdDelete, MdCheckCircle, MdCancel,
  MdShoppingCart, MdAttachMoney, MdPerson, MdCalendarToday,
  MdFilterList, MdArrowUpward, MdArrowDownward,
  MdWarning, MdHourglassEmpty, MdDescription,
  MdLocalOffer, MdPriorityHigh
} from 'react-icons/md'

const PurchaseRequests = ({ requests, onCreate, onApprove, onDelete, searchTerm, filters, loading }) => {
  const [showForm, setShowForm] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    category: 'chemicals',
    quantity: 1,
    unit: 'liters',
    estimated_cost: 0,
    priority: 'medium',
    required_by: '',
    department: 'Operations',
    requested_by: 'Current User',
    notes: '',
    supplier_preference: ''
  })

  const categories = ['chemicals', 'equipment', 'ppe', 'uniforms', 'consumables', 'tools']
  const units = ['liters', 'kg', 'pieces', 'boxes', 'pairs', 'sets', 'meters', 'rolls']

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate({
      ...formData,
      request_number: `PR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    })
    setShowForm(false)
    setFormData({
      item_name: '', description: '', category: 'chemicals', quantity: 1,
      unit: 'liters', estimated_cost: 0, priority: 'medium',
      required_by: '', department: 'Operations', requested_by: 'Current User',
      notes: '', supplier_preference: ''
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      ordered: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-purple-100 text-purple-800 border-purple-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return badges[status] || badges.pending
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return badges[priority] || badges.medium
  }

  const filteredRequests = requests
    .filter(req => {
      if (searchTerm && !req.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !req.request_number?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filters.status !== 'all' && req.status !== filters.status) return false
      if (filters.category !== 'all' && req.category !== filters.category) return false
      return true
    })
    .sort((a, b) => {
      const aVal = a[sortConfig.key] || ''
      const bVal = b[sortConfig.key] || ''
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Purchase Requests</h2>
            <p className="text-gray-500 mt-1">{filteredRequests.length} requests found</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 
                     transition-colors font-medium flex items-center space-x-2 shadow-lg"
          >
            <MdAdd /> <span>New Request</span>
          </motion.button>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left text-sm font-medium cursor-pointer"
                    onClick={() => setSortConfig({ key: 'request_number', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  Request # {sortConfig.key === 'request_number' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-left text-sm font-medium">Item</th>
                <th className="p-4 text-left text-sm font-medium">Category</th>
                <th className="p-4 text-center text-sm font-medium">Quantity</th>
                <th className="p-4 text-right text-sm font-medium">Est. Cost</th>
                <th className="p-4 text-left text-sm font-medium">Priority</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Date</th>
                <th className="p-4 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="p-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    ))}
                  </tr>
                ))
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-500">
                    <MdShoppingCart className="text-6xl mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No purchase requests found</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req, index) => (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4 font-mono text-sm text-indigo-600">{req.request_number}</td>
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{req.item_name}</p>
                      <p className="text-xs text-gray-500">{req.description}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs capitalize">
                        {req.category}
                      </span>
                    </td>
                    <td className="p-4 text-center">{req.quantity} {req.unit}</td>
                    <td className="p-4 text-right font-medium">${(req.estimated_cost || 0).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(req.priority)}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{req.date}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {req.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onApprove(req.id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                              title="Approve"
                            >
                              <MdCheckCircle />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onDelete(req.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              title="Cancel"
                            >
                              <MdCancel />
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                        >
                          <MdEdit />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Request Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Create Purchase Request</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                    <input type="text" name="item_name" value={formData.item_name} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange}
                      rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Detailed description of the item needed..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg" min="1" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select name="unit" value={formData.unit} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      {units.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost ($)</label>
                    <input type="number" name="estimated_cost" value={formData.estimated_cost} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg" min="0" step="0.01" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Required By</label>
                    <input type="date" name="required_by" value={formData.required_by} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select name="department" value={formData.department} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Operations</option>
                      <option>HR</option>
                      <option>Finance</option>
                      <option>Admin</option>
                      <option>Sales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Supplier</label>
                    <input type="text" name="supplier_preference" value={formData.supplier_preference} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Optional" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange}
                      rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium">
                    Cancel
                  </motion.button>
                  <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 font-medium flex items-center space-x-2">
                    <MdAdd /> <span>Create Request</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PurchaseRequests
