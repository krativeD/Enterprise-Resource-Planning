import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdLocalShipping, MdCheckCircle, MdTimer, MdAdd, MdLocationOn } from 'react-icons/md'

const DeliveryTracking = ({ deliveries, orders, onRecordDelivery, loading }) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    po_id: '',
    delivery_date: new Date().toISOString().split('T')[0],
    status: 'in_transit',
    notes: '',
    received_by: 'Current User'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onRecordDelivery({
      ...formData,
      delivery_number: `DEL-${Date.now().toString(36).toUpperCase()}`
    })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Delivery Tracking</h2>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl flex items-center space-x-2"
          >
            <MdAdd /> <span>Record Delivery</span>
          </motion.button>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : deliveries.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl shadow-lg p-12 text-center">
            <MdLocalShipping className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Deliveries Recorded</h3>
          </div>
        ) : (
          deliveries.map((del, i) => (
            <motion.div
              key={del.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm text-indigo-600">{del.delivery_number}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  del.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  del.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {del.status?.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">PO: {del.po_id}</p>
              <p className="text-sm text-gray-500">{del.delivery_date}</p>
              {del.notes && <p className="text-xs text-gray-400 mt-2">{del.notes}</p>}
            </motion.div>
          ))
        )}
      </div>

      {/* Record Delivery Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Record Delivery</h2>
              <button onClick={() => setShowForm(false)} className="text-2xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Purchase Order</label>
                <select value={formData.po_id} onChange={(e) => setFormData(prev => ({...prev, po_id: e.target.value}))}
                  className="w-full px-4 py-2 border rounded-lg" required>
                  <option value="">Select PO...</option>
                  {orders?.map(po => (
                    <option key={po.id} value={po.id}>{po.po_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Date</label>
                <input type="date" value={formData.delivery_date}
                  onChange={(e) => setFormData(prev => ({...prev, delivery_date: e.target.value}))}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                  className="w-full px-4 py-2 border rounded-lg">
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="partial">Partial Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                  rows="2" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg flex items-center justify-center space-x-2">
                  <MdCheckCircle /> <span>Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryTracking
