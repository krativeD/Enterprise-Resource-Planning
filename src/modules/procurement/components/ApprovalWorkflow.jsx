import React from 'react'
import { motion } from 'framer-motion'
import { MdCheckCircle, MdCancel, MdHourglassEmpty, MdThumbUp, MdThumbDown } from 'react-icons/md'

const ApprovalWorkflow = ({ requests, onApprove, onReject, loading }) => {
  const pendingRequests = requests?.filter(r => r.status === 'pending') || []

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Approval Workflow</h2>
        <p className="text-gray-500">{pendingRequests.length} requests pending approval</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <MdHourglassEmpty className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Pending Approvals</h3>
            <p className="text-gray-500 mt-1">All requests have been processed</p>
          </div>
        ) : (
          pendingRequests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-mono text-sm text-indigo-600">{req.request_number}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      req.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      req.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {req.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{req.item_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{req.description}</p>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-medium">{req.quantity} {req.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Est. Cost</p>
                      <p className="font-medium">${(req.estimated_cost || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Required By</p>
                      <p className="font-medium">{req.required_by || 'N/A'}</p>
                    </div>
                  </div>
                  {req.notes && (
                    <p className="text-sm text-gray-500 mt-2">📝 {req.notes}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onApprove(req.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2 text-sm"
                  >
                    <MdThumbUp /> <span>Approve</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReject(req.id, prompt('Rejection reason:') || 'Rejected')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center space-x-2 text-sm"
                  >
                    <MdThumbDown /> <span>Reject</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default ApprovalWorkflow
