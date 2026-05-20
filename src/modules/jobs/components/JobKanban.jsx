import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MdDragIndicator, MdMoreVert, MdAccessTime,
  MdGroup, MdLocationOn
} from 'react-icons/md'

const JobKanban = ({ jobs, loading, onJobClick, onStatusChange }) => {
  const [draggedJob, setDraggedJob] = useState(null)

  const columns = [
    { id: 'pending', title: 'Pending', color: 'bg-yellow-100', count: jobs.filter(j => j.status === 'pending').length },
    { id: 'assigned', title: 'Assigned', color: 'bg-blue-100', count: jobs.filter(j => j.status === 'assigned').length },
    { id: 'in_progress', title: 'In Progress', color: 'bg-purple-100', count: jobs.filter(j => j.status === 'in_progress').length },
    { id: 'completed', title: 'Completed', color: 'bg-green-100', count: jobs.filter(j => j.status === 'completed').length },
  ]

  const handleDragStart = (job) => {
    setDraggedJob(job)
  }

  const handleDrop = (columnId) => {
    if (draggedJob && draggedJob.status !== columnId) {
      onStatusChange(draggedJob.id, { status: columnId })
    }
    setDraggedJob(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map(column => (
        <div
          key={column.id}
          className="bg-gray-50 rounded-2xl p-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(column.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-800">{column.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${column.color}`}>
                {column.count}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {jobs
              .filter(job => job.status === column.id)
              .map(job => (
                <motion.div
                  key={job.id}
                  draggable
                  onDragStart={() => handleDragStart(job)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onJobClick(job)}
                  className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <MdDragIndicator className="text-gray-400 cursor-move" />
                    <MdMoreVert className="text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-800">{job.client_name}</h4>
                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                    <MdLocationOn />
                    <span className="truncate">{job.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                    <MdAccessTime />
                    <span>{job.scheduled_time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex -space-x-2">
                      {job.assignees?.slice(0, 3).map((a, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs">
                          {a.name?.[0]}
                        </div>
                      ))}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${job.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {job.priority}
                    </span>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default JobKanban
