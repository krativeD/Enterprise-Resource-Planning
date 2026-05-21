import React from 'react'
import { motion } from 'framer-motion'
import { MdClose, MdLocationOn, MdTimer, MdPerson, MdEdit } from 'react-icons/md'

const JobDetails = ({ job, onClose, onAssign, onComplete, onCancel }) => {
  if (!job) return null

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Job Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <MdClose className="text-2xl" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Job ID</p>
          <p className="font-mono text-blue-600">{job.job_id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Client</p>
          <p className="font-semibold">{job.client_name}</p>
        </div>
        <div className="flex items-start space-x-2">
          <MdLocationOn className="text-gray-400 mt-1" />
          <p className="text-sm">{job.address}</p>
        </div>
        <div className="flex items-center space-x-2">
          <MdTimer className="text-gray-400" />
          <p className="text-sm">{job.scheduled_date} at {job.scheduled_time}</p>
        </div>

        <div className="flex space-x-2 pt-4 border-t">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onAssign}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
            Assign
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm">
            Complete
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default JobDetails
