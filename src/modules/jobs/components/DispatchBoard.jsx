import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  MdDirections, MdTimer, MdPerson, MdLocationOn,
  MdPhone, MdStar, MdWarning, MdCheckCircle,
  MdLocalShipping, MdBuild, MdAccessTime,
  MdGroup, MdArrowForward
} from 'react-icons/md'

const DispatchBoard = ({ jobs, loading, onJobClick, onAssign, onComplete, onCancel }) => {
  const [selectedZone, setSelectedZone] = useState('all')

  const zones = useMemo(() => {
    const uniqueZones = [...new Set(jobs.map(j => j.zone).filter(Boolean))]
    return ['all', ...uniqueZones]
  }, [jobs])

  const columns = [
    { id: 'pending', title: 'Pending', icon: MdAccessTime, color: 'bg-yellow-50 border-yellow-200' },
    { id: 'assigned', title: 'Assigned', icon: MdGroup, color: 'bg-blue-50 border-blue-200' },
    { id: 'in_progress', title: 'In Progress', icon: MdDirections, color: 'bg-purple-50 border-purple-200' },
    { id: 'completed', title: 'Completed', icon: MdCheckCircle, color: 'bg-green-50 border-green-200' },
    { id: 'cancelled', title: 'Cancelled', icon: MdWarning, color: 'bg-red-50 border-red-200' }
  ]

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'border-red-500 bg-red-50',
      high: 'border-orange-500 bg-orange-50',
      medium: 'border-yellow-500 bg-yellow-50',
      low: 'border-green-500 bg-green-50'
    }
    return colors[priority] || 'border-gray-300'
  }

  const getJobTypeIcon = (type) => {
    const icons = {
      office: '🏢',
      residential: '🏠',
      deep_clean: '🧹',
      carpet: '🪑',
      window: '🪟',
      sanitization: '🧴',
      pest_control: '🐛',
      garden: '🌿'
    }
    return icons[type] || '🧹'
  }

  return (
    <div className="space-y-6">
      {/* Zone Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Zone:</span>
        {zones.map(zone => (
          <motion.button
            key={zone}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedZone(zone)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${selectedZone === zone 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {zone === 'all' ? 'All Zones' : `Zone ${zone}`}
          </motion.button>
        ))}
      </div>

      {/* Dispatch Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {columns.map(column => {
          const Icon = column.icon
          const columnJobs = jobs.filter(j => 
            j.status === column.id && 
            (selectedZone === 'all' || j.zone === selectedZone)
          )

          return (
            <div key={column.id} className={`rounded-2xl border-2 ${column.color} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Icon className="text-xl text-gray-600" />
                  <h3 className="font-semibold text-gray-800">{column.title}</h3>
                </div>
                <span className="bg-white px-2 py-1 rounded-full text-sm font-bold text-gray-600">
                  {columnJobs.length}
                </span>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))
                ) : columnJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No jobs</p>
                  </div>
                ) : (
                  columnJobs.map(job => (
                    <motion.div
                      key={job.id}
                      layoutId={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onJobClick(job)}
                      className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer 
                        border-l-4 ${getPriorityColor(job.priority)}`}
                    >
                      {/* Job Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getJobTypeIcon(job.type)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm">
                              {job.client_name}
                            </h4>
                            <p className="text-xs text-gray-500">{job.job_id}</p>
                          </div>
                        </div>
                        {job.is_emergency && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold animate-pulse">
                            EMERGENCY
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-start space-x-2 mb-2">
                        <MdLocationOn className="text-gray-400 mt-0.5" />
                        <p className="text-xs text-gray-600">{job.address}</p>
                      </div>

                      {/* Time */}
                      <div className="flex items-center space-x-2 mb-2">
                        <MdTimer className="text-gray-400" />
                        <p className="text-xs text-gray-600">
                          {job.scheduled_time} • {job.estimated_duration}h
                        </p>
                      </div>

                      {/* Assignees */}
                      {job.assignees && job.assignees.length > 0 && (
                        <div className="flex items-center space-x-2 mb-2">
                          <MdGroup className="text-gray-400" />
                          <div className="flex -space-x-2">
                            {job.assignees.slice(0, 3).map((assignee, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
                                         border-2 border-white flex items-center justify-center text-white text-xs"
                                title={assignee.name}
                              >
                                {assignee.name?.[0]}
                              </div>
                            ))}
                            {job.assignees.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white 
                                            flex items-center justify-center text-gray-600 text-xs">
                                +{job.assignees.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        {column.id === 'pending' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); onAssign(job.id) }}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-medium 
                                     hover:bg-blue-600 transition-colors"
                          >
                            Assign
                          </motion.button>
                        )}
                        {column.id === 'in_progress' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); onComplete(job.id) }}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-medium 
                                     hover:bg-green-600 transition-colors"
                          >
                            Complete
                          </motion.button>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${job.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            job.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`}
                        >
                          {job.priority}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DispatchBoard
